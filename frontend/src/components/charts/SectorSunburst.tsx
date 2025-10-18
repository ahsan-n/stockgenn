'use client'

import { ResponsiveSunburst } from '@nivo/sunburst'
import { SectorData } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { formatCompactNumber, formatPercentage } from '@/lib/utils'

interface SectorSunburstProps {
  sectors: SectorData[]
}

export function SectorSunburst({ sectors }: SectorSunburstProps) {
  // Transform data for Nivo Sunburst
  const sunburstData = {
    name: 'PSX',
    children: sectors.map(sector => ({
      name: sector.name,
      value: sector.marketCap,
      change: sector.changePercent,
      children: sector.companies.map(company => ({
        name: company.symbol,
        value: company.marketCap,
        change: company.changePercent,
      })),
    })),
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector Distribution</CardTitle>
        <CardDescription>
          Market capitalization by sector and company
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px] w-full">
          <ResponsiveSunburst
            data={sunburstData}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            id="name"
            value="value"
            cornerRadius={2}
            borderWidth={2}
            borderColor={{ theme: 'background' }}
            colors={(node) => {
              // Color based on performance
              const change = (node as unknown as { data: { change?: number } }).data.change || 0
              if (change > 2) return '#10B981' // Strong green
              if (change > 0) return '#34D399' // Light green
              if (change > -2) return '#FCA5A5' // Light red
              return '#EF4444' // Strong red
            }}
            childColor={{
              from: 'color',
              modifiers: [['brighter', 0.3]],
            }}
            enableArcLabels={true}
            arcLabel={(d) => {
              const datum = d as { depth: number; id: string }
              if (datum.depth === 1) return datum.id // Show sector names
              return '' // Hide company names in small slices
            }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 2]],
            }}
            tooltip={({ id, value, data }) => (
              <div className="bg-background border rounded-lg shadow-lg p-3">
                <div className="font-semibold">{id}</div>
                <div className="text-sm text-muted-foreground">
                  Market Cap: {formatCompactNumber(value)}
                </div>
                {typeof (data as unknown as { change?: number }).change === 'number' && (
                  <div className={`text-sm font-medium ${(data as unknown as { change: number }).change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatPercentage((data as unknown as { change: number }).change)}
                  </div>
                )}
              </div>
            )}
            animate={true}
            motionConfig="gentle"
          />
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectors.map((sector) => (
            <div key={sector.id} className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: sector.changePercent >= 0 ? '#10B981' : '#EF4444',
                  }}
                />
                <div>
                  <p className="text-sm font-medium">{sector.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sector.contribution.toFixed(1)}% of market
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${sector.changePercent >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatPercentage(sector.changePercent)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCompactNumber(sector.marketCap)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

