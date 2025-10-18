'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { IndexData, TimeFrame } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface IndexChartProps {
  index: IndexData
}

const timeFrames: TimeFrame[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '5Y', 'ALL']

export function IndexChart({ index }: IndexChartProps) {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>('1M')
  const [chartType, setChartType] = useState<'line' | 'area'>('area')

  // Filter data based on timeframe
  const getFilteredData = () => {
    const daysMap: Record<TimeFrame, number> = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '5Y': 1825,
      'ALL': index.historicalData.length,
    }

    const days = daysMap[selectedTimeFrame]
    return index.historicalData.slice(-days)
  }

  const chartData = getFilteredData().map(point => ({
    date: point.timestamp,
    value: point.value,
    displayDate: format(point.timestamp, selectedTimeFrame === '1D' ? 'HH:mm' : 'MMM dd'),
  }))

  const isPositive = index.change >= 0

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>{index.name} Performance</CardTitle>
          
          {/* Chart Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('area')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                chartType === 'area'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                chartType === 'line'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              Line
            </button>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex flex-wrap gap-2 mt-4">
          {timeFrames.map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeFrame(tf)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                selectedTimeFrame === tf
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isPositive ? '#10B981' : '#EF4444'}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={isPositive ? '#10B981' : '#EF4444'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="displayDate"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [
                    value.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    'Value'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="displayDate"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [
                    value.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                    'Value'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? '#10B981' : '#EF4444'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

