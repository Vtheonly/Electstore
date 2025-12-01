'use client';

import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/shared/ProductCard';
import { Product } from '@/types';
import { getProducts } from '@/lib/supabase/queries-client';
import { CATEGORIES } from '@/lib/constants';
import { TagFilter } from '@/components/shared/TagFilter/TagFilter';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const options: any = {};
        if (selectedCategory !== 'Tous') {
          options.category = selectedCategory;
        }
        if (selectedTag) {
          options.tag = selectedTag;
        }
        
        const data = await getProducts(options);
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory, selectedTag]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Nos Produits</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={() => setSelectedCategory('Tous')}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedCategory === 'Tous'
              ? 'bg-brand-blue text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Tous
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === category
                ? 'bg-brand-blue text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Tag Filter */}
      <TagFilter selectedTag={selectedTag} onSelectTag={setSelectedTag} />

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 h-96 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Aucun produit trouvé dans cette catégorie.
        </div>
      )}
    </div>
  );
}