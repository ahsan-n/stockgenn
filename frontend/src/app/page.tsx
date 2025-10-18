import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { IndexCard } from '@/components/charts/IndexCard'
import { IndexChart } from '@/components/charts/IndexChart'
import { SectorSunburst } from '@/components/charts/SectorSunburst'
import { CompaniesTable } from '@/components/charts/CompaniesTable'
import { kse100Index, kse30Index, sectors, allCompanies } from '@/data/mockData'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <IndexCard index={kse100Index} />
            <IndexCard index={kse30Index} />
          </div>
          
          <IndexChart index={kse100Index} />
        </section>

        {/* Sector Analysis */}
        <section id="sectors" className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Sector Analysis</h2>
          <SectorSunburst sectors={sectors} />
        </section>

        {/* Companies Table */}
        <section id="companies" className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Companies Overview</h2>
          <CompaniesTable companies={allCompanies} />
        </section>
      </main>

      <Footer />
    </div>
  )
}

