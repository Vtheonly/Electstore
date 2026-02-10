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
            <li><a href="https://www.google.com/maps?q=36.7010273,4.039739&z=17&hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">12 Salopards, Tizi Ouzou</a></li>
            <li><a href="tel:+213552010434" className="hover:text-white transition-colors">+213 552 010 434</a></li>
            <li><a href="tel:+213669677849" className="hover:text-white transition-colors">0669 67 78 49</a></li>
            <li><a href="mailto:Akkoumoh10@gmail.com" className="hover:text-white transition-colors">Akkoumoh10@gmail.com</a></li>
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
