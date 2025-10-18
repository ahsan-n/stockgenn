'use client'

import { TrendingUp, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none">PSX Analytics</span>
              <span className="text-xs text-muted-foreground">Pakistan Stock Exchange</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#overview" className="text-sm font-medium transition-colors hover:text-primary">
              Overview
            </a>
            <a href="#sectors" className="text-sm font-medium transition-colors hover:text-primary">
              Sectors
            </a>
            <a href="#companies" className="text-sm font-medium transition-colors hover:text-primary">
              Companies
            </a>
            <a href="#analysis" className="text-sm font-medium transition-colors hover:text-primary">
              Analysis
            </a>
          </nav>

          {/* Market Status */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">Market Open</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            mobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col gap-3 pt-4">
            <a
              href="#overview"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Overview
            </a>
            <a
              href="#sectors"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sectors
            </a>
            <a
              href="#companies"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Companies
            </a>
            <a
              href="#analysis"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Analysis
            </a>
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1.5 w-fit">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">Market Open</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

