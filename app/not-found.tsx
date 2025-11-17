// /app/not-found.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
      <h1 className="text-9xl font-bold text-brand-blue">404</h1>
      <h2 className="text-3xl font-semibold mt-4">Page non trouvée</h2>
      <p className="text-gray-600 mt-2 max-w-md">
        Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
}
