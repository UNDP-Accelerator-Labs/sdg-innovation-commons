'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/app/ui/components/Button';

export default function LogoutButton({ className }: { className?: string }) {
  const handleLogout = async () => {
    // Call our custom logout endpoint to delete DB session
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    
    // Then sign out with NextAuth
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <Button onClick={handleLogout} className={className}>
      Logout
    </Button>
  );
}
