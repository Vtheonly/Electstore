'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Product } from '@/types';
import { formatCurrency, calculateDiscount } from '@/lib/currency';
import { useCart } from '@/hooks/useCart';

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
    <Card className="overflow-hidden group">
      <Link href={`/produits/${product.id}`}>
        <div className="relative">
          <Image 
            src={product.image_url || '/placeholder-product.jpg'} 
            alt={product.name} 
            width={400} 
            height={300} 
            className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300" 
          />
          {discount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">{discount}</span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <Link href={`/produits/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 h-14 hover:text-brand-blue transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-baseline space-x-2 mb-4">
          <p className="text-xl font-bold text-brand-blue">{formatCurrency(product.price)}</p>
          {product.original_price && (
            <p className="text-sm text-gray-400 line-through">{formatCurrency(product.original_price)}</p>
          )}
        </div>
        <Button 
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
        >
          Ajouter au panier
        </Button>
      </div>
    </Card>
  );
};
