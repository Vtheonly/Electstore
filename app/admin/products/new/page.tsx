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
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Tag } from '@/types';
import { ImageUpload } from '@/components/admin/ImageUpload';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingTags, setFetchingTags] = useState(true);
  const [error, setError] = useState('');
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [images, setImages] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: CATEGORIES[0],
    stock: '0',
    featured: false,
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
    
    // Validate images
    const readyImages = images.filter(img => img.status === 'existing');
    if (readyImages.length === 0) {
      setError('Veuillez ajouter au moins une image.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const mainImage = readyImages.find(img => img.is_main) || readyImages[0];

      await createProduct({
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        category: formData.category,
        stock: parseInt(formData.stock),
        featured: formData.featured,
        image_url: mainImage.url, // Legacy support
      }, selectedTagIds, readyImages.map(img => ({ url: img.url, is_main: img.is_main })));

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

            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-2xl space-y-6">
                <ImageUpload 
                  images={images} 
                  onChange={setImages} 
                />

                <div className="pt-6 border-t border-gray-200">
                  <label className="block text-sm font-medium mb-4">Tags du produit</label>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {availableTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                          selectedTagIds.includes(tag.id)
                            ? 'bg-brand-blue text-white shadow-md shadow-brand-blue/20'
                            : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                        }`}
                        disabled={loading}
                      >
                        {tag.name}
                        {selectedTagIds.includes(tag.id) && (
                          <X className="inline-block h-3 w-3 ml-1.5" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Nouveau tag..."
                      disabled={loading}
                      className="bg-white border-gray-200"
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
                      className="bg-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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

          <div className="flex gap-4 pt-6 border-t border-gray-100 justify-end">
            <Link href="/admin/products">
              <Button type="button" variant="ghost" disabled={loading} className="px-8">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="px-12 py-6 font-bold tracking-wide shadow-lg shadow-brand-blue/30 active:scale-95 transition-all">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Enregistrement...</span>
                </div>
              ) : 'Créer le produit'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
