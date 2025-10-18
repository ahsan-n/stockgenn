"""
Configuration for PSX Data Crawler
"""

import os
from typing import Dict, List
from pydantic import BaseModel, Field


class CrawlerConfig(BaseModel):
    """Configuration for the PSX crawler"""
    
    # Base URLs
    base_url: str = Field(default="https://dps.psx.com.pk", description="PSX base URL")
    
    # Rate Limiting
    requests_per_second: float = Field(default=2.0, description="Max requests per second")
    requests_per_minute: int = Field(default=60, description="Max requests per minute")
    
    # Retry Configuration
    max_retries: int = Field(default=3, description="Maximum number of retries")
    retry_delay: float = Field(default=2.0, description="Delay between retries in seconds")
    
    # Timeout Configuration
    request_timeout: int = Field(default=30, description="Request timeout in seconds")
    
    # Headers
    user_agent: str = Field(
        default="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        description="User agent string"
    )
    
    # Data Storage
    output_dir: str = Field(default="./data", description="Output directory for crawled data")
    
    # Logging
    log_level: str = Field(default="INFO", description="Logging level")
    log_file: str = Field(default="./logs/crawler.log", description="Log file path")
    
    # API Endpoints (to be discovered)
    api_endpoints: Dict[str, str] = Field(
        default_factory=lambda: {
            "market_summary": "/api/market/summary",
            "indices": "/api/market/indices",
            "sector_summary": "/api/market/sector-summary",
            "companies": "/api/companies/listing-status",
            "trading_panel": "/api/market/trading-panel",
        },
        description="Known API endpoints"
    )
    
    # Indices to track
    indices: List[str] = Field(
        default_factory=lambda: [
            "KSE100", "KSE30", "ALLSHR", "KMI30", "BKTI", "OGTI",
            "KMIALLSHR", "PSXDIV20", "UPP9", "NITPGI", "NBPPGI",
            "MZNPI", "JSMFI", "ACI", "JSGBKTI", "HBLTTI", "MII30"
        ],
        description="List of indices to track"
    )
    
    # Sectors to track
    sectors: List[str] = Field(
        default_factory=lambda: [
            "Cement", "Oil & Gas", "Banking", "Power", "Fertilizer",
            "Textile", "Chemicals", "Automobile", "Technology", "Pharmaceuticals"
        ],
        description="List of sectors to track"
    )
    
    class Config:
        env_prefix = "PSX_CRAWLER_"


# Default configuration instance
default_config = CrawlerConfig()

