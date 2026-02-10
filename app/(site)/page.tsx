'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Refrigerator, WashingMachine, TvIcon, Waves, Flame, Wind, CookingPot, Bot } from 'lucide-react';
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
          className="absolute z-0"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/80 via-brand-blue/50 to-brand-blue-dark/90"></div>
        <div className="relative z-10 text-center p-6 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/images/logotamani.png"
              alt="Tamani Électroménager"
              width={280}
              height={100}
              className="mx-auto drop-shadow-2xl"
            />
          </div>
          <h1 className="text-4xl md:text-7xl font-heading font-black mb-6 leading-[1.1] tracking-tight text-white drop-shadow-2xl">
            L'excellence <br/><span className="text-white/80">en mouvement</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-white/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Depuis plus de vingt ans, Tamani s'engage pour l'innovation, la qualité et votre confort au quotidien.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button asChild size="lg" className="h-14 px-10 rounded-xl shadow-premium hover:shadow-premium-hover transition-all bg-white text-brand-blue-dark hover:bg-white/90 border-none font-bold uppercase tracking-wider">
              <Link href="/produits">Découvrir</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 rounded-xl border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-bold uppercase tracking-wider">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-brand-blue/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 text-brand-blue-dark">Nos Catégories</h2>
            <div className="h-1 w-20 bg-brand-blue mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <Link href="/produits?category=Réfrigérateurs" className="group">
              <Card className="p-10 hover:shadow-premium-hover transition-all cursor-pointer border-none bg-white group-hover:-translate-y-2 duration-300">
                <Refrigerator className="h-12 w-12 mx-auto mb-6 text-brand-blue group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-bold mb-2 text-brand-blue-dark">Réfrigérateurs</h3>
                <p className="text-sm text-gray-500 font-medium">Frais et élégants</p>
              </Card>
            </Link>
            <Link href="/produits?category=Lave-linge" className="group">
              <Card className="p-10 hover:shadow-premium-hover transition-all cursor-pointer border-none bg-white group-hover:-translate-y-2 duration-300">
                <WashingMachine className="h-12 w-12 mx-auto mb-6 text-brand-blue group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-bold mb-2 text-brand-blue-dark">Lave-linge</h3>
                <p className="text-sm text-gray-500 font-medium">Soin et efficacité</p>
              </Card>
            </Link>
            <Link href="/produits?category=TV" className="group">
              <Card className="p-10 hover:shadow-premium-hover transition-all cursor-pointer border-none bg-white group-hover:-translate-y-2 duration-300">
                <TvIcon className="h-12 w-12 mx-auto mb-6 text-brand-blue group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-bold mb-2 text-brand-blue-dark">TV & Audio</h3>
                <p className="text-sm text-gray-500 font-medium">Immersion totale</p>
              </Card>
            </Link>
            <Link href="/produits?category=Climatiseurs" className="group">
              <Card className="p-10 hover:shadow-premium-hover transition-all cursor-pointer border-none bg-white group-hover:-translate-y-2 duration-300">
                <div className="h-12 w-12 mx-auto mb-6 text-brand-blue group-hover:scale-110 transition-transform flex items-center justify-center">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20"/><path d="M3 16h18"/><path d="M4 20h16"/><path d="M2 8h20"/><path d="M21 4H3a1 1 0 0 0-1 1v3h20V5a1 1 0 0 0-1-1z"/></svg>
                </div>
                <h3 className="text-xl font-heading font-bold mb-2 text-brand-blue-dark">Climatisation</h3>
                <p className="text-sm text-gray-500 font-medium">Confort thermique</p>
              </Card>
            </Link>
            <Link href="/produits?category=Lave-vaisselle" className="group">
              <Card className="p-10 hover:shadow-premium-hover transition-all cursor-pointer border-none bg-white group-hover:-translate-y-2 duration-300">
                <Waves className="h-12 w-12 mx-auto mb-6 text-brand-blue group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-bold mb-2 text-brand-blue-dark">Lave-vaisselle</h3>
                <p className="text-sm text-gray-500 font-medium">Propreté impeccable</p>
              </Card>
            </Link>
            <Link href="/produits?category=Four" className="group">
              <Card className="p-10 hover:shadow-premium-hover transition-all cursor-pointer border-none bg-white group-hover:-translate-y-2 duration-300">
                <Flame className="h-12 w-12 mx-auto mb-6 text-brand-blue group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-bold mb-2 text-brand-blue-dark">Four</h3>
                <p className="text-sm text-gray-500 font-medium">Cuisson parfaite</p>
              </Card>
            </Link>
            <Link href="/produits?category=Hotte" className="group">
              <Card className="p-10 hover:shadow-premium-hover transition-all cursor-pointer border-none bg-white group-hover:-translate-y-2 duration-300">
                <Wind className="h-12 w-12 mx-auto mb-6 text-brand-blue group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-bold mb-2 text-brand-blue-dark">Hotte</h3>
                <p className="text-sm text-gray-500 font-medium">Air pur et frais</p>
              </Card>
            </Link>
            <Link href="/produits?category=Plaque de cuisson" className="group">
              <Card className="p-10 hover:shadow-premium-hover transition-all cursor-pointer border-none bg-white group-hover:-translate-y-2 duration-300">
                <CookingPot className="h-12 w-12 mx-auto mb-6 text-brand-blue group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-bold mb-2 text-brand-blue-dark">Plaque de cuisson</h3>
                <p className="text-sm text-gray-500 font-medium">Performance et style</p>
              </Card>
            </Link>
            <Link href="/produits?category=Petit robot" className="group">
              <Card className="p-10 hover:shadow-premium-hover transition-all cursor-pointer border-none bg-white group-hover:-translate-y-2 duration-300">
                <Bot className="h-12 w-12 mx-auto mb-6 text-brand-blue group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-heading font-bold mb-2 text-brand-blue-dark">Petit robot</h3>
                <p className="text-sm text-gray-500 font-medium">Aide en cuisine</p>
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
          <div className="hidden md:block p-4">
             <Image 
                src="/images/refrigerateur-samsung.jpg"
                alt="Réfrigérateur en promotion"
                width={500}
                height={400}
                className="rounded-lg object-cover shadow-xl"
              />
          </div>
        </div>
      </section>
    </div>
  );
}