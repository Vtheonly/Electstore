"use client";

// /app/admin/products/new/page.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { createProduct, getTags, createTag } from '@/lib/supabase/queries-client';
import { CATEGORIES } from '@/lib/constants';
import { ArrowLeft, Plus, X, Loader2, Sparkles, FolderOpen, Tag as TagIcon, Settings, Image as ImageIcon } from 'lucide-react';
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
    <main className="container mx-auto px-4 py-10 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2.5 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-colors shadow-sm text-gray-500 hover:text-brand-blue">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <span className="text-[10px] uppercase font-black tracking-widest text-brand-blue">Actions d'administration</span>
          <h1 className="text-3xl font-heading font-black text-brand-blue-dark">Nouveau Produit</h1>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Main Two-Column Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Core Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Information Card */}
          <Card className="p-8 border-none bg-white">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <Sparkles className="h-5 w-5 text-brand-blue" />
              <h2 className="text-xl font-heading font-bold text-brand-blue-dark">Informations Générales</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Nom du produit *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="Ex: Réfrigérateur LG 450L DoorCooling"
                  className="h-11 rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Description détaillée
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={loading}
                  rows={6}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-blue focus:ring-brand-blue text-sm placeholder:text-gray-400"
                  placeholder="Spécifications, dimensions, technologies incluses..."
                />
              </div>
            </div>
          </Card>

          {/* Pricing & Inventory Card */}
          <Card className="p-8 border-none bg-white">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <Settings className="h-5 w-5 text-brand-blue" />
              <h2 className="text-xl font-heading font-bold text-brand-blue-dark">Tarification & Stock</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Prix de Vente (DZD) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="91875"
                  className="h-11 rounded-xl border-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Prix Original (DZD)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  disabled={loading}
                  placeholder="101875"
                  className="h-11 rounded-xl border-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Unités en Stock *
                </label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="15"
                  className="h-11 rounded-xl border-gray-200"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Media & Settings Sidebar */}
        <div className="space-y-8">
          {/* Media / Image Upload Card */}
          <Card className="p-8 border-none bg-white">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <ImageIcon className="h-5 w-5 text-brand-blue" />
              <h2 className="text-xl font-heading font-bold text-brand-blue-dark">Médias</h2>
            </div>

            <ImageUpload 
              images={images} 
              onChange={setImages} 
            />
          </Card>

          {/* Categorization Card */}
          <Card className="p-8 border-none bg-white">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
              <FolderOpen className="h-5 w-5 text-brand-blue" />
              <h2 className="text-xl font-heading font-bold text-brand-blue-dark">Organisation</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  required
                  disabled={loading}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-blue focus:ring-brand-blue text-sm"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Tags Section */}
              <div className="pt-4 border-t border-gray-50">
                <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <TagIcon className="h-3.5 w-3.5" />
                  Tags du produit
                </label>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {availableTags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                          isSelected
                            ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/30'
                            : 'bg-white text-gray-400 hover:bg-gray-50 border-gray-100'
                        }`}
                        disabled={loading}
                      >
                        {tag.name}
                        {isSelected && (
                          <X className="inline-block h-3 w-3 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <Input
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Créer un tag..."
                    disabled={loading}
                    className="h-10 rounded-xl border-gray-100"
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
                    className="h-10 w-10 rounded-xl border-gray-100 text-gray-500 hover:text-brand-blue"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Settings / Featured toggle */}
              <div className="pt-6 border-t border-gray-50 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  disabled={loading}
                  className="h-5 w-5 rounded-lg text-brand-blue focus:ring-brand-blue border-gray-200"
                />
                <label htmlFor="featured" className="text-xs font-bold text-gray-500 cursor-pointer">
                  Mettre en vedette (Page d'accueil)
                </label>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="lg:col-span-3 flex justify-end gap-4 pt-6 border-t border-gray-100">
          <Link href="/admin/products">
            <Button type="button" variant="ghost" disabled={loading} className="px-8 rounded-xl font-bold h-12 text-gray-400">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="px-12 rounded-xl font-bold h-12 shadow-lg shadow-brand-blue/15">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Création...</span>
              </div>
            ) : 'Créer le produit'}
          </Button>
        </div>
      </form>
    </main>
  );
}