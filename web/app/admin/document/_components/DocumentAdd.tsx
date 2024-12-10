'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, Loader2, XIcon } from 'lucide-react';
import { useAppSelector } from '@/redux/hooks';

const signerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.string().email('Invalid email address'),
  designation: z.string().min(2, 'Designation must be at least 2 characters long'),
  order: z.number().int().positive(),
});

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  file: z
    .instanceof(File, { message: 'File is required' })
    .refine((file) => file.type === 'application/pdf', { message: 'Only PDF files are allowed' })
    .refine((file) => file.size <= 5 * 1024 * 1024, { message: 'File size must be less than 5MB' }),
  signers: z.array(signerSchema).min(1, 'At least one signer is required'),
});

type FormValues = z.infer<typeof formSchema>;

export function DocumentAdd({ onSubmit, onClose }: any) {
  const { loading } = useAppSelector((state: any): any => state?.document);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      signers: [{ name: '', email: '', designation: '', order: 1 }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'signers',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue('file', e.target.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Enter title"
            className={`mt-2 h-12 ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="file" className="block text-sm font-medium">
            Upload File
          </label>
          <input
            id="file"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className={`mt-2 w-full border border-gray-300 rounded-md p-2 ${errors.file ? 'border-red-500' : ''}`}
          />
          {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file.message}</p>}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mt-4 mb-4">
          <h4 className="text-md font-medium">Signers</h4>
          <div
            className="flex items-center bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-4 py-2 rounded-md hover:bg-indigo-700 transition cursor-pointer gap-2"
            onClick={() =>
              append({ name: '', email: '', designation: '', order: fields.length + 1 })
            }
          >
            <span className="mr-2">+ Add Signer</span>
          </div>
        </div>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center space-x-4 p-4 border rounded-md bg-gray-50"
            >
              <div className="flex-grow">
                <Input
                  {...register(`signers.${index}.name`)}
                  placeholder="Name"
                  className={errors.signers?.[index]?.name ? 'border-red-500' : ''}
                />
                {errors.signers?.[index]?.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.signers[index]?.name.message}</p>
                )}
              </div>
              <div className="flex-grow">
                <Input
                  {...register(`signers.${index}.email`)}
                  placeholder="Email"
                  className={errors.signers?.[index]?.email ? 'border-red-500' : ''}
                />
                {errors.signers?.[index]?.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.signers[index]?.email.message}
                  </p>
                )}
              </div>
              <div className="flex-grow">
                <Input
                  {...register(`signers.${index}.designation`)}
                  placeholder="Designation"
                  className={errors.signers?.[index]?.designation ? 'border-red-500' : ''}
                />
                {errors.signers?.[index]?.designation && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.signers[index]?.designation.message}
                  </p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-800"
                  onClick={() => index > 0 && move(index, index - 1)}
                >
                  <ArrowUp />
                </button>
                <button
                  type="button"
                  className="text-gray-500 hover:text-gray-800"
                  onClick={() => index < fields.length - 1 && move(index, index + 1)}
                >
                  <ArrowDown />
                </button>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-800"
                  onClick={() => {
                    if (fields.length > 1) {
                      remove(index);
                    }
                  }}
                >
                  <XIcon />
                </button>
              </div>
              <input type="hidden" {...register(`signers.${index}.order`)} value={index + 1} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end mt-4 space-x-4">
        <Button
          type="button"
          className="w-1/5 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-1/5 bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>Submit</>
          )}
        </Button>
      </div>
    </form>
  );
}
