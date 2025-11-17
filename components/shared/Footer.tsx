import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-brand-blue-dark text-white">
      <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">ElectroMaison</h3>
          <p className="text-gray-400">Votre magasin d'électroménager de confiance depuis 2010.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Contact</h3>
          <ul className="space-y-2 text-gray-400">
            <li>123 Rue du Commerce, Paris</li>
            <li>01 23 45 67 89</li>
            <li>contact@electromaison.fr</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Horaires</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Lundi - Samedi : 9h - 19h</li>
            <li>Dimanche : 10h - 18h</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} ElectroMaison. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
