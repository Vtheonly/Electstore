import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Award, DollarSign, Users, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-brand-blue py-16 text-white text-center">
        <h1 className="text-4xl font-bold">À propos d'ElectroMaison</h1>
        <p className="mt-4 text-lg">Votre partenaire de confiance pour tous vos besoins en électroménager depuis plus de 15 ans.</p>
      </section>

      {/* History Section */}
      <section className="container mx-auto py-16 px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Notre Histoire</h2>
          <p className="text-gray-600 leading-relaxed">
            Fondée en 2010, ElectroMaison est née de la passion de ses créateurs pour l'innovation et le service client. Nous avons commencé comme une petite boutique de quartier et sommes devenus aujourd'hui une référence dans le domaine de l'électroménager.
            <br /><br />
            Notre mission est simple : offrir à nos clients des produits de qualité aux meilleurs prix, tout en garantissant un service personnalisé et des conseils d'experts. Aujourd'hui, nous sommes fiers de compter plus de 10 000 clients satisfaits et de continuer à grandir grâce à votre confiance.
          </p>
        </div>
        <div>
          <Image 
            src="https://images.unsplash.com/photo-1581093450021-4a7360e9a1f8?q=80&w=2070&auto=format&fit=crop"
            alt="Intérieur du magasin"
            width={500}
            height={400}
            className="rounded-lg shadow-xl"
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-brand-gray py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-8">Nos Valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6">
              <Award className="h-10 w-10 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold">Qualité</h3>
            </Card>
            <Card className="p-6">
              <DollarSign className="h-10 w-10 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold">Prix compétitifs</h3>
            </Card>
            <Card className="p-6">
              <Users className="h-10 w-10 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold">Service client</h3>
            </Card>
            <Card className="p-6">
              <Heart className="h-10 w-10 mx-auto mb-4 text-brand-blue" />
              <h3 className="text-xl font-semibold">Satisfaction</h3>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}