import React, { ReactNode } from 'react';

interface PageSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function PageSection({ title, subtitle, children }: PageSectionProps) {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 mb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground md:text-base">{subtitle}</p>}
        </div>
      </div>
      <div className="col-span-12">{children}</div>
    </div>
  );
}
