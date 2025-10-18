# PSX Data Persistence Strategy

## Overview

This document outlines the strategy for persisting PSX market data in a scalable, efficient, and maintainable way.

## Data Characteristics

### Update Frequency
- **N-1 Data Acceptable**: Real-time data is not required
- **Daily Updates**: End-of-day data is sufficient
- **On-Demand Updates**: Manual refresh capability
- **Historical Data**: Need to maintain time-series data

### Data Types

1. **Time-Series Data** (High Volume, Frequent Updates)
   - Index values (minute/hourly/daily)
   - Company stock prices
   - Trading volumes
   - Market indicators

2. **Reference Data** (Low Volume, Infrequent Updates)
   - Company information
   - Sector definitions
   - Index compositions
   - Market holidays

3. **Analytical Data** (Computed, Cached)
   - Financial ratios
   - Sector aggregations
   - Performance metrics
   - Comparative analysis

## Recommended Architecture

### Option 1: PostgreSQL + TimescaleDB (Recommended)

**Pros:**
- Excellent for time-series data
- ACID compliance
- Rich querying capabilities
- Automatic data retention policies
- Continuous aggregates for performance
- Open source and mature

**Cons:**
- Requires more setup than simple solutions
- Higher resource usage

**Use Cases:**
- Production-grade application
- Complex queries and analytics
- Long-term data retention
- Multi-user access

### Option 2: SQLite + JSON Files (Development)

**Pros:**
- Zero configuration
- Portable
- Fast for small datasets
- Perfect for development

**Cons:**
- Not suitable for production
- Limited concurrent access
- No built-in time-series optimization

**Use Cases:**
- Local development
- Prototyping
- Single-user applications

### Option 3: MongoDB (Alternative)

**Pros:**
- Flexible schema
- Good for document-based data
- Horizontal scaling
- Built-in aggregation framework

**Cons:**
- Less efficient for time-series queries
- No ACID guarantees (without transactions)
- Requires more memory

**Use Cases:**
- Rapid schema evolution
- Document-centric data model
- Microservices architecture

## Recommended Solution: PostgreSQL + TimescaleDB

### Database Schema

