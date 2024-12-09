'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Search, Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { logoutInit } from '@/app/admin/_store/slices/logout-slice';

interface TopbarProps {
  onMenuButtonClick: () => void;
}

const defaultUserState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
};

const menuItems = [{ title: 'Profile', icon: User, url: '/admin/profile' }];

export function Topbar({ onMenuButtonClick }: TopbarProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const logoutRequestId = useAppSelector((state: any) => state.logout.requestId);
  const userData = useAppSelector((state: any) => state.me.data);

  const [user, setUser] = useState(defaultUserState);

  useEffect(() => {
    if (userData) setUser(userData);
  }, [userData]);

  useEffect(() => {
    if (logoutRequestId) router.push('/login');
  }, [logoutRequestId, router]);

  const handleLogout = () => dispatch(logoutInit(null));

  const iconButtonClasses =
    'h-11 w-11 rounded-lg hover:bg-primary/5 hover:text-primary text-slate-700';

  return (
    <div className="px-4 py-3">
      <header className="flex h-14 items-center justify-between rounded-xl bg-white shadow-sm px-4 py-8 mt-5 border-gray-200">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className={iconButtonClasses}
            onClick={onMenuButtonClick}
          >
            <Menu className="h-5 w-5 text-slate-700" strokeWidth={2.5} />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={iconButtonClasses}>
                <User className="h-5 w-5" strokeWidth={2.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {menuItems.map((item) => (
                  <Link key={item.url} href={item.url} className="no-underline">
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <item.icon className="h-5 w-5 text-slate-700" strokeWidth={2.5} />
                      <span>{item.title}</span>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 text-red-600 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" strokeWidth={2.5} />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
}
