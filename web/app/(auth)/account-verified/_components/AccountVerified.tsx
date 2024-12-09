'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function AccountVerified() {
  return (
    <Card className="w-full max-w-md mx-auto bg-card border-0 shadow-md">
      <CardHeader className="space-y-3">
        <div className="flex justify-center mb-2">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl font-semibold text-center">Email Verified!</CardTitle>
        <CardDescription className="text-center">
          Your email has been successfully verified. You can now access all features of your
          account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="text-center text-muted-foreground">
          Thank you for verifying your email address. Your account is now fully activated.
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button asChild className="w-full font-semibold">
          <Link href="/login">Continue to Login</Link>
        </Button>
        <div className="text-sm text-center text-muted-foreground">
          Need help?{' '}
          <Link
            href="/support"
            className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
