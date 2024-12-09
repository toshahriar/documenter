'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Sidebar } from '@/components/shared/sidebar';
import { Topbar } from '@/components/shared/topbar';
import { useAppDispatch } from '@/redux/hooks';
import { meInit } from '@/app/admin/_store/slices/me-slice';

interface Props {
  readonly children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(meInit(null));
  }, [dispatch]);

  return (
    <div className="relative flex h-screen bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden px-16">
        <Topbar onMenuButtonClick={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-5">{children}</main>
      </div>
    </div>
  );
}
