"""
CLI tool for PSX Data Crawler
"""

import asyncio
import argparse
import sys
from pathlib import Path

from loguru import logger

from .psx_crawler import PSXCrawler
from .psx_scraper import PSXScraper
from .config import CrawlerConfig


async def discover_apis(config: CrawlerConfig):
    """Discover API endpoints"""
    logger.info("Starting API discovery...")
    
    async with PSXCrawler(config) as crawler:
        endpoints = await crawler.discover_api_endpoints()
        
        print(f"\n{'='*60}")
        print(f"Discovered {len(endpoints)} API endpoints:")
        print(f"{'='*60}\n")
        
        for endpoint in endpoints:
            print(f"  • {endpoint.url}")
        
        print(f"\n{'='*60}\n")


async def crawl_apis(config: CrawlerConfig):
    """Crawl using API endpoints"""
    logger.info("Starting API crawl...")
    
    async with PSXCrawler(config) as crawler:
        results = await crawler.crawl_all()
        
        print(f"\n{'='*60}")
        print("Crawl Results:")
        print(f"{'='*60}\n")
        
        for name, result in results.items():
            status = "✓ SUCCESS" if result.success else "✗ FAILED"
            print(f"  {status} - {name}")
            if result.error:
                print(f"    Error: {result.error}")
        
        print(f"\n{'='*60}\n")


async def scrape_website(config: CrawlerConfig):
    """Scrape website using Playwright"""
    logger.info("Starting web scraping...")
    
    async with PSXScraper(config) as scraper:
        result = await scraper.scrape_main_page()
        
        print(f"\n{'='*60}")
        print("Scraping Results:")
        print(f"{'='*60}\n")
        
        if result.success:
            print("  ✓ Successfully scraped main page")
            if result.data:
                data = result.data
                print(f"\n  Indices: {len(data.get('indices', []))}")
                print(f"  Companies: {len(data.get('companies', []))}")
                print(f"  Market Segments: {len(data.get('market_summary', {}).get('segments', []))}")
        else:
            print(f"  ✗ Scraping failed: {result.error}")
        
        print(f"\n{'='*60}\n")


async def capture_network(config: CrawlerConfig, duration: int):
    """Capture network requests"""
    logger.info(f"Capturing network requests for {duration} seconds...")
    
    async with PSXScraper(config) as scraper:
        requests = await scraper.capture_network_requests(duration)
        
        print(f"\n{'='*60}")
        print(f"Captured {len(requests)} network requests")
        print(f"{'='*60}\n")
        
        # Filter and display API requests
        api_requests = [
            req for req in requests
            if "/api/" in req["url"] or "/data/" in req["url"] or "/services/" in req["url"]
        ]
        
        if api_requests:
            print(f"\nFound {len(api_requests)} API requests:\n")
            for req in api_requests:
                print(f"  {req['method']} {req['url']}")
                print(f"    Status: {req.get('status', 'N/A')}")
        else:
            print("\nNo API requests found. The website might be using:")
            print("  • Server-side rendering")
            print("  • Static HTML with embedded data")
            print("  • WebSockets or other protocols")
        
        print(f"\n{'='*60}\n")


async def run_full_analysis(config: CrawlerConfig):
    """Run full analysis: discover, crawl, and scrape"""
    logger.info("Starting full analysis...")
    
    print(f"\n{'='*80}")
    print("PSX DATA CRAWLER - FULL ANALYSIS")
    print(f"{'='*80}\n")
    
    # Step 1: Discover APIs
    print("\n[1/4] Discovering API endpoints...")
    async with PSXCrawler(config) as crawler:
        endpoints = await crawler.discover_api_endpoints()
        print(f"      Found {len(endpoints)} potential endpoints")
    
    # Step 2: Try API crawling
    print("\n[2/4] Attempting API crawl...")
    async with PSXCrawler(config) as crawler:
        results = await crawler.crawl_all()
        successful = sum(1 for r in results.values() if r.success)
        print(f"      {successful}/{len(results)} API calls successful")
    
    # Step 3: Web scraping
    print("\n[3/4] Web scraping...")
    async with PSXScraper(config) as scraper:
        result = await scraper.scrape_main_page()
        if result.success:
            data = result.data
            print(f"      Scraped {len(data.get('indices', []))} indices")
            print(f"      Scraped {len(data.get('companies', []))} companies")
    
    # Step 4: Network capture
    print("\n[4/4] Capturing network requests (30 seconds)...")
    async with PSXScraper(config) as scraper:
        requests = await scraper.capture_network_requests(30)
        api_requests = [
            req for req in requests
            if "/api/" in req["url"] or "/data/" in req["url"]
        ]
        print(f"      Captured {len(requests)} total requests")
        print(f"      Found {len(api_requests)} API requests")
    
    # Summary
    print(f"\n{'='*80}")
    print("ANALYSIS COMPLETE")
    print(f"{'='*80}\n")
    print(f"Output directory: {config.output_dir}")
    print(f"Log file: {config.log_file}")
    print("\nNext steps:")
    print("  1. Review captured data in the output directory")
    print("  2. Analyze network_requests.json for API endpoints")
    print("  3. Review scraped_data.json for extracted data")
    print("  4. Design data persistence strategy")
    print(f"\n{'='*80}\n")


def main():
    """Main CLI entry point"""
    parser = argparse.ArgumentParser(
        description="PSX Data Crawler - Extract data from Pakistan Stock Exchange"
    )
    
    parser.add_argument(
        "command",
        choices=["discover", "crawl", "scrape", "capture", "analyze"],
        help="Command to execute"
    )
    
    parser.add_argument(
        "--output-dir",
        default="./data",
        help="Output directory for crawled data"
    )
    
    parser.add_argument(
        "--log-file",
        default="./logs/crawler.log",
        help="Log file path"
    )
    
    parser.add_argument(
        "--duration",
        type=int,
        default=30,
        help="Duration for network capture (seconds)"
    )
    
    parser.add_argument(
        "--log-level",
        default="INFO",
        choices=["DEBUG", "INFO", "WARNING", "ERROR"],
        help="Logging level"
    )
    
    args = parser.parse_args()
    
    # Create config
    config = CrawlerConfig(
        output_dir=args.output_dir,
        log_file=args.log_file,
        log_level=args.log_level
    )
    
    # Run command
    try:
        if args.command == "discover":
            asyncio.run(discover_apis(config))
        elif args.command == "crawl":
            asyncio.run(crawl_apis(config))
        elif args.command == "scrape":
            asyncio.run(scrape_website(config))
        elif args.command == "capture":
            asyncio.run(capture_network(config, args.duration))
        elif args.command == "analyze":
            asyncio.run(run_full_analysis(config))
    
    except KeyboardInterrupt:
        logger.info("Interrupted by user")
        sys.exit(0)
    except Exception as e:
        logger.error(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

