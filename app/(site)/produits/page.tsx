import { ProductCard } from '@/components/shared/ProductCard';

// Placeholder data - replace with data from Supabase
const products = [
  { id: 1, category: 'Réfrigérateurs', name: 'Réfrigérateur LG 450L', price: '699€', originalPrice: '775€', discount: '-10%', imageUrl: 'https://images.unsplash.com/photo-1617933622489-5e2a2d6e5a40?q=80&w=1974&auto=format&fit=crop' },
  { id: 2, category: 'Réfrigérateurs', name: 'Réfrigérateur Samsung 380L', price: '540€', originalPrice: '600€', discount: '-10%', imageUrl: 'https://images.unsplash.com/photo-1617933622489-5e2a2d6e5a40?q=80&w=1974&auto=format&fit=crop' },
  { id: 3, category: 'Lave-linge', name: 'Lave-linge Bosch 8kg', price: '445€', imageUrl: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=2070&auto=format&fit=crop' },
  { id: 4, category: 'TV', name: 'TV Samsung 55" 4K', price: '799€', imageUrl: 'https://images.unsplash.com/photo-1593784944526-659f83562b66?q=80&w=2070&auto=format&fit=crop' },
  { id: 5, category: 'TV', name: 'TV LG 65" OLED', price: '1299€', imageUrl: 'https://images.unsplash.com/photo-1593784944526-659f83562b66?q=80&w=2070&auto=format&fit=crop' },
  { id: 6, category: 'Lave-linge', name: 'Lave-linge Whirlpool 10kg', price: '599€', imageUrl: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?q=80&w=2070&auto=format&fit=crop' },
];

export default function ProductsPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-4">Nos Produits</h1>
      <p className="text-center text-gray-600 mb-8">Découvrez notre sélection d'électroménager de cuisine</p>
      
      <div className="flex justify-center space-x-2 mb-12">
        <button className="bg-brand-blue text-white py-2 px-4 rounded-full">Tous</button>
        <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300">Réfrigérateurs</button>
        <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300">Lave-linge</button>
        <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300">TV</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}