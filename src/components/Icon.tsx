


import React from 'react';
import * as Lucide from 'lucide-react';

interface Props {
  name: string;
  className?: string;
  size?: number;
}

/** Resolve a lucide icon by name string with a safe fallback. */
export function Icon({ name, className, size = 20 }: Props) {
  const Cmp = (Lucide as unknown as Record<string, React.ComponentType<{className?: string;size?: number;}>>)[name];
  const Fallback = Lucide.Circle;
  const C = Cmp || Fallback;
  return <C className={className} size={size} />;
}