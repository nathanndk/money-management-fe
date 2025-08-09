'use client';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';
import { useTxStore } from '@/app/store/transactions';

export function Navbar() {
  const { data: session } = useSession();
  const switchProfile = useTxStore((s) => s.switchProfile);

  const onGuest = () => { switchProfile('guest'); };
  const onSignedIn = () => { if (session?.user?.email) switchProfile(session.user.email); };
  if (typeof window !== 'undefined') queueMicrotask(onSignedIn);

  return (
    <nav className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-900/60 border-b border-border">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-semibold">Money Manager</Link>
          <Link href="/integrations" className="text-sm text-neutral-500 hover:underline">Integrations</Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <>
              <span className="text-sm text-neutral-500 dark:text-neutral-300 hidden sm:inline">{session.user.email}</span>
              <Button onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onGuest}>Continue as Guest</Button>
              <Button onClick={() => signIn()}>Sign in</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}