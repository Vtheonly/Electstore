'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Award, Shield, Users, Heart, Truck, Headphones } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-blue via-brand-blue-dark to-[#0a2540] py-20 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-brand-orange rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Image 
              src="/images/logotamani.png"
              alt="Tamani Électroménager"
              width={200}
              height={70}
              className="mx-auto mb-8 drop-shadow-xl"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Votre Partenaire en Électroménager
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Depuis plus de 20 ans, Tamani Électroménager accompagne les familles algériennes 
              avec des produits de qualité et un service irréprochable.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-blue font-semibold text-sm uppercase tracking-wider">Notre Histoire</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-gray-900">
                Une Passion pour l'Excellence
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">Tamani Électroménager</strong> est née de la vision de créer 
                  un espace où qualité, innovation et service client se rencontrent. Fondée avec 
                  l'ambition de révolutionner le marché de l'électroménager en Algérie, notre entreprise 
                  s'est rapidement imposée comme une référence incontournable.
                </p>
                <p>
                  Notre nom, <em>"Tamani"</em>, incarne nos aspirations : offrir à chaque foyer algérien 
                  les meilleurs équipements pour un quotidien plus confortable et plus moderne.
                </p>
                <p>
                  Aujourd'hui, nous sommes fiers de servir des milliers de clients satisfaits, 
                  en proposant une sélection rigoureuse des plus grandes marques mondiales : 
                  Samsung, LG, Bosch, Whirlpool et bien d'autres.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Image 
                src="/images/refrigerateur-lg.jpg"
                alt="Réfrigérateur LG"
                width={250}
                height={300}
                className="rounded-xl shadow-lg object-cover w-full h-48"
              />
              <Image 
                src="/images/tv-samsung.jpg"
                alt="TV Samsung"
                width={250}
                height={300}
                className="rounded-xl shadow-lg object-cover w-full h-48 mt-8"
              />
              <Image 
                src="/images/lave-linge-bosch.jpg"
                alt="Lave-linge Bosch"
                width={250}
                height={300}
                className="rounded-xl shadow-lg object-cover w-full h-48"
              />
              <Image 
                src="/images/refrigerateur-samsung.jpg"
                alt="Réfrigérateur Samsung"
                width={250}
                height={300}
                className="rounded-xl shadow-lg object-cover w-full h-48 mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-brand-blue font-semibold text-sm uppercase tracking-wider">Ce Qui Nous Distingue</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-gray-900">Nos Valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-none bg-white">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Qualité Garantie</h3>
              <p className="text-gray-600">
                Nous sélectionnons uniquement des produits certifiés des marques les plus réputées au monde.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-none bg-white">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Confiance</h3>
              <p className="text-gray-600">
                Plus de 20 ans d'expérience et des milliers de clients satisfaits témoignent de notre fiabilité.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-none bg-white">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Service Personnalisé</h3>
              <p className="text-gray-600">
                Notre équipe d'experts vous conseille et vous accompagne pour trouver le produit idéal.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-none bg-white">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Livraison Rapide</h3>
              <p className="text-gray-600">
                Service de livraison efficace sur tout le territoire national avec installation incluse.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-none bg-white">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Headphones className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Support Client</h3>
              <p className="text-gray-600">
                Une équipe dédiée disponible pour répondre à toutes vos questions et résoudre vos problèmes.
              </p>
            </Card>
            
            <Card className="p-8 text-center hover:shadow-xl transition-shadow border-none bg-white">
              <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-brand-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Satisfaction Client</h3>
              <p className="text-gray-600">
                Votre satisfaction est notre priorité absolue. Nous nous engageons à dépasser vos attentes.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-brand-blue text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">20+</div>
              <div className="text-white/80 font-medium">Années d'Expérience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">10K+</div>
              <div className="text-white/80 font-medium">Clients Satisfaits</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">500+</div>
              <div className="text-white/80 font-medium">Produits</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-black mb-2">48</div>
              <div className="text-white/80 font-medium">Wilayas Livrées</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}