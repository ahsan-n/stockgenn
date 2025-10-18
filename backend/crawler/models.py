"""
Data models for PSX crawler
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class DayRange(BaseModel):
    """Day range model"""
    low: float
    high: float


class WeekRange52(BaseModel):
    """52-week range model"""
    low: float
    high: float


class IndexData(BaseModel):
    """Model for index data"""
    symbol: str = Field(..., description="Index symbol (e.g., KSE100)")
    name: str = Field(..., description="Index full name")
    value: float = Field(..., description="Current index value")
    change: float = Field(..., description="Absolute change")
    change_percent: float = Field(..., description="Percentage change")
    high: Optional[float] = Field(None, description="Day high")
    low: Optional[float] = Field(None, description="Day low")
    volume: Optional[int] = Field(None, description="Trading volume")
    previous_close: Optional[float] = Field(None, description="Previous close value")
    year_change: Optional[float] = Field(None, description="1-year change percentage")
    ytd_change: Optional[float] = Field(None, description="Year-to-date change percentage")
    day_range: Optional[DayRange] = Field(None, description="Day range")
    week_range_52: Optional[WeekRange52] = Field(None, description="52-week range")
    timestamp: datetime = Field(default_factory=datetime.now, description="Data timestamp")


class MarketSegment(BaseModel):
    """Model for market segment data"""
    name: str = Field(..., description="Segment name")
    state: str = Field(..., description="Market state (Open/Closed)")
    trades: int = Field(..., description="Number of trades")
    volume: int = Field(..., description="Trading volume")
    value: float = Field(..., description="Trading value")


class MarketSummary(BaseModel):
    """Model for market summary"""
    date: str = Field(..., description="Market date")
    timestamp: datetime = Field(default_factory=datetime.now, description="Data timestamp")
    segments: List[MarketSegment] = Field(default_factory=list, description="Market segments")


class CompanyData(BaseModel):
    """Model for company data"""
    symbol: str = Field(..., description="Company symbol")
    name: str = Field(..., description="Company name")
    sector: str = Field(..., description="Sector name")
    current_price: Optional[float] = Field(None, description="Current price")
    change: Optional[float] = Field(None, description="Price change")
    change_percent: Optional[float] = Field(None, description="Price change percentage")
    volume: Optional[int] = Field(None, description="Trading volume")
    market_cap: Optional[float] = Field(None, description="Market capitalization")
    pe_ratio: Optional[float] = Field(None, description="P/E ratio")
    dividend_yield: Optional[float] = Field(None, description="Dividend yield")
    high: Optional[float] = Field(None, description="Day high")
    low: Optional[float] = Field(None, description="Day low")
    timestamp: datetime = Field(default_factory=datetime.now, description="Data timestamp")


class SectorData(BaseModel):
    """Model for sector data"""
    name: str = Field(..., description="Sector name")
    companies_count: int = Field(..., description="Number of companies")
    total_volume: Optional[int] = Field(None, description="Total sector volume")
    total_value: Optional[float] = Field(None, description="Total sector value")
    change_percent: Optional[float] = Field(None, description="Sector change percentage")
    top_companies: List[str] = Field(default_factory=list, description="Top performing companies")
    timestamp: datetime = Field(default_factory=datetime.now, description="Data timestamp")


class CrawlerResult(BaseModel):
    """Model for crawler result"""
    success: bool = Field(..., description="Whether crawl was successful")
    data_type: str = Field(..., description="Type of data crawled")
    data: Optional[Any] = Field(None, description="Crawled data")
    error: Optional[str] = Field(None, description="Error message if failed")
    timestamp: datetime = Field(default_factory=datetime.now, description="Crawl timestamp")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")


class APIEndpoint(BaseModel):
    """Model for discovered API endpoint"""
    url: str = Field(..., description="Endpoint URL")
    method: str = Field(default="GET", description="HTTP method")
    description: str = Field(..., description="Endpoint description")
    parameters: Dict[str, str] = Field(default_factory=dict, description="Query parameters")
    headers: Dict[str, str] = Field(default_factory=dict, description="Required headers")
    response_type: str = Field(..., description="Expected response type")
    discovered_at: datetime = Field(default_factory=datetime.now, description="Discovery timestamp")

