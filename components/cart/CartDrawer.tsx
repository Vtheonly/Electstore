'use client';

// /components/cart/CartDrawer.tsx

import { X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartItem } from './CartItem';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();
  
  const handleCheckout = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '213550123456'; // Default if not set
    
    let message = `Bonjour Tamani Électroménager, je souhaite passer une commande :\n\n`;
    
    cart.items.forEach((item) => {
      message += `- ${item.product.name} (x${item.quantity}) : ${formatCurrency(item.product.price * item.quantity)}\n`;
    });
    
    message += `\n*Total : ${formatCurrency(cart.total)}*`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    closeCart();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-all duration-500 bg-black/40",
          isCartOpen ? "opacity-100 backdrop-blur-sm" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-500 ease-in-out flex flex-col",
        isCartOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold font-heading text-brand-blue-dark">Panier</h2>
          <div className="flex items-center gap-2">
            <span className="bg-brand-blue/10 text-brand-blue text-xs font-bold px-2 py-1 rounded-full">
              {cart.itemCount} articles
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={closeCart}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <div className="bg-gray-50 p-6 rounded-full">
                <X className="h-10 w-10 opacity-20" />
              </div>
              <div className="text-center">
                <p className="text-xl font-heading font-semibold text-gray-600">Votre panier est vide</p>
                <p className="text-sm">Ajoutez des produits pour commencer</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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
          <div className="border-t p-6 bg-gray-50/50 space-y-4">
            <div className="flex justify-between items-center text-xl font-bold font-heading">
              <span className="text-gray-600">Total</span>
              <span className="text-brand-blue">{formatCurrency(cart.total)}</span>
            </div>
            <div className="space-y-3 pt-2">
              <Button 
                className="w-full h-14 text-lg font-bold shadow-premium hover:shadow-premium-hover transition-all" 
                size="lg"
                onClick={handleCheckout}
              >
                Commander via WhatsApp
              </Button>
              <Button
                className="w-full text-gray-500 hover:text-gray-700"
                variant="ghost"
                onClick={closeCart}
              >
                Continuer mes achats
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
