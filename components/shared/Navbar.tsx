import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/produits', label: 'Produits' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-brand-blue">
          ElectroMaison
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-600 hover:text-brand-blue transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-6 w-6" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
