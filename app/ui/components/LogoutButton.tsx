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
    
    // Sign out with NextAuth without callback (redirect manually)
    await signOut({ redirect: false });
    // Manual redirect to ensure correct domain
    window.location.href = '/login';
  };

  return (
    <Button onClick={handleLogout} className={className}>
      Logout
    </Button>
  );
}
