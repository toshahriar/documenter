import React from 'react';
import { Button } from '@/components/ui/button';

type DialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  size?: 'sm' | 'md' | 'lg';
};

export function Dialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  size = 'sm',
}: DialogProps) {
  if (!isOpen) return null;

  const modalSizeClass: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  const sizeClass = modalSizeClass[size] || modalSizeClass.md;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ transition: 'opacity 0.3s ease-in-out' }}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg w-full ${sizeClass} transform transition-all duration-300`}
        style={{
          transform: 'translateY(-50px)',
          opacity: isOpen ? 1 : 0,
          transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
        }}
      >
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <Button
            onClick={onCancel}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 transition px-4 py-2 rounded-md"
          >
            No
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 transition px-4 py-2 rounded-md"
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
}
