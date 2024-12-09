'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Plug, ChevronLeft, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import logo from '@/app/logo.png';
import Image from 'next/image';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();

  const [menuItems] = useState([
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Documents',
      href: '/admin/document',
      icon: FileText,
    },
    {
      title: 'Integrations',
      href: '/admin/integration',
      icon: Plug,
    },
    {
      title: 'My Profile',
      href: '/admin/profile',
      icon: User,
    },
  ]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 h-full bg-white/50 backdrop-blur-lg transition-all duration-300 lg:static',
          open ? 'translate-x-0 w-72' : '-translate-x-full w-20 lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4">
            <div
              className={cn(
                'flex items-center gap-3 transition-all duration-300',
                !open ? 'justify-center w-full' : 'px-4'
              )}
            >
              <div className="flex items-center justify-center">
                <Image src={logo} alt="Documenter Logo" width={40} className="mx-auto" />
              </div>
              {open && (
                <span className="text-xl font-semibold text-black tracking-wide">Documenter</span>
              )}
            </div>

            {open && (
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 lg:hidden hover:bg-primary/5"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex h-11 items-center rounded-lg transition-all duration-200',
                  !open ? 'justify-center px-2' : 'px-4',
                  pathname === item.href
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-200 shadow-sm text-primary'
                    : 'hover:bg-primary/5 text-slate-600 hover:text-primary'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    open && 'mr-3',
                    pathname === item.href
                      ? 'text-primary'
                      : 'text-slate-400 group-hover:text-primary'
                  )}
                />
                {open && (
                  <span
                    className={cn(
                      'transition-all',
                      pathname === item.href ? 'font-semibold' : 'font-medium'
                    )}
                  >
                    {item.title}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 hidden lg:block">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'h-11 w-full hover:bg-primary/5 hover:text-primary',
                !open && 'rotate-180'
              )}
              onClick={() => setOpen(!open)}
            >
              <ChevronLeft className="h-5 w-5 transition-transform" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
