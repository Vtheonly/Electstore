'use client';

// /app/admin/products/[id]/edit/page.tsx

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { getProductById, updateProduct } from '@/lib/supabase/queries-client';
import { CATEGORIES } from '@/lib/constants';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: CATEGORIES[0],
    stock: '0',
    featured: false,
    image_url: '',
  });

  useEffect(() => {
    async function loadProduct() {
      try {
        const product = await getProductById(id) as any;
        if (product) {
          setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            original_price: product.original_price?.toString() || '',
            category: product.category as any,
            stock: product.stock.toString(),
            featured: product.featured,
            image_url: product.image_url || '',
          });
        } else {
          setError('Produit non trouvé');
        }
      } catch (err) {
        setError('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await updateProduct(id, {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        category: formData.category,
        stock: parseInt(formData.stock),
        featured: formData.featured,
        image_url: formData.image_url || null,
      });

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du produit');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center text-brand-blue hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux produits
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Modifier le produit</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nom du produit *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={submitting}
              placeholder="Ex: Réfrigérateur LG 450L"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={submitting}
              rows={4}
              className="w-full p-2 border border-blue-100 rounded-md"
              placeholder="Description détaillée du produit"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Prix (DZD) *</label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                disabled={submitting}
                placeholder="91875"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prix original (DZD)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                disabled={submitting}
                placeholder="101875"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Catégorie *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                required
                disabled={submitting}
                className="w-full p-2 border border-blue-100 rounded-md"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stock *</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                disabled={submitting}
                placeholder="15"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL de l'image</label>
            <Input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              disabled={submitting}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              disabled={submitting}
              className="h-4 w-4 text-brand-blue"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium">
              Produit en vedette (affiché sur la page d'accueil)
            </label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Mise à jour...' : 'Mettre à jour le produit'}
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="outline" disabled={submitting}>
                Annuler
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
