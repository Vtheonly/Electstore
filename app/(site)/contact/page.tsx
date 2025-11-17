import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div>
       {/* Hero Section */}
       <section className="bg-brand-blue py-16 text-white text-center">
        <h1 className="text-4xl font-bold">Contactez-nous</h1>
        <p className="mt-4 text-lg">Notre équipe est à votre disposition pour répondre à toutes vos questions.</p>
      </section>

      {/* Contact Form and Info */}
      <section className="container mx-auto py-16 px-4 grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <MapPin className="h-6 w-6 text-brand-blue mt-1" />
            <div>
              <h3 className="font-semibold">Adresse</h3>
              <p className="text-gray-600">123 Rue du Commerce, 75015 Paris, France</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Phone className="h-6 w-6 text-brand-blue mt-1" />
            <div>
              <h3 className="font-semibold">Téléphone</h3>
              <p className="text-gray-600">01 23 45 67 89</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Mail className="h-6 w-6 text-brand-blue mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-gray-600">contact@electromaison.fr</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Clock className="h-6 w-6 text-brand-blue mt-1" />
            <div>
              <h3 className="font-semibold">Horaires</h3>
              <p className="text-gray-600">Lundi - Samedi : 9h - 19h</p>
              <p className="text-gray-600">Dimanche : 10h - 18h</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-brand-gray p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet *</label>
              <Input type="text" id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
              <Input type="email" id="email" name="email" required />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone</label>
              <Input type="tel" id="phone" name="phone" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label>
              <textarea id="message" name="message" rows={4} className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue" required></textarea>
            </div>
            <Button type="submit" className="w-full">Envoyer le message</Button>
          </form>
        </div>
      </section>
    </div>
  );
}