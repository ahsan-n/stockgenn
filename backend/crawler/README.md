# PSX Data Crawler

A sophisticated Python-based crawler for extracting data from Pakistan Stock Exchange (PSX).

## Features

- **Hybrid Approach**: API-first with fallback to web scraping
- **API Discovery**: Automatically discovers API endpoints
- **Network Capture**: Captures and analyzes network requests
- **Web Scraping**: Uses Playwright for dynamic content
- **Rate Limiting**: Respects server resources
- **Robust Error Handling**: Retry logic and comprehensive logging
- **Data Validation**: Pydantic models for type safety
- **Async/Await**: High-performance async operations

## Architecture

```
backend/crawler/
├── __init__.py           # Package initialization
├── config.py             # Configuration management
├── models.py             # Pydantic data models
├── psx_crawler.py        # API-based crawler
├── psx_scraper.py        # Playwright-based scraper
├── cli.py                # Command-line interface
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Installation

1. **Install Python dependencies:**

```bash
cd backend/crawler
pip install -r requirements.txt
```

2. **Install Playwright browsers:**

```bash
playwright install chromium
```

## Usage

### Command Line Interface

The crawler provides several commands:

#### 1. Discover API Endpoints

```bash
python -m crawler.cli discover
```

Discovers potential API endpoints by analyzing the PSX website.

#### 2. Crawl Using APIs

```bash
python -m crawler.cli crawl
```

Attempts to fetch data using discovered API endpoints.

#### 3. Scrape Website

```bash
python -m crawler.cli scrape
```

Scrapes the PSX website using Playwright to extract data from HTML.

#### 4. Capture Network Requests

```bash
python -m crawler.cli capture --duration 30
```

Captures all network requests for a specified duration (default: 30 seconds).

#### 5. Full Analysis

```bash
python -m crawler.cli analyze
```

Runs a comprehensive analysis: discovers APIs, attempts crawling, scrapes website, and captures network requests.

### Programmatic Usage

```python
import asyncio
from crawler.psx_crawler import PSXCrawler
from crawler.config import CrawlerConfig

async def main():
    # Create configuration
    config = CrawlerConfig(
        output_dir="./data",
        log_level="INFO"
    )
    
    # Use the crawler
    async with PSXCrawler(config) as crawler:
        # Discover endpoints
        endpoints = await crawler.discover_api_endpoints()
        
        # Fetch market data
        market_summary = await crawler.fetch_market_summary()
        indices = await crawler.fetch_indices_data()
        sectors = await crawler.fetch_sector_summary()
        companies = await crawler.fetch_companies_list()
        
        # Or crawl everything
        results = await crawler.crawl_all()

if __name__ == "__main__":
    asyncio.run(main())
```

### Web Scraping Example

```python
import asyncio
from crawler.psx_scraper import PSXScraper
from crawler.config import CrawlerConfig

async def main():
    config = CrawlerConfig()
    
    async with PSXScraper(config) as scraper:
        # Scrape main page
        result = await scraper.scrape_main_page()
        
        # Capture network requests
        requests = await scraper.capture_network_requests(duration=30)

if __name__ == "__main__":
    asyncio.run(main())
```

## Configuration

Configuration can be set via:

1. **Environment variables** (prefix: `PSX_CRAWLER_`)
2. **Code** (pass `CrawlerConfig` instance)
3. **Defaults** (see `config.py`)

### Key Configuration Options

```python
CrawlerConfig(
    base_url="https://dps.psx.com.pk",
    requests_per_second=2.0,
    max_retries=3,
    request_timeout=30,
    output_dir="./data",
    log_level="INFO"
)
```

## Output Structure

```
data/
├── indices/              # Index data
├── companies/            # Company data
├── sectors/              # Sector data
└── raw/                  # Raw captured data
    ├── discovered_endpoints.json
    ├── market_summary.json
    ├── indices.json
    ├── sector_summary.json
    ├── companies_list.json
    ├── scraped_data.json
    ├── network_requests.json
    ├── crawl_summary.json
    └── screenshot.png
```

## Data Models

### IndexData

```python
{
    "symbol": "KSE100",
    "name": "KSE 100 Index",
    "value": 163806.21,
    "change": -638.50,
    "change_percent": -0.39,
    "high": 165030.82,
    "low": 163118.01,
    "volume": 500443987,
    "previous_close": 164444.71,
    "year_change": 91.39,
    "ytd_change": 42.28,
    "timestamp": "2025-10-18T..."
}
```

### CompanyData

```python
{
    "symbol": "LUCK",
    "name": "Lucky Cement Limited",
    "sector": "Cement",
    "current_price": 850.50,
    "change": 12.30,
    "change_percent": 1.47,
    "volume": 1234567,
    "market_cap": 123456789000,
    "pe_ratio": 8.5,
    "dividend_yield": 5.2
}
```

### SectorData

```python
{
    "name": "Cement",
    "companies_count": 15,
    "total_volume": 12345678,
    "total_value": 1234567890.0,
    "change_percent": 2.5,
    "top_companies": ["LUCK", "DGKC", "MLCF"]
}
```

## Legal Considerations

⚠️ **IMPORTANT**: The PSX website has legal notices regarding data usage:

> "Any dissemination, transmission, sale, and commercial use of Market Data feed... without acquiring respective rights/license from the PSX is strictly prohibited."

### Recommendations:

1. **Contact PSX**: Email `marketdatarequest@psx.com.pk` for official data license
2. **Use Responsibly**: Implement rate limiting and respectful crawling
3. **Attribution**: Properly attribute data source
4. **Compliance**: Follow PSX terms and conditions
5. **Non-Commercial**: Use for personal/educational purposes only without license

## Troubleshooting

### No API Endpoints Found

If the crawler doesn't find API endpoints, the website likely uses:
- Server-side rendering
- Static HTML with embedded data
- WebSockets or other protocols

**Solution**: Use the web scraper (`scrape` command) instead.

### Playwright Installation Issues

```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt-get install libnss3 libatk-bridge2.0-0 libdrm2 libxkbcommon0 libgbm1

# Install Playwright browsers
playwright install --with-deps chromium
```

### Rate Limiting

If you encounter rate limiting:
1. Reduce `requests_per_second` in config
2. Increase `retry_delay`
3. Add longer delays between operations

## Next Steps

After running the crawler:

1. **Review Output**: Check `data/raw/` directory for captured data
2. **Analyze Network Requests**: Review `network_requests.json` to identify actual API endpoints
3. **Validate Data**: Ensure extracted data matches expected format
4. **Design Persistence**: Plan database schema for storing data
5. **Schedule Updates**: Set up periodic data fetching (N-1 data acceptable)

## Testing

Run tests:

```bash
pytest backend/crawler/tests/
```

## Logging

Logs are written to:
- **Console**: INFO level and above
- **File**: All levels (configurable)

Log file location: `./logs/crawler.log` (configurable)

## Performance

- **Async Operations**: High concurrency for multiple requests
- **Rate Limiting**: Respects server resources (2 req/sec default)
- **Caching**: Saves raw data to avoid redundant requests
- **Efficient Parsing**: Uses native JSON parsing where possible

## Contributing

When contributing:
1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Ensure all tests pass

## License

This crawler is part of the PSX Analytical Platform project.

