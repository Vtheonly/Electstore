import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ProductCardProps {
  category: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  imageUrl: string;
}

export const ProductCard = ({ category, name, price, originalPrice, discount, imageUrl }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <Image 
          src={imageUrl} 
          alt={name} 
          width={400} 
          height={300} 
          className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300" 
        />
        {discount && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded-full">{discount}</span>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{category}</p>
        <h3 className="text-lg font-semibold mb-2 h-14">{name}</h3>
        <div className="flex items-baseline space-x-2 mb-4">
          <p className="text-xl font-bold text-brand-blue">{price}</p>
          {originalPrice && <p className="text-sm text-gray-400 line-through">{originalPrice}</p>}
        </div>
        <Button className="w-full">Ajouter au panier</Button>
      </div>
    </Card>
  );
};
