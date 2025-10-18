'use client'

/**
 * Real Data Provider
 * 
 * Client component that loads real PSX data and provides it to child components.
 */

import { useEffect, useState } from 'react'
import { CompanyData, IndexData } from '@/types'
import { loadCementCompanies, loadKSE100Index } from '@/data/realData'
import { kse100Index as mockKSE100, kse30Index as mockKSE30, sectors as mockSectors, allCompanies as mockCompanies } from '@/data/mockData'
import { IndexCard } from '@/components/charts/IndexCard'
import { IndexChart } from '@/components/charts/IndexChart'
import { SectorSunburst } from '@/components/charts/SectorSunburst'
import { CompaniesTable } from '@/components/charts/CompaniesTable'

export function RealDataProvider() {
  const [kse100, setKSE100] = useState<IndexData>(mockKSE100)
  const [companies, setCompanies] = useState<CompanyData[]>(mockCompanies)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'mock' | 'real'>('mock')

  useEffect(() => {
    async function loadData() {
      try {
        // Try to load real data
        const [realKSE100, realCompanies] = await Promise.all([
          loadKSE100Index(),
          loadCementCompanies()
        ])

        if (realKSE100) {
          setKSE100(realKSE100)
          setDataSource('real')
        }

        if (realCompanies && realCompanies.length > 0) {
          setCompanies(realCompanies)
          setDataSource('real')
        }
      } catch (error) {
        console.error('Error loading real data:', error)
        // Keep using mock data
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <main className="flex-1 bg-background">
      {/* Data Source Indicator */}
      {!loading && (
        <div className="container mx-auto px-4 pt-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
            dataSource === 'real' 
              ? 'bg-green-500/10 text-green-600 dark:text-green-400' 
              : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              dataSource === 'real' ? 'bg-green-600' : 'bg-yellow-600'
            }`} />
            {dataSource === 'real' ? 'Real PSX Data' : 'Demo Data'}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Pakistan Stock Exchange Analytics
            </h1>
            <p className="text-lg text-muted-foreground">
              Professional analytical platform for comprehensive market insights
            </p>
          </div>
        </div>
      </section>

      {/* Market Overview */}
      <section id="overview" className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Market Overview</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading market data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <IndexCard index={kse100} />
              <IndexCard index={mockKSE30} />
            </div>
            
            <IndexChart index={kse100} />
          </>
        )}
      </section>

      {/* Sector Analysis */}
      <section id="sectors" className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Sector Analysis</h2>
        <SectorSunburst sectors={mockSectors} />
      </section>

      {/* Companies Table */}
      <section id="companies" className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          {dataSource === 'real' ? 'Cement Sector Companies' : 'Companies Overview'}
        </h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <CompaniesTable companies={companies} />
        )}
      </section>
    </main>
  )
}

