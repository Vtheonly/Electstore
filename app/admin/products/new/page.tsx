'use client';

// /app/admin/products/new/page.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createProduct, getTags, createTag } from '@/lib/supabase/queries-client';
import { CATEGORIES } from '@/lib/constants';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { Tag } from '@/types';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingTags, setFetchingTags] = useState(true);
  const [error, setError] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  
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
    async function loadTags() {
      try {
        const tags = await getTags();
        setAvailableTags(tags);
      } catch (err) {
        console.error('Error loading tags:', err);
      } finally {
        setFetchingTags(false);
      }
    }
    loadTags();
  }, []);

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    
    // Check if tag already exists
    const existingTag = availableTags.find(t => t.name.toLowerCase() === newTagName.toLowerCase());
    if (existingTag) {
      if (!selectedTagIds.includes(existingTag.id)) {
        setSelectedTagIds([...selectedTagIds, existingTag.id]);
      }
      setNewTagName('');
      return;
    }

    try {
      setLoading(true);
      const slug = newTagName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const newTag = await createTag(newTagName.trim(), slug);
      setAvailableTags([...availableTags, newTag]);
      setSelectedTagIds([...selectedTagIds, newTag.id]);
      setNewTagName('');
    } catch (err) {
      setError('Erreur lors de la création du tag');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createProduct({
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        category: formData.category,
        stock: parseInt(formData.stock),
        featured: formData.featured,
        image_url: formData.image_url || null,
      }, selectedTagIds);

      router.push('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du produit');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center text-brand-blue hover:underline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux produits
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Nouveau produit</h1>

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
              disabled={loading}
              placeholder="Ex: Réfrigérateur LG 450L"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                className="w-full p-2 border border-gray-300 rounded-md"
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
                disabled={loading}
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
              disabled={loading}
              placeholder="https://..."
            />
            <p className="text-xs text-gray-500 mt-1">
              URL vers l'image du produit (Supabase Storage ou externe)
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <label className="block text-sm font-medium">Tags du produit</label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTagIds.includes(tag.id)
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tag.name}
                  {selectedTagIds.includes(tag.id) && (
                    <X className="inline-block h-3 w-3 ml-1" />
                  )}
                </button>
              ))}
              {fetchingTags && <p className="text-xs text-gray-400">Chargement des tags...</p>}
            </div>

            <div className="flex gap-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Nouveau tag (ex: 4K, Smart, Promo)"
                disabled={loading}
                className="max-w-[240px]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="icon"
                onClick={handleAddTag}
                disabled={loading || !newTagName.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              disabled={loading}
              className="h-4 w-4 text-brand-blue"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium">
              Produit en vedette (affiché sur la page d'accueil)
            </label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Création...' : 'Créer le produit'}
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="outline" disabled={loading}>
                Annuler
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
