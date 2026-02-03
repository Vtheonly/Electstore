'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Product } from '@/types';
import { formatCurrency, calculateDiscount } from '@/lib/currency';
import { useCart } from '@/hooks/useCart';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  
  if (!product) {
    return null;
  }
  
  const discount = product.original_price 
    ? calculateDiscount(product.original_price, product.price)
    : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-premium hover:shadow-premium-hover transition-all duration-500 overflow-hidden flex flex-col h-full">
      <Link href={`/produits/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {discount && (
            <div className="absolute top-4 left-4">
              <span className="bg-brand-orange text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-lg">
                -{discount}%
              </span>
            </div>
          )}
        </div>

        {/* Product Content */}
        <div className="p-6 flex flex-col flex-1">
          <p className="text-[10px] uppercase tracking-widest text-brand-blue/40 font-bold mb-1">
            {product.category}
          </p>
          <h3 className="font-heading font-bold text-lg text-brand-blue-dark mb-2 line-clamp-2 md:group-hover:text-brand-blue transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-4 flex items-end justify-between">
            <div className="space-y-1">
              {product.original_price && (
                <p className="text-xs text-gray-400 line-through font-medium">
                  {formatCurrency(product.original_price)}
                </p>
              )}
              <p className="text-xl font-black text-brand-blue tracking-tight">
                {formatCurrency(product.price)}
              </p>
            </div>
            
            {/* The button is outside the Link to allow separate interaction */}
          </div>
        </div>
      </Link>
      <div className="px-6 pb-6 pt-0"> {/* Added a div for button placement outside the link */}
        <Button 
          size="icon" 
          variant="default" 
          className="w-full rounded-xl shadow-premium opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigation when clicking the button
            addToCart(product);
          }}
        >
          <ShoppingCart className="h-4 w-4 mr-2" /> Ajouter au panier
        </Button>
      </div>
    </div>
  );
};
