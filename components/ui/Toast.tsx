'use client';

import { Check } from 'lucide-react';

export default function Toast({ message }: { message: string }) {
  return (
    <div className="toast">
      <Check size={15} strokeWidth={2} />
      {message}
    </div>
  );
}
