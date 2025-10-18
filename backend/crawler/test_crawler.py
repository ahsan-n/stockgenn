"""
Simple test script for PSX Crawler

Run this to verify the crawler is working correctly.
"""

import asyncio
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from crawler.psx_crawler import PSXCrawler
from crawler.psx_scraper import PSXScraper
from crawler.config import CrawlerConfig


async def test_crawler():
    """Test the API crawler"""
    print("\n" + "="*60)
    print("Testing PSX API Crawler")
    print("="*60 + "\n")
    
    config = CrawlerConfig(
        output_dir="./test_data",
        log_level="INFO"
    )
    
    try:
        async with PSXCrawler(config) as crawler:
            # Test 1: Discover endpoints
            print("[1/4] Testing API discovery...")
            endpoints = await crawler.discover_api_endpoints()
            print(f"      ✓ Discovered {len(endpoints)} endpoints\n")
            
            # Test 2: Fetch market summary
            print("[2/4] Testing market summary fetch...")
            result = await crawler.fetch_market_summary()
            status = "✓" if result.success else "✗"
            print(f"      {status} Market summary: {result.error or 'Success'}\n")
            
            # Test 3: Fetch indices
            print("[3/4] Testing indices fetch...")
            result = await crawler.fetch_indices_data()
            status = "✓" if result.success else "✗"
            print(f"      {status} Indices: {result.error or 'Success'}\n")
            
            # Test 4: Fetch sectors
            print("[4/4] Testing sector summary fetch...")
            result = await crawler.fetch_sector_summary()
            status = "✓" if result.success else "✗"
            print(f"      {status} Sectors: {result.error or 'Success'}\n")
        
        print("="*60)
        print("API Crawler Test Complete")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n✗ Error during API crawler test: {e}\n")
        return False
    
    return True


async def test_scraper():
    """Test the web scraper"""
    print("\n" + "="*60)
    print("Testing PSX Web Scraper")
    print("="*60 + "\n")
    
    config = CrawlerConfig(
        output_dir="./test_data",
        log_level="INFO"
    )
    
    try:
        async with PSXScraper(config) as scraper:
            # Test scraping
            print("[1/1] Testing web scraping...")
            result = await scraper.scrape_main_page()
            
            if result.success:
                data = result.data
                print(f"      ✓ Scraped successfully")
                print(f"        - Indices: {len(data.get('indices', []))}")
                print(f"        - Companies: {len(data.get('companies', []))}")
                print(f"        - Market Segments: {len(data.get('market_summary', {}).get('segments', []))}\n")
            else:
                print(f"      ✗ Scraping failed: {result.error}\n")
        
        print("="*60)
        print("Web Scraper Test Complete")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n✗ Error during web scraper test: {e}\n")
        return False
    
    return True


async def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("PSX CRAWLER TEST SUITE")
    print("="*60)
    
    # Test API crawler
    api_success = await test_crawler()
    
    # Test web scraper
    scraper_success = await test_scraper()
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    print(f"API Crawler:  {'✓ PASS' if api_success else '✗ FAIL'}")
    print(f"Web Scraper:  {'✓ PASS' if scraper_success else '✗ FAIL'}")
    print("="*60 + "\n")
    
    if api_success and scraper_success:
        print("✓ All tests passed!")
        print("\nNext steps:")
        print("  1. Review test_data/ directory for output")
        print("  2. Run full analysis: python -m crawler.cli analyze")
        print("  3. Review captured data and identify working endpoints")
        print()
        return 0
    else:
        print("✗ Some tests failed. Check logs for details.")
        return 1


if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)

