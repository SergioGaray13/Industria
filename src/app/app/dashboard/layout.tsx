// src/app/dashboard/layout.tsx
import DashboardNavbar from '@/components/DashboardNavbar';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardNavbar />
      <div className="p-6">{children}</div>
    </>
  );
}
