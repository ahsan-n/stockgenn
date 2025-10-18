"""
PSX Web Scraper - Playwright-based scraper for PSX website

This scraper handles dynamic content and JavaScript-rendered pages.
"""

import asyncio
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

from playwright.async_api import async_playwright, Page, Browser
from loguru import logger

from .config import CrawlerConfig, default_config
from .models import IndexData, CompanyData, SectorData, CrawlerResult


class PSXScraper:
    """
    Web scraper for PSX using Playwright
    """
    
    def __init__(self, config: Optional[CrawlerConfig] = None):
        """
        Initialize the PSX scraper
        
        Args:
            config: Crawler configuration
        """
        self.config = config or default_config
        self.browser: Optional[Browser] = None
        self.page: Optional[Page] = None
        self.playwright = None
    
    async def __aenter__(self):
        """Async context manager entry"""
        await self.start_browser()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.close_browser()
    
    async def start_browser(self):
        """Start Playwright browser"""
        logger.info("Starting Playwright browser...")
        
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        
        context = await self.browser.new_context(
            user_agent=self.config.user_agent,
            viewport={"width": 1920, "height": 1080}
        )
        
        self.page = await context.new_page()
        
        # Enable request interception to capture API calls
        await self.page.route("**/*", self.intercept_request)
        
        logger.success("Playwright browser started")
    
    async def close_browser(self):
        """Close Playwright browser"""
        if self.page:
            await self.page.close()
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()
        
        logger.info("Playwright browser closed")
    
    async def intercept_request(self, route):
        """
        Intercept and log network requests
        
        Args:
            route: Playwright route object
        """
        request = route.request
        
        # Log API requests
        if "/api/" in request.url or "/data/" in request.url:
            logger.info(f"API Request: {request.method} {request.url}")
        
        # Continue with the request
        await route.continue_()
    
    async def navigate_to(self, url: str) -> bool:
        """
        Navigate to a URL
        
        Args:
            url: URL to navigate to
            
        Returns:
            True if successful, False otherwise
        """
        try:
            full_url = f"{self.config.base_url}{url}"
            logger.info(f"Navigating to {full_url}")
            
            response = await self.page.goto(
                full_url,
                wait_until="networkidle",
                timeout=self.config.request_timeout * 1000
            )
            
            if response and response.ok:
                logger.success(f"Successfully navigated to {full_url}")
                return True
            else:
                logger.error(f"Failed to navigate to {full_url}: {response.status if response else 'No response'}")
                return False
                
        except Exception as e:
            logger.error(f"Error navigating to {url}: {e}")
            return False
    
    async def extract_indices_data(self) -> List[Dict[str, Any]]:
        """
        Extract indices data from the page
        
        Returns:
            List of index data dictionaries
        """
        logger.info("Extracting indices data...")
        
        try:
            # Wait for indices to load
            await self.page.wait_for_selector(".index-data, [class*='index'], [class*='Index']", timeout=10000)
            
            # Extract indices using JavaScript
            indices_data = await self.page.evaluate("""
                () => {
                    const indices = [];
                    
                    // Try to find index elements
                    const indexElements = document.querySelectorAll('[class*="index"], [class*="Index"]');
                    
                    indexElements.forEach(element => {
                        const text = element.textContent;
                        
                        // Extract index name
                        const nameMatch = text.match(/(KSE\\d+|ALLSHR|KMI\\d+|[A-Z]+TI|[A-Z]+PI|[A-Z]+I\\d*)/);
                        if (!nameMatch) return;
                        
                        const name = nameMatch[1];
                        
                        // Extract value
                        const valueMatch = text.match(/([\\d,]+\\.\\d+)/);
                        const value = valueMatch ? parseFloat(valueMatch[1].replace(/,/g, '')) : null;
                        
                        // Extract change
                        const changeMatch = text.match(/([+-]?[\\d,]+\\.\\d+)\\s*\\(([+-]?[\\d.]+)%\\)/);
                        const change = changeMatch ? parseFloat(changeMatch[1].replace(/,/g, '')) : null;
                        const changePercent = changeMatch ? parseFloat(changeMatch[2]) : null;
                        
                        if (value) {
                            indices.push({
                                symbol: name,
                                value: value,
                                change: change,
                                changePercent: changePercent
                            });
                        }
                    });
                    
                    return indices;
                }
            """)
            
            logger.success(f"Extracted {len(indices_data)} indices")
            return indices_data
            
        except Exception as e:
            logger.error(f"Error extracting indices data: {e}")
            return []
    
    async def extract_market_summary(self) -> Dict[str, Any]:
        """
        Extract market summary data
        
        Returns:
            Market summary dictionary
        """
        logger.info("Extracting market summary...")
        
        try:
            # Wait for market summary to load
            await self.page.wait_for_selector("[class*='market'], [class*='summary']", timeout=10000)
            
            summary_data = await self.page.evaluate("""
                () => {
                    const summary = {
                        segments: []
                    };
                    
                    // Extract segment data
                    const segmentElements = document.querySelectorAll('[class*="segment"], [class*="board"]');
                    
                    segmentElements.forEach(element => {
                        const text = element.textContent;
                        
                        // Extract segment info
                        const nameMatch = text.match(/(Main Board|GEM Board|Futures|Debt)/i);
                        const tradesMatch = text.match(/Trades[:\\s]*(\\d+)/i);
                        const volumeMatch = text.match(/Volume[:\\s]*([\\d,]+)/i);
                        const valueMatch = text.match(/Value[:\\s]*([\\d,.]+)/i);
                        
                        if (nameMatch) {
                            summary.segments.push({
                                name: nameMatch[1],
                                trades: tradesMatch ? parseInt(tradesMatch[1].replace(/,/g, '')) : 0,
                                volume: volumeMatch ? parseInt(volumeMatch[1].replace(/,/g, '')) : 0,
                                value: valueMatch ? parseFloat(valueMatch[1].replace(/,/g, '')) : 0
                            });
                        }
                    });
                    
                    return summary;
                }
            """)
            
            logger.success("Extracted market summary")
            return summary_data
            
        except Exception as e:
            logger.error(f"Error extracting market summary: {e}")
            return {}
    
    async def extract_companies_table(self) -> List[Dict[str, Any]]:
        """
        Extract companies table data
        
        Returns:
            List of company data dictionaries
        """
        logger.info("Extracting companies table...")
        
        try:
            # Wait for table to load
            await self.page.wait_for_selector("table, [class*='table']", timeout=10000)
            
            companies_data = await self.page.evaluate("""
                () => {
                    const companies = [];
                    const tables = document.querySelectorAll('table');
                    
                    tables.forEach(table => {
                        const rows = table.querySelectorAll('tr');
                        
                        rows.forEach((row, index) => {
                            // Skip header row
                            if (index === 0) return;
                            
                            const cells = row.querySelectorAll('td, th');
                            if (cells.length < 3) return;
                            
                            const company = {
                                symbol: cells[0]?.textContent?.trim(),
                                name: cells[1]?.textContent?.trim(),
                                price: cells[2]?.textContent?.trim(),
                                change: cells[3]?.textContent?.trim(),
                                volume: cells[4]?.textContent?.trim()
                            };
                            
                            if (company.symbol) {
                                companies.push(company);
                            }
                        });
                    });
                    
                    return companies;
                }
            """)
            
            logger.success(f"Extracted {len(companies_data)} companies")
            return companies_data
            
        except Exception as e:
            logger.error(f"Error extracting companies table: {e}")
            return []
    
    async def scrape_main_page(self) -> CrawlerResult:
        """
        Scrape the main page for all available data
        
        Returns:
            CrawlerResult with scraped data
        """
        logger.info("Scraping main page...")
        
        # Navigate to main page
        if not await self.navigate_to("/"):
            return CrawlerResult(
                success=False,
                data_type="main_page",
                error="Failed to navigate to main page"
            )
        
        # Wait for page to fully load
        await asyncio.sleep(2)
        
        # Extract all data
        indices = await self.extract_indices_data()
        market_summary = await self.extract_market_summary()
        companies = await self.extract_companies_table()
        
        # Take screenshot
        screenshot_path = Path(self.config.output_dir) / "raw" / "screenshot.png"
        await self.page.screenshot(path=str(screenshot_path), full_page=True)
        logger.info(f"Screenshot saved to {screenshot_path}")
        
        scraped_data = {
            "indices": indices,
            "market_summary": market_summary,
            "companies": companies,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save scraped data
        output_path = Path(self.config.output_dir) / "raw" / "scraped_data.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(scraped_data, f, indent=2)
        
        logger.success("Main page scraping completed")
        
        return CrawlerResult(
            success=True,
            data_type="main_page",
            data=scraped_data,
            metadata={"screenshot": str(screenshot_path)}
        )
    
    async def capture_network_requests(self, duration: int = 30) -> List[Dict[str, Any]]:
        """
        Capture network requests for a duration
        
        Args:
            duration: Duration in seconds to capture requests
            
        Returns:
            List of captured requests
        """
        logger.info(f"Capturing network requests for {duration} seconds...")
        
        captured_requests = []
        
        async def handle_request(request):
            captured_requests.append({
                "url": request.url,
                "method": request.method,
                "headers": request.headers,
                "timestamp": datetime.now().isoformat()
            })
        
        async def handle_response(response):
            for req in captured_requests:
                if req["url"] == response.url:
                    req["status"] = response.status
                    req["response_headers"] = response.headers
        
        # Set up listeners
        self.page.on("request", handle_request)
        self.page.on("response", handle_response)
        
        # Navigate and wait
        await self.navigate_to("/")
        await asyncio.sleep(duration)
        
        # Save captured requests
        output_path = Path(self.config.output_dir) / "raw" / "network_requests.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(captured_requests, f, indent=2)
        
        logger.success(f"Captured {len(captured_requests)} network requests")
        
        # Filter API requests
        api_requests = [
            req for req in captured_requests
            if "/api/" in req["url"] or "/data/" in req["url"] or "/services/" in req["url"]
        ]
        
        logger.info(f"Found {len(api_requests)} API requests")
        
        return api_requests

