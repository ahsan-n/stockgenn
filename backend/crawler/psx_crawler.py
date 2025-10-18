"""
PSX Data Crawler - Main Implementation

This crawler discovers and fetches data from Pakistan Stock Exchange (PSX).
It uses a hybrid approach: API-first, with fallback to web scraping if needed.
"""

import asyncio
import json
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
from urllib.parse import urljoin, urlparse

import aiohttp
from loguru import logger
from ratelimit import limits, sleep_and_retry

from .config import CrawlerConfig, default_config
from .models import (
    IndexData, MarketSummary, CompanyData, SectorData,
    CrawlerResult, APIEndpoint, MarketSegment
)


class PSXCrawler:
    """
    Main crawler class for PSX data extraction
    """
    
    def __init__(self, config: Optional[CrawlerConfig] = None):
        """
        Initialize the PSX crawler
        
        Args:
            config: Crawler configuration (uses default if not provided)
        """
        self.config = config or default_config
        self.session: Optional[aiohttp.ClientSession] = None
        self.discovered_endpoints: List[APIEndpoint] = []
        self.setup_logging()
        self.setup_directories()
    
    def setup_logging(self):
        """Setup logging configuration"""
        log_path = Path(self.config.log_file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        
        logger.add(
            self.config.log_file,
            rotation="10 MB",
            retention="30 days",
            level=self.config.log_level,
            format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}"
        )
    
    def setup_directories(self):
        """Setup output directories"""
        output_path = Path(self.config.output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Create subdirectories
        (output_path / "indices").mkdir(exist_ok=True)
        (output_path / "companies").mkdir(exist_ok=True)
        (output_path / "sectors").mkdir(exist_ok=True)
        (output_path / "raw").mkdir(exist_ok=True)
    
    async def __aenter__(self):
        """Async context manager entry"""
        await self.start_session()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.close_session()
    
    async def start_session(self):
        """Start aiohttp session"""
        headers = {
            "User-Agent": self.config.user_agent,
            "Accept": "application/json, text/html, */*",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
        }
        
        timeout = aiohttp.ClientTimeout(total=self.config.request_timeout)
        self.session = aiohttp.ClientSession(
            headers=headers,
            timeout=timeout
        )
        logger.info("HTTP session started")
    
    async def close_session(self):
        """Close aiohttp session"""
        if self.session:
            await self.session.close()
            logger.info("HTTP session closed")
    
    @sleep_and_retry
    @limits(calls=2, period=1)  # 2 requests per second
    async def fetch_url(
        self,
        url: str,
        method: str = "GET",
        params: Optional[Dict] = None,
        data: Optional[Dict] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch data from URL with rate limiting
        
        Args:
            url: URL to fetch
            method: HTTP method
            params: Query parameters
            data: Request body data
            
        Returns:
            Response data or None if failed
        """
        if not self.session:
            await self.start_session()
        
        full_url = urljoin(self.config.base_url, url)
        
        for attempt in range(self.config.max_retries):
            try:
                logger.debug(f"Fetching {full_url} (attempt {attempt + 1})")
                
                async with self.session.request(
                    method,
                    full_url,
                    params=params,
                    json=data
                ) as response:
                    
                    if response.status == 200:
                        content_type = response.headers.get("Content-Type", "")
                        
                        if "application/json" in content_type:
                            data = await response.json()
                            logger.success(f"Successfully fetched JSON from {full_url}")
                            return data
                        else:
                            text = await response.text()
                            logger.success(f"Successfully fetched HTML from {full_url}")
                            return {"html": text, "url": full_url}
                    
                    elif response.status == 404:
                        logger.warning(f"Endpoint not found: {full_url}")
                        return None
                    
                    else:
                        logger.warning(
                            f"Unexpected status {response.status} for {full_url}"
                        )
                        
            except aiohttp.ClientError as e:
                logger.error(f"Request error for {full_url}: {e}")
                
            except Exception as e:
                logger.error(f"Unexpected error for {full_url}: {e}")
            
            # Wait before retry
            if attempt < self.config.max_retries - 1:
                await asyncio.sleep(self.config.retry_delay)
        
        logger.error(f"Failed to fetch {full_url} after {self.config.max_retries} attempts")
        return None
    
    async def discover_api_endpoints(self) -> List[APIEndpoint]:
        """
        Discover API endpoints by analyzing the main page
        
        Returns:
            List of discovered API endpoints
        """
        logger.info("Starting API endpoint discovery...")
        
        # Fetch main page
        main_page = await self.fetch_url("/")
        if not main_page or "html" not in main_page:
            logger.error("Failed to fetch main page")
            return []
        
        html = main_page["html"]
        
        # Common API endpoint patterns
        api_patterns = [
            r'/api/[a-zA-Z0-9_/-]+',
            r'/services/[a-zA-Z0-9_/-]+',
            r'/data/[a-zA-Z0-9_/-]+',
        ]
        
        discovered = set()
        for pattern in api_patterns:
            matches = re.findall(pattern, html)
            discovered.update(matches)
        
        # Create APIEndpoint objects
        endpoints = []
        for endpoint in discovered:
            api_endpoint = APIEndpoint(
                url=endpoint,
                method="GET",
                description=f"Discovered endpoint: {endpoint}",
                response_type="json"
            )
            endpoints.append(api_endpoint)
            logger.info(f"Discovered endpoint: {endpoint}")
        
        self.discovered_endpoints = endpoints
        
        # Save discovered endpoints
        self.save_json(
            {"endpoints": [e.dict() for e in endpoints]},
            "raw/discovered_endpoints.json"
        )
        
        return endpoints
    
    async def fetch_market_summary(self) -> Optional[CrawlerResult]:
        """
        Fetch market summary data
        
        Returns:
            CrawlerResult with market summary data
        """
        logger.info("Fetching market summary...")
        
        # Try known endpoints
        endpoints_to_try = [
            "/api/market/summary",
            "/market/summary",
            "/data/market/summary",
            "/services/market/summary",
        ]
        
        for endpoint in endpoints_to_try:
            data = await self.fetch_url(endpoint)
            if data and "html" not in data:
                # Successfully got JSON data
                logger.success(f"Market summary found at {endpoint}")
                
                # Save raw data
                self.save_json(data, "raw/market_summary.json")
                
                return CrawlerResult(
                    success=True,
                    data_type="market_summary",
                    data=data,
                    metadata={"endpoint": endpoint}
                )
        
        # If no API found, try scraping the main page
        logger.info("No API endpoint found, attempting to scrape main page...")
        main_page = await self.fetch_url("/")
        
        if main_page and "html" in main_page:
            # Parse HTML to extract market summary
            # This would require BeautifulSoup or similar
            logger.info("HTML scraping would be implemented here")
            
            return CrawlerResult(
                success=False,
                data_type="market_summary",
                error="API endpoint not found, HTML scraping needed",
                metadata={"html_available": True}
            )
        
        return CrawlerResult(
            success=False,
            data_type="market_summary",
            error="Failed to fetch market summary"
        )
    
    async def fetch_indices_data(self) -> Optional[CrawlerResult]:
        """
        Fetch all indices data
        
        Returns:
            CrawlerResult with indices data
        """
        logger.info("Fetching indices data...")
        
        endpoints_to_try = [
            "/api/market/indices",
            "/market/indices",
            "/data/indices",
            "/services/indices",
        ]
        
        for endpoint in endpoints_to_try:
            data = await self.fetch_url(endpoint)
            if data and "html" not in data:
                logger.success(f"Indices data found at {endpoint}")
                
                # Save raw data
                self.save_json(data, "raw/indices.json")
                
                return CrawlerResult(
                    success=True,
                    data_type="indices",
                    data=data,
                    metadata={"endpoint": endpoint}
                )
        
        logger.warning("No indices API endpoint found")
        return CrawlerResult(
            success=False,
            data_type="indices",
            error="API endpoint not found"
        )
    
    async def fetch_sector_summary(self) -> Optional[CrawlerResult]:
        """
        Fetch sector summary data
        
        Returns:
            CrawlerResult with sector data
        """
        logger.info("Fetching sector summary...")
        
        endpoints_to_try = [
            "/api/market/sector-summary",
            "/market/sector-summary",
            "/data/sectors",
            "/services/sector-summary",
        ]
        
        for endpoint in endpoints_to_try:
            data = await self.fetch_url(endpoint)
            if data and "html" not in data:
                logger.success(f"Sector summary found at {endpoint}")
                
                # Save raw data
                self.save_json(data, "raw/sector_summary.json")
                
                return CrawlerResult(
                    success=True,
                    data_type="sector_summary",
                    data=data,
                    metadata={"endpoint": endpoint}
                )
        
        logger.warning("No sector summary API endpoint found")
        return CrawlerResult(
            success=False,
            data_type="sector_summary",
            error="API endpoint not found"
        )
    
    async def fetch_companies_list(self) -> Optional[CrawlerResult]:
        """
        Fetch list of all companies
        
        Returns:
            CrawlerResult with companies list
        """
        logger.info("Fetching companies list...")
        
        endpoints_to_try = [
            "/api/companies/listing-status",
            "/companies/listing-status",
            "/data/companies",
            "/services/companies",
        ]
        
        for endpoint in endpoints_to_try:
            data = await self.fetch_url(endpoint)
            if data and "html" not in data:
                logger.success(f"Companies list found at {endpoint}")
                
                # Save raw data
                self.save_json(data, "raw/companies_list.json")
                
                return CrawlerResult(
                    success=True,
                    data_type="companies_list",
                    data=data,
                    metadata={"endpoint": endpoint}
                )
        
        logger.warning("No companies list API endpoint found")
        return CrawlerResult(
            success=False,
            data_type="companies_list",
            error="API endpoint not found"
        )
    
    async def fetch_company_details(self, symbol: str) -> Optional[CrawlerResult]:
        """
        Fetch details for a specific company
        
        Args:
            symbol: Company symbol
            
        Returns:
            CrawlerResult with company details
        """
        logger.info(f"Fetching details for company: {symbol}")
        
        endpoints_to_try = [
            f"/api/companies/{symbol}",
            f"/companies/{symbol}",
            f"/data/company/{symbol}",
            f"/services/company/{symbol}",
        ]
        
        for endpoint in endpoints_to_try:
            data = await self.fetch_url(endpoint)
            if data and "html" not in data:
                logger.success(f"Company details found at {endpoint}")
                
                # Save raw data
                self.save_json(data, f"raw/company_{symbol}.json")
                
                return CrawlerResult(
                    success=True,
                    data_type="company_details",
                    data=data,
                    metadata={"endpoint": endpoint, "symbol": symbol}
                )
        
        logger.warning(f"No company details API endpoint found for {symbol}")
        return CrawlerResult(
            success=False,
            data_type="company_details",
            error="API endpoint not found",
            metadata={"symbol": symbol}
        )
    
    async def crawl_all(self) -> Dict[str, CrawlerResult]:
        """
        Crawl all available data
        
        Returns:
            Dictionary of crawler results
        """
        logger.info("Starting comprehensive crawl...")
        
        results = {}
        
        # Discover API endpoints first
        await self.discover_api_endpoints()
        
        # Fetch all data types
        tasks = [
            ("market_summary", self.fetch_market_summary()),
            ("indices", self.fetch_indices_data()),
            ("sector_summary", self.fetch_sector_summary()),
            ("companies_list", self.fetch_companies_list()),
        ]
        
        for name, task in tasks:
            result = await task
            results[name] = result
            
            # Small delay between requests
            await asyncio.sleep(0.5)
        
        # Save summary
        summary = {
            "timestamp": datetime.now().isoformat(),
            "results": {
                name: {
                    "success": result.success,
                    "error": result.error
                }
                for name, result in results.items()
            }
        }
        self.save_json(summary, "raw/crawl_summary.json")
        
        logger.info("Comprehensive crawl completed")
        return results
    
    def save_json(self, data: Any, filename: str):
        """
        Save data as JSON file
        
        Args:
            data: Data to save
            filename: Output filename (relative to output_dir)
        """
        output_path = Path(self.config.output_dir) / filename
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        
        logger.debug(f"Saved data to {output_path}")
    
    def load_json(self, filename: str) -> Optional[Any]:
        """
        Load data from JSON file
        
        Args:
            filename: Input filename (relative to output_dir)
            
        Returns:
            Loaded data or None if file doesn't exist
        """
        input_path = Path(self.config.output_dir) / filename
        
        if not input_path.exists():
            logger.warning(f"File not found: {input_path}")
            return None
        
        with open(input_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        logger.debug(f"Loaded data from {input_path}")
        return data

