'use client';

// /contexts/CartContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Cart, CartItem, Product } from '@/types';

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'electromaison_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const calculateCart = (items: CartItem[]): Cart => {
    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, total, itemCount };
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingItem = prev.items.find((item) => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prev.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prev.items, { product, quantity }];
      }
      
      return calculateCart(newItems);
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter((item) => item.product.id !== productId);
      return calculateCart(newItems);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prev) => {
      const newItems = prev.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      return calculateCart(newItems);
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0, itemCount: 0 });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
