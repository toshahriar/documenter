'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAppSelector } from '@/redux/hooks';

export function ProfileCard() {
  const { requestId: userRequestId, data: userData } = useAppSelector((state: any) => state.me);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (userData) setUser(userData);
  }, [userRequestId, userData]);

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="flex flex-col items-center py-6">
        <Avatar className="w-24 h-24">
          <AvatarFallback>
            {user.firstName?.[0]?.toUpperCase()}
            {user.lastName?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-semibold mt-4">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-500">@{user.username}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-600">Email: {user.email}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4"></CardFooter>
    </Card>
  );
}
