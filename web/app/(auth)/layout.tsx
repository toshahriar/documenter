import { ReactNode } from 'react';
import Image from 'next/image';
import logo from '@/app/logo.png';

interface Props {
  readonly children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="mb-4 text-center">
        <Image src={logo} alt="Documenter Logo" width={96} className="mx-auto mb-2" />
      </div>
      <div className="w-full max-w-md">{children}</div>
      <div className="mt-4 text-center text-xs text-gray-500 opacity-70">
        &copy; {new Date().getFullYear()} Documenter. All rights reserved.
      </div>
    </div>
  );
}
