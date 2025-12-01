'use client';

// /components/cart/CartDrawer.tsx

import { X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/currency';

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Panier ({cart.itemCount})</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={closeCart}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg">Votre panier est vide</p>
              <p className="text-sm mt-2">Ajoutez des produits pour commencer</p>
            </div>
          ) : (
            <div>
              {cart.items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={(quantity) => updateQuantity(item.product.id, quantity)}
                  onRemove={() => removeFromCart(item.product.id)}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-brand-blue">{formatCurrency(cart.total)}</span>
            </div>
            <Button className="w-full" size="lg">
              Procéder au paiement
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={closeCart}
            >
              Continuer mes achats
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
