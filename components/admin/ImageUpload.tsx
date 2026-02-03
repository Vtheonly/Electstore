'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, X, Image as ImageIcon, CheckCircle2, Loader2, UploadCloud } from 'lucide-react';
import { uploadProductImage } from '@/lib/supabase/queries-client';

interface ImageItem {
  url: string;
  is_main: boolean;
  file?: File;
  status: 'existing' | 'uploading' | 'error' | 'pending';
}

interface ImageUploadProps {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    
    // Check limit
    if (images.length + newFiles.length > maxImages) {
      alert(`Vous ne pouvez pas ajouter plus de ${maxImages} images.`);
      return;
    }

    const newItems: ImageItem[] = newFiles.map(file => ({
      url: URL.createObjectURL(file), // Temporary preview URL
      file,
      is_main: images.length === 0, // First image is main by default
      status: 'pending'
    }));

    const updatedImages = [...images, ...newItems];
    onChange(updatedImages);
    
    // Proactive upload
    await uploadNewImages(updatedImages);
  };

  const uploadNewImages = async (currentImages: ImageItem[]) => {
    setUploading(true);
    const updated = [...currentImages];
    
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === 'pending' && updated[i].file) {
        updated[i].status = 'uploading';
        onChange([...updated]);

        try {
          const publicUrl = await uploadProductImage(updated[i].file!);
          updated[i].url = publicUrl;
          updated[i].status = 'existing';
          delete updated[i].file; // Clean up file object
        } catch (error) {
          console.error('Upload failed:', error);
          updated[i].status = 'error';
        }
        onChange([...updated]);
      }
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    
    // Re-assign main image if the removed one was main
    if (images[index].is_main && updated.length > 0) {
      updated[0].is_main = true;
    }
    
    onChange(updated);
  };

  const setMainImage = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      is_main: i === index
    }));
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Images du produit ({images.length}/{maxImages})</label>
        {images.length < maxImages && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />

      {images.length === 0 ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all cursor-pointer"
        >
          <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Glissez vos images ou cliquez pour uploader</p>
          <p className="text-xs text-gray-400 mt-2">Format supporté: JPG, PNG, WEBP (Max 5Mo)</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`relative group aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                img.is_main ? 'border-brand-blue shadow-lg scale-105 z-10' : 'border-gray-100'
              }`}
            >
              <img 
                src={img.url} 
                alt={`Product ${index}`} 
                className={`w-full h-full object-cover ${img.status === 'uploading' ? 'opacity-40 grayscale' : ''}`}
              />
              
              {img.status === 'uploading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-brand-blue animate-spin" />
                </div>
              )}

              {img.status === 'error' && (
                <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                  <span className="text-[10px] bg-red-600 text-white px-2 py-1 rounded">Erreur</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!img.is_main && img.status === 'existing' && (
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => setMainImage(index)}
                    title="Définir comme image principale"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {img.is_main && (
                <div className="absolute top-2 left-2 bg-brand-blue text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">
                  Principale
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
