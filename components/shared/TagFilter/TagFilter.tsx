'use client';

import { useEffect, useState } from 'react';
import { Tag } from '@/types';
import { getTags } from '@/lib/supabase/queries-client';
import { Badge } from '@/components/ui/Badge';

interface TagFilterProps {
  selectedTag: string | null;
  onSelectTag: (tagSlug: string | null) => void;
}

export function TagFilter({ selectedTag, onSelectTag }: TagFilterProps) {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    async function loadTags() {
      const data = await getTags();
      setTags(data);
    }
    loadTags();
  }, []);

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      <Badge
        variant={selectedTag === null ? 'default' : 'outline'}
        className="cursor-pointer hover:bg-brand-blue hover:text-white transition-colors px-4 py-2 text-sm"
        onClick={() => onSelectTag(null)}
      >
        Tous les tags
      </Badge>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={selectedTag === tag.slug ? 'default' : 'outline'}
          className="cursor-pointer hover:bg-brand-blue hover:text-white transition-colors px-4 py-2 text-sm"
          onClick={() => onSelectTag(tag.slug)}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
