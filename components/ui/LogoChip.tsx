'use client';

import { logoColor, initials } from '@/lib/data';

interface Props {
  name: string;
  size?: number;
}

export default function LogoChip({ name, size = 40 }: Props) {
  return (
    <div
      className="logo-chip"
      style={{
        width: size,
        height: size,
        background: logoColor(name),
        fontSize: size * 0.36,
      }}
    >
      {initials(name)}
    </div>
  );
}
