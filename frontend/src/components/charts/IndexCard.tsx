'use client'

import { IndexData } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatPercentage, formatCompactNumber, cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react'

interface IndexCardProps {
  index: IndexData
}

export function IndexCard({ index }: IndexCardProps) {
  const isPositive = index.change >= 0

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{index.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{index.symbol}</p>
          </div>
          <div className={cn(
            'flex items-center gap-1 rounded-full px-2 py-1',
            isPositive ? 'bg-success/10' : 'bg-danger/10'
          )}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-danger" />
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main Value */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold tabular-nums">
              {index.value.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className={cn(
              'flex items-center gap-1',
              isPositive ? 'text-success' : 'text-danger'
            )}>
              {isPositive ? (
                <ArrowUp className="h-5 w-5" />
              ) : (
                <ArrowDown className="h-5 w-5" />
              )}
              <span className="text-lg font-semibold tabular-nums">
                {formatPercentage(index.changePercent)}
              </span>
            </div>
          </div>
          <div className={cn(
            'text-sm font-medium tabular-nums',
            isPositive ? 'text-success' : 'text-danger'
          )}>
            {isPositive ? '+' : ''}{index.change.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} pts
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Open</p>
            <p className="text-sm font-medium tabular-nums">
              {index.open.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Close</p>
            <p className="text-sm font-medium tabular-nums">
              {index.close.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">High</p>
            <p className="text-sm font-medium tabular-nums text-success">
              {index.high.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Low</p>
            <p className="text-sm font-medium tabular-nums text-danger">
              {index.low.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Volume</p>
            <p className="text-sm font-medium tabular-nums">
              {formatCompactNumber(index.volume)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Market Cap</p>
            <p className="text-sm font-medium tabular-nums">
              {formatCompactNumber(index.marketCap)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

