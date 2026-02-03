'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { CartDrawer } from '@/components/cart/CartDrawer';

export default function Navbar() {
  const { cart, openCart } = useCart();
  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/produits', label: 'Produits' },
    { href: '/a-propos', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold font-heading text-brand-blue-dark tracking-tight">
            Electro<span className="text-brand-orange">Maison</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-all relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openCart} 
              className="relative rounded-full hover:bg-brand-blue/5 transition-all active:scale-95"
            >
              <ShoppingCart className="h-5 w-5 text-gray-700" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold animate-bounce-subtle">
                  {cart.itemCount}
                </span>
              )}
            </Button>
          </div>
        </nav>
      </header>
      <CartDrawer />
    </>
  );
}
