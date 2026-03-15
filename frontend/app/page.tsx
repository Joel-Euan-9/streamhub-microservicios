'use client'

import { useState, useEffect, useRef } from 'react'
import Footer from './components/Footer'
import FAQSection from './components/FaqSection'
import FeaturesSection from './components/FeaturesSection'
import DevicesSection from './components/DevicesSection'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MoviesCarousel from './components/MoviesCarousel'

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function PrincipalPage() {
  return (
    <>
      <Navbar />
      <main className="mt-[70px] p-0">
        <HeroSection />
        <MoviesCarousel />
        <DevicesSection />
        <FeaturesSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
