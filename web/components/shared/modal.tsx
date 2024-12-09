import React from 'react';
import { XIcon } from 'lucide-react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';
  title: string;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, size = 'md', title, children }: ModalProps) {
  if (!isOpen) return null;

  const modalSizeClass: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const sizeClass = modalSizeClass[size] || modalSizeClass.md;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-white p-6 rounded-lg shadow-lg ${sizeClass} w-full max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg`}
        style={{
          transform: 'translateY(0)',
          opacity: isOpen ? 1 : 0,
          transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-full p-2 w-8 h-8 flex items-center justify-center transition"
        >
          <XIcon className="w-4 h-4 text-gray-700" />
        </button>

        <h2 className="text-lg font-bold mb-4">{title}</h2>

        {children}
      </div>
    </div>
  );
}
