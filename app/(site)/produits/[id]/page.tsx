'use client';

// /app/(site)/produits/[id]/page.tsx

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Package, Shield, Truck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Product } from '@/types';
import { formatCurrency, calculateDiscount } from '@/lib/currency';
import { getProductById } from '@/lib/supabase/queries-client';
import { useCart } from '@/hooks/useCart';

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) {
       // Set initial active image
       if (product.product_images && product.product_images.length > 0) {
         const mainImg = product.product_images.find(img => img.is_main) || product.product_images[0];
         setActiveImage(mainImg.url);
       } else {
         setActiveImage(product.image_url || '');
       }
    }
  }, [product]);

  useEffect(() => {
    async function loadProduct() {
      if (params.id) {
        const data = await getProductById(params.id as string);
        setProduct(data);
        setLoading(false);
      }
    }
    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
          <Link href="/produits">
            <Button>Retour aux produits</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.original_price 
    ? calculateDiscount(product.original_price, product.price)
    : null;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link href="/produits" className="inline-flex items-center text-brand-blue hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux produits
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
            <Image
              src={activeImage || product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount && (
              <span className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold py-2 px-3 rounded-full shadow-md z-10">
                {discount}
              </span>
            )}
          </div>
          
          {/* Thumbnails */}
          {product.product_images && product.product_images.length > 0 && (
             <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
               {product.product_images.sort((a, b) => a.display_order - b.display_order).map((img) => (
                 <button
                   key={img.id}
                   onClick={() => setActiveImage(img.url)}
                   className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                     activeImage === img.url ? 'border-brand-blue shadow-md scale-105' : 'border-transparent hover:border-gray-300'
                   }`}
                 >
                   <Image
                     src={img.url}
                     alt={product.name}
                     fill
                     className="object-cover"
                   />
                 </button>
               ))}
             </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-brand-blue">
                {formatCurrency(product.price)}
              </p>
              {product.original_price && (
                <p className="text-xl text-gray-400 line-through">
                  {formatCurrency(product.original_price)}
                </p>
              )}
            </div>
            {product.original_price && (
              <p className="text-sm text-green-600 mt-1">
                Économisez {formatCurrency(product.original_price - product.price)}
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <Package className="h-5 w-5" />
                <span className="font-semibold">En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <Package className="h-5 w-5" />
                <span className="font-semibold">Rupture de stock</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantité</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </Button>
              <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            size="lg"
            className="w-full mb-6"
            onClick={() => addToCart(product, quantity)}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Ajouter au panier
          </Button>

          {/* Features */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-start gap-3">
              <Truck className="h-6 w-6 text-brand-blue mt-1" />
              <div>
                <h3 className="font-semibold">Livraison gratuite</h3>
                <p className="text-sm text-gray-600">Pour toute commande supérieure à 50,000 DZD</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-brand-blue mt-1" />
              <div>
                <h3 className="font-semibold">Garantie 2 ans</h3>
                <p className="text-sm text-gray-600">Garantie constructeur incluse</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-12">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </Card>
        </div>
      )}

      {/* Specifications */}
      <div className="mt-8">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Spécifications</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Catégorie</p>
              <p className="font-semibold">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Référence</p>
              <p className="font-semibold">{product.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
