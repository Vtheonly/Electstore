import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-blue-dark text-white font-sans">
      <div className="container mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col gap-6">
          <img 
            src="/images/logotamani.png" 
            alt="TAMANI Électroménager" 
            className="h-12 w-auto self-start brightness-0 invert" 
          />
          <p className="text-blue-100/70 leading-relaxed font-medium">Votre partenaire de confiance pour l'électroménager de qualité. Excellence et innovation à votre service depuis plus de vingt ans.</p>
        </div>
        <div>
          <h3 className="text-lg font-heading font-bold mb-6 uppercase tracking-wider">Contact</h3>
          <ul className="space-y-4 text-blue-100/70">
            <li className="hover:text-white transition-colors">123 Boulevard des Martyrs, Alger</li>
            <li className="hover:text-white transition-colors">021 23 45 67</li>
            <li className="hover:text-white transition-colors">contact@tamani-dz.com</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-heading font-bold mb-6 uppercase tracking-wider">Horaires</h3>
          <ul className="space-y-4 text-blue-100/70">
            <li>Samedi - Jeudi : 9h - 19h</li>
            <li className="text-brand-orange/80">Vendredi : Fermé</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 text-center py-8">
        <p className="text-blue-100/40 text-sm font-medium tracking-wide">&copy; {new Date().getFullYear()} TAMANI ÉLECTROMÉNAGER. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
