"""
JSON Generator for Frontend

Transforms PSX API data into frontend-ready JSON files.
"""

import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any
import asyncio

from loguru import logger

from .psx_crawler import PSXCrawler
from .config import CrawlerConfig


class FrontendJSONGenerator:
    """
    Generates frontend-ready JSON files from PSX data
    """
    
    def __init__(self, output_dir: str = "./frontend/public/data"):
        """
        Initialize the JSON generator
        
        Args:
            output_dir: Directory to output JSON files
        """
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"JSON Generator initialized. Output: {self.output_dir}")
    
    def save_json(self, data: Any, filename: str):
        """Save data as JSON file"""
        output_path = self.output_dir / filename
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
        logger.success(f"Generated: {output_path}")
    
    def transform_indices(self, symbols_data: List[Dict]) -> Dict[str, Any]:
        """
        Transform indices data for frontend
        
        Returns:
            Dictionary with indices information
        """
        # Filter for indices (no debt, no ETF, specific patterns)
        index_patterns = ["KSE", "KMI", "ALLSHR", "BKTI", "OGTI", "PSXDIV", "UPP", "NITPGI", "NBPPGI", "MZNPI", "JSMFI", "ACI", "JSGBKTI", "HBLTTI", "MII"]
        
        indices = []
        for symbol in symbols_data:
            sym = symbol.get("symbol", "")
            if any(sym.startswith(pattern) for pattern in index_patterns):
                if not symbol.get("isDebt") and not symbol.get("isETF"):
                    indices.append({
                        "symbol": sym,
                        "name": symbol.get("name", ""),
                        "sector": symbol.get("sectorName", "")
                    })
        
        return {
            "lastUpdated": datetime.now().isoformat(),
            "totalIndices": len(indices),
            "indices": indices
        }
    
    def transform_eod_to_chart_data(self, eod_data: Dict, symbol: str) -> Dict[str, Any]:
        """
        Transform EOD data to chart-ready format
        
        Args:
            eod_data: Raw EOD data from API
            symbol: Symbol name
            
        Returns:
            Chart-ready data
        """
        if eod_data.get("status") != 1:
            return {"error": "Invalid data"}
        
        time_series = eod_data.get("data", [])
        
        # Transform to chart format
        chart_data = []
        for entry in time_series:
            if len(entry) >= 4:
                timestamp, close, volume, high = entry[0], entry[1], entry[2], entry[3]
                
                # Calculate low (approximate if not provided)
                low = close * 0.98  # Approximate
                
                chart_data.append({
                    "date": datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d"),
                    "timestamp": timestamp,
                    "open": close,  # Approximate (not provided by API)
                    "high": high,
                    "low": low,
                    "close": close,
                    "volume": volume
                })
        
        # Reverse to get chronological order (oldest first)
        chart_data.reverse()
        
        # Calculate statistics
        if chart_data:
            latest = chart_data[-1]
            oldest = chart_data[0]
            
            change = latest["close"] - oldest["close"]
            change_percent = (change / oldest["close"]) * 100 if oldest["close"] else 0
            
            return {
                "symbol": symbol,
                "lastUpdated": datetime.now().isoformat(),
                "dataPoints": len(chart_data),
                "dateRange": {
                    "start": chart_data[0]["date"],
                    "end": chart_data[-1]["date"]
                },
                "statistics": {
                    "latest": latest["close"],
                    "change": round(change, 2),
                    "changePercent": round(change_percent, 2),
                    "high": max(d["high"] for d in chart_data),
                    "low": min(d["low"] for d in chart_data),
                    "avgVolume": sum(d["volume"] for d in chart_data) // len(chart_data)
                },
                "data": chart_data
            }
        
        return {"error": "No data"}
    
    def transform_companies_by_sector(self, symbols_data: List[Dict]) -> Dict[str, Any]:
        """
        Group companies by sector
        
        Returns:
            Companies grouped by sector
        """
        sectors = {}
        
        for symbol in symbols_data:
            # Skip debt instruments and ETFs
            if symbol.get("isDebt") or symbol.get("isETF"):
                continue
            
            sector = symbol.get("sectorName", "Unknown")
            if not sector or sector == "":
                sector = "Unknown"
            
            if sector not in sectors:
                sectors[sector] = []
            
            sectors[sector].append({
                "symbol": symbol.get("symbol"),
                "name": symbol.get("name"),
                "isGEM": symbol.get("isGEM", False)
            })
        
        # Sort sectors by number of companies
        sorted_sectors = dict(sorted(
            sectors.items(),
            key=lambda x: len(x[1]),
            reverse=True
        ))
        
        return {
            "lastUpdated": datetime.now().isoformat(),
            "totalSectors": len(sorted_sectors),
            "totalCompanies": sum(len(companies) for companies in sorted_sectors.values()),
            "sectors": sorted_sectors
        }
    
    def transform_cement_sector(
        self,
        symbols_data: List[Dict],
        cement_eod_data: Dict[str, Dict]
    ) -> Dict[str, Any]:
        """
        Create detailed cement sector data
        
        Args:
            symbols_data: All symbols
            cement_eod_data: EOD data for cement companies
            
        Returns:
            Detailed cement sector data
        """
        # Get cement companies
        cement_companies = [
            s for s in symbols_data
            if s.get("sectorName") == "CEMENT" and not s.get("isDebt")
        ]
        
        companies_with_data = []
        
        for company in cement_companies:
            symbol = company["symbol"]
            eod_data = cement_eod_data.get(symbol)
            
            company_info = {
                "symbol": symbol,
                "name": company["name"],
                "isGEM": company.get("isGEM", False)
            }
            
            # Add latest data if available
            if eod_data and eod_data.get("status") == 1:
                time_series = eod_data.get("data", [])
                if time_series and len(time_series[0]) >= 4:
                    latest = time_series[0]
                    timestamp, close, volume, high = latest[0], latest[1], latest[2], latest[3]
                    
                    # Calculate change from previous day
                    if len(time_series) > 1:
                        prev_close = time_series[1][1]
                        change = close - prev_close
                        change_percent = (change / prev_close) * 100 if prev_close else 0
                    else:
                        change = 0
                        change_percent = 0
                    
                    company_info.update({
                        "currentPrice": close,
                        "change": round(change, 2),
                        "changePercent": round(change_percent, 2),
                        "volume": volume,
                        "high": high,
                        "lastUpdated": datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d")
                    })
            
            companies_with_data.append(company_info)
        
        # Sort by current price (if available)
        companies_with_data.sort(
            key=lambda x: x.get("currentPrice", 0),
            reverse=True
        )
        
        return {
            "lastUpdated": datetime.now().isoformat(),
            "sector": "CEMENT",
            "totalCompanies": len(companies_with_data),
            "companies": companies_with_data
        }
    
    async def generate_all(self):
        """
        Generate all frontend JSON files
        """
        logger.info("Starting JSON generation for frontend...")
        
        config = CrawlerConfig(output_dir="./backend/crawler/data")
        
        async with PSXCrawler(config) as crawler:
            # 1. Fetch all symbols
            logger.info("[1/5] Fetching all symbols...")
            symbols_result = await crawler.fetch_all_symbols()
            
            if not symbols_result.success:
                logger.error("Failed to fetch symbols")
                return
            
            symbols_data = symbols_result.data
            
            # 2. Generate indices list
            logger.info("[2/5] Generating indices.json...")
            indices_json = self.transform_indices(symbols_data)
            self.save_json(indices_json, "indices.json")
            
            # 3. Generate companies by sector
            logger.info("[3/5] Generating companies.json...")
            companies_json = self.transform_companies_by_sector(symbols_data)
            self.save_json(companies_json, "companies.json")
            
            # 4. Fetch and generate KSE100 historical data
            logger.info("[4/5] Generating kse100-historical.json...")
            kse100_result = await crawler.fetch_eod_data("KSE100")
            if kse100_result.success:
                kse100_chart = self.transform_eod_to_chart_data(
                    kse100_result.data,
                    "KSE100"
                )
                self.save_json(kse100_chart, "kse100-historical.json")
            
            # 5. Fetch cement sector data
            logger.info("[5/5] Generating cement-sector.json...")
            cement_companies = [
                s for s in symbols_data
                if s.get("sectorName") == "CEMENT" and not s.get("isDebt")
            ]
            
            cement_eod_data = {}
            for company in cement_companies[:10]:  # Top 10 for now
                symbol = company["symbol"]
                logger.info(f"  Fetching {symbol}...")
                result = await crawler.fetch_eod_data(symbol)
                if result.success:
                    cement_eod_data[symbol] = result.data
                await asyncio.sleep(0.3)
            
            cement_json = self.transform_cement_sector(symbols_data, cement_eod_data)
            self.save_json(cement_json, "cement-sector.json")
        
        logger.success("✅ All JSON files generated successfully!")
        logger.info(f"📁 Output directory: {self.output_dir}")
        logger.info("Files generated:")
        logger.info("  - indices.json")
        logger.info("  - companies.json")
        logger.info("  - kse100-historical.json")
        logger.info("  - cement-sector.json")


async def main():
    """Main entry point"""
    generator = FrontendJSONGenerator()
    await generator.generate_all()


if __name__ == "__main__":
    asyncio.run(main())

