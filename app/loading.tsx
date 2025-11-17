// /app/loading.tsx

import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <Loader className="h-12 w-12 text-brand-blue animate-spin" />
    </div>
  );
}
