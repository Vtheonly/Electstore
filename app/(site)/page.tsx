'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Refrigerator, WashingMachine, TvIcon } from 'lucide-react';
import { Product } from '@/types';
import { getProducts } from '@/lib/supabase/queries-client';
import { ProductCard } from '@/components/shared/ProductCard';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadFeaturedProducts() {
      const data = await getProducts({ featured: true, limit: 3 });
      setFeaturedProducts(data);
    }
    loadFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop"
          alt="Boutique d'électroménager"
          fill
          style={{ objectFit: 'cover' }}
          className="absolute z-0 transition-transform duration-[10s] scale-110 animate-slow-zoom"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 via-brand-blue/60 to-brand-blue/90"></div>
        <div className="relative z-10 text-center p-6 max-w-4xl mx-auto">
          <div className="mb-6 inline-block">
            <span className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-xl">
              Qualité Algérienne Premium
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black mb-6 leading-[1.1] tracking-tight">
            Équipez votre maison avec <span className="text-brand-orange">excellence</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed">
            Une sélection rigoureuse d'électroménager haute performance pour un confort inégalé au quotidien.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="h-16 px-10 rounded-2xl shadow-premium hover:shadow-premium-hover transition-all bg-white text-brand-blue hover:bg-gray-100 border-none">
              <Link href="/produits">Découvrir la collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-10 rounded-2xl border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-brand-gray">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8 text-brand-blue">Nos Catégories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Link href="/produits?category=Réfrigérateurs">
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-blue-50">
                <Refrigerator className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
                <h3 className="text-xl font-semibold mb-2">Réfrigérateurs</h3>
                <p className="text-sm text-gray-600">Frigos, congélateurs et caves</p>
              </Card>
            </Link>
            <Link href="/produits?category=Lave-linge">
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-blue-50">
                <WashingMachine className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
                <h3 className="text-xl font-semibold mb-2">Lave-linge</h3>
                <p className="text-sm text-gray-600">Machines à laver et sèche-linge</p>
              </Card>
            </Link>
            <Link href="/produits?category=TV">
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-blue-50">
                <TvIcon className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
                <h3 className="text-xl font-semibold mb-2">TV & Audio</h3>
                <p className="text-sm text-gray-600">Smart TV 4K, OLED et Home Cinéma</p>
              </Card>
            </Link>
            <Link href="/produits?category=Climatiseurs">
              <Card className="p-8 hover:shadow-lg transition-shadow cursor-pointer border-blue-50 text-center">
                <div className="h-12 w-12 mx-auto mb-4 text-brand-blue flex items-center justify-center">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M3 16h18"/><path d="M4 20h16"/><path d="M2 8h20"/><path d="M21 4H3a1 1 0 0 0-1 1v3h20V5a1 1 0 0 0-1-1z"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Climatisation</h3>
                <p className="text-sm text-gray-600">Climatiseurs Split et Mobiles</p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Produits en vedette</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/produits">
                <Button size="lg">Voir tous les produits</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Promotion Section */}
      <section className="bg-white">
        <div className="container mx-auto grid md:grid-cols-2 items-center">
          <div className="p-8 md:p-12 bg-gradient-to-r from-orange-500 to-brand-orange text-white rounded-lg m-4">
             <span className="text-sm font-bold bg-white text-orange-600 py-1 px-3 rounded-full">Promotion en cours</span>
             <h2 className="text-3xl font-bold my-4">-10% sur tous les réfrigérateurs</h2>
             <p className="mb-6">Profitez de notre offre exceptionnelle sur une vaste sélection de réfrigérateurs des plus grandes marques.</p>
             <Button asChild variant="secondary">
                <Link href="/produits">Découvrir l'offre</Link>
             </Button>
          </div>
          <div className="hidden md:block">
             <Image 
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop"
                alt="Cuisine moderne"
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
          </div>
        </div>
      </section>
    </div>
  );
}