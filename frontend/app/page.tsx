// 1. ELIMINAMOS el 'use client' de aquí para que sea un Server Component

import FAQSection from './components/FaqSection'
import FeaturesSection from './components/FeaturesSection'
import DevicesSection from './components/DevicesSection'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MoviesCarousel from './components/MoviesCarousel'
import SubscriptionsSection from './components/SubscriptionsSection' // <--- Nueva importación

// 2. Función para obtener los estrenos desde el Gateway (Red interna de Docker)
async function getEstrenos() {
  try {
    const res = await fetch('http://gateway-service:8000/api/peliculas/estrenos', { 
      cache: 'no-store' // Para que siempre traiga lo más nuevo
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error cargando estrenos:", error);
    return [];
  }
}

export default async function PrincipalPage() {
  // 3. Llamamos a la función (esto ocurre en el servidor)
  const peliculasEstreno = await getEstrenos();
  // Tomamos las primeras 4 para el Hero, el resto se queda para el carrusel
  const peliculasHero = peliculasEstreno.slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="mt-[70px] p-0">
        <div id="inicio"><HeroSection peliculas={peliculasHero} /></div>
        <div id="estrenos"><MoviesCarousel peliculas={peliculasEstreno} /></div>
        <div id="plataformas"><DevicesSection /></div>
        <div id="suscripciones"><SubscriptionsSection /></div>
        <div id="beneficios"><FeaturesSection /></div>
        <div id="ayuda"><FAQSection /></div>
      </main>
    </>
  )
}