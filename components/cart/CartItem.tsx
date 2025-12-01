'use client';

// /components/cart/CartItem.tsx

import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/Button';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { product, quantity } = item;
  const subtotal = product.price * quantity;

  return (
    <div className="flex gap-4 py-4 border-b">
      <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover rounded"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm truncate">{product.name}</h4>
        <p className="text-xs text-gray-500">{product.category}</p>
        <p className="text-brand-blue font-bold mt-1">{formatCurrency(product.price)}</p>
        
        <div className="flex items-center gap-2 mt-2">
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6"
            onClick={() => onUpdateQuantity(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-8 text-center">{quantity}</span>
          <Button
            size="icon"
            variant="outline"
            className="h-6 w-6"
            onClick={() => onUpdateQuantity(quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col items-end justify-between">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
        <p className="font-bold text-sm">{formatCurrency(subtotal)}</p>
      </div>
    </div>
  );
}
