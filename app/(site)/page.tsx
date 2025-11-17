import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Refrigerator, WashingMachine, TvIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1571175443880-49e1d25b2d6c?q=80&w=2070&auto=format&fit=crop"
          alt="Boutique d'électroménager"
          fill
          style={{ objectFit: 'cover' }}
          className="absolute z-0"
        />
        <div className="absolute inset-0 bg-brand-blue opacity-70"></div>
        <div className="relative z-10 text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Votre spécialiste en électroménager</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Qualité, prix compétitifs et service client exceptionnel pour équiper votre maison
          </p>
          <Button asChild size="lg">
            <Link href="/produits">Voir nos produits</Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-brand-gray">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Nos Catégories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8">
              <Refrigerator className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">Réfrigérateurs</h3>
              <p>Large choix de frigos et congélateurs.</p>
            </Card>
            <Card className="p-8">
              <WashingMachine className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">Lave-linge</h3>
              <p>Machines à laver performantes.</p>
            </Card>
            <Card className="p-8">
              <TvIcon className="h-12 w-12 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold mb-2">TV</h3>
              <p>Téléviseurs Smart 4K.</p>
            </Card>
          </div>
        </div>
      </section>

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
                src="https://images.unsplash.com/photo-1617933622489-5e2a2d6e5a40?q=80&w=1974&auto=format&fit=crop"
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