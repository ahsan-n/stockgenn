import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { RealDataProvider } from '@/components/RealDataProvider'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <RealDataProvider />
      <Footer />
    </div>
  )
}