```sql
-- Enable TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Indices table
CREATE TABLE indices (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index data (time-series)
CREATE TABLE index_data (
    time TIMESTAMPTZ NOT NULL,
    index_id INTEGER REFERENCES indices(id),
    symbol VARCHAR(20) NOT NULL,
    value DECIMAL(12, 2) NOT NULL,
    change DECIMAL(12, 2),
    change_percent DECIMAL(8, 4),
    high DECIMAL(12, 2),
    low DECIMAL(12, 2),
    volume BIGINT,
    previous_close DECIMAL(12, 2),
    year_change DECIMAL(8, 4),
    ytd_change DECIMAL(8, 4),
    PRIMARY KEY (time, symbol)
);

-- Convert to hypertable
SELECT create_hypertable('index_data', 'time');

-- Sectors table
CREATE TABLE sectors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Companies table
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    sector_id INTEGER REFERENCES sectors(id),
    market_cap DECIMAL(20, 2),
    listing_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company data (time-series)
CREATE TABLE company_data (
    time TIMESTAMPTZ NOT NULL,
    company_id INTEGER REFERENCES companies(id),
    symbol VARCHAR(20) NOT NULL,
    open DECIMAL(12, 2),
    high DECIMAL(12, 2),
    low DECIMAL(12, 2),
    close DECIMAL(12, 2),
    volume BIGINT,
    value DECIMAL(20, 2),
    change DECIMAL(12, 2),
    change_percent DECIMAL(8, 4),
    PRIMARY KEY (time, symbol)
);

SELECT create_hypertable('company_data', 'time');

-- Financial metrics (time-series)
CREATE TABLE financial_metrics (
    time TIMESTAMPTZ NOT NULL,
    company_id INTEGER REFERENCES companies(id),
    symbol VARCHAR(20) NOT NULL,
    pe_ratio DECIMAL(10, 4),
    dividend_yield DECIMAL(8, 4),
    eps DECIMAL(12, 4),
    book_value DECIMAL(12, 4),
    roe DECIMAL(8, 4),
    PRIMARY KEY (time, symbol)
);

SELECT create_hypertable('financial_metrics', 'time');

-- Market summary (time-series)
CREATE TABLE market_summary (
    time TIMESTAMPTZ NOT NULL PRIMARY KEY,
    segment VARCHAR(50) NOT NULL,
    state VARCHAR(20),
    trades INTEGER,
    volume BIGINT,
    value DECIMAL(20, 2)
);

SELECT create_hypertable('market_summary', 'time');

-- Sector performance (time-series)
CREATE TABLE sector_performance (
    time TIMESTAMPTZ NOT NULL,
    sector_id INTEGER REFERENCES sectors(id),
    sector_name VARCHAR(100) NOT NULL,
    companies_count INTEGER,
    total_volume BIGINT,
    total_value DECIMAL(20, 2),
    change_percent DECIMAL(8, 4),
    PRIMARY KEY (time, sector_name)
);

SELECT create_hypertable('sector_performance', 'time');

-- Crawler metadata
CREATE TABLE crawler_runs (
    id SERIAL PRIMARY KEY,
    run_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_type VARCHAR(50) NOT NULL,
    success BOOLEAN NOT NULL,
    records_fetched INTEGER,
    error_message TEXT,
    metadata JSONB
);

-- Indexes for performance
CREATE INDEX idx_index_data_symbol ON index_data(symbol, time DESC);
CREATE INDEX idx_company_data_symbol ON company_data(symbol, time DESC);
CREATE INDEX idx_companies_sector ON companies(sector_id);
CREATE INDEX idx_sector_performance_sector ON sector_performance(sector_name, time DESC);

-- Continuous aggregates for common queries
CREATE MATERIALIZED VIEW daily_index_summary
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', time) AS day,
    symbol,
    first(value, time) AS open,
    max(high) AS high,
    min(low) AS low,
    last(value, time) AS close,
    sum(volume) AS volume
FROM index_data
GROUP BY day, symbol;

CREATE MATERIALIZED VIEW daily_company_summary
WITH (timescaledb.continuous) AS
SELECT
    time_bucket('1 day', time) AS day,
    symbol,
    first(open, time) AS open,
    max(high) AS high,
    min(low) AS low,
    last(close, time) AS close,
    sum(volume) AS volume,
    sum(value) AS value
FROM company_data
GROUP BY day, symbol;

-- Data retention policies
SELECT add_retention_policy('index_data', INTERVAL '5 years');
SELECT add_retention_policy('company_data', INTERVAL '5 years');
SELECT add_retention_policy('financial_metrics', INTERVAL '10 years');
SELECT add_retention_policy('market_summary', INTERVAL '3 years');
```

### Data Flow

```
┌─────────────────┐
│  PSX Website    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PSX Crawler    │
│  (Python)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Raw Data       │
│  (JSON Files)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Processor │
│  (Python)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  PostgreSQL +   │
│  TimescaleDB    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  (FastAPI)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Frontend       │
│  (Next.js)      │
└─────────────────┘
```

## Implementation Plan

### Phase 1: Setup (Week 1)

1. **Install PostgreSQL + TimescaleDB**
   ```bash
   # Docker Compose
   docker-compose up -d postgres
   ```

2. **Create Database Schema**
   ```bash
   psql -U postgres -d psx_db -f schema.sql
   ```

3. **Test Connection**
   ```python
   import psycopg2
   conn = psycopg2.connect(
       host="localhost",
       database="psx_db",
       user="postgres",
       password="password"
   )
   ```

### Phase 2: Data Ingestion (Week 2)

1. **Create Data Processor**
   - Parse JSON from crawler
   - Validate data
   - Transform to database format
   - Bulk insert using COPY

2. **Implement ETL Pipeline**
   - Extract: Run crawler
   - Transform: Clean and validate
   - Load: Insert into database

3. **Schedule Daily Updates**
   - Cron job or Airflow
   - Run after market close
   - Error handling and notifications

### Phase 3: API Layer (Week 3)

1. **Create FastAPI Backend**
   - RESTful endpoints
   - Query optimization
   - Caching layer (Redis)
   - Rate limiting

2. **Implement Queries**
   - Latest index values
   - Historical data
   - Company details
   - Sector performance

### Phase 4: Optimization (Week 4)

1. **Performance Tuning**
   - Query optimization
   - Index tuning
   - Continuous aggregates
   - Caching strategy

2. **Monitoring**
   - Database metrics
   - Query performance
   - Data freshness
   - Error tracking

## Data Update Strategy

### Daily Update Process

```python
# Pseudo-code for daily update
async def daily_update():
    # 1. Run crawler
    crawler_results = await run_crawler()
    
    # 2. Process and validate
    validated_data = validate_data(crawler_results)
    
    # 3. Insert into database
    await insert_data(validated_data)
    
    # 4. Update materialized views
    await refresh_views()
    
    # 5. Log results
    await log_crawler_run(crawler_results)
    
    # 6. Send notifications if errors
    if has_errors(crawler_results):
        await send_alert()
```

### On-Demand Update

```python
# API endpoint for manual refresh
@app.post("/api/refresh")
async def refresh_data(data_type: str):
    # Trigger crawler for specific data type
    result = await run_crawler(data_type)
    return {"status": "success", "records": result.count}
```

## Backup Strategy

### Daily Backups
```bash
# Automated daily backup
pg_dump -U postgres psx_db > backup_$(date +%Y%m%d).sql

# Compress
gzip backup_$(date +%Y%m%d).sql

# Upload to cloud storage
aws s3 cp backup_$(date +%Y%m%d).sql.gz s3://psx-backups/
```

### Point-in-Time Recovery
- Enable WAL archiving
- Continuous backup to S3
- 30-day retention

## Monitoring & Alerts

### Key Metrics
- Data freshness (last update time)
- Crawler success rate
- Database size
- Query performance
- API response times

### Alerts
- Crawler failures
- Data validation errors
- Database connection issues
- Disk space warnings
- Performance degradation

## Cost Estimation

### Development (SQLite)
- Cost: $0
- Storage: Local disk

### Production (AWS RDS + TimescaleDB)
- Database: db.t3.medium (~$60/month)
- Storage: 100GB SSD (~$10/month)
- Backups: 100GB (~$10/month)
- **Total: ~$80/month**

### Alternative (Self-hosted)
- VPS: 4GB RAM, 80GB SSD (~$20/month)
- Backups: S3 storage (~$5/month)
- **Total: ~$25/month**

## Security Considerations

1. **Database Security**
   - Strong passwords
   - SSL/TLS connections
   - Network isolation
   - Regular updates

2. **Access Control**
   - Role-based access
   - Read-only API user
   - Admin user for updates
   - Audit logging

3. **Data Privacy**
   - Public market data (no PII)
   - Comply with PSX terms
   - Proper attribution

## Next Steps

1. **Immediate**: Set up local PostgreSQL + TimescaleDB
2. **Week 1**: Implement database schema
3. **Week 2**: Create data processor
4. **Week 3**: Build API layer
5. **Week 4**: Deploy and optimize

## Questions for Discussion

1. **Update Frequency**: Daily end-of-day or multiple times per day?
2. **Historical Data**: How far back should we store?
3. **Hosting**: Cloud (AWS/GCP) or self-hosted?
4. **Budget**: What's the monthly budget for infrastructure?
5. **Compliance**: Do we need official PSX data license?

