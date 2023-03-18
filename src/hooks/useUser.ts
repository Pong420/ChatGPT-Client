import { useSession } from 'next-auth/react';
import type { User } from '@prisma/client';

export interface UseUserOptions {
  required?: boolean;
}

export function useUser(payload: { required: true }): User;
export function useUser(): User | undefined;
export function useUser({ required }: UseUserOptions = {}): User | undefined {
  const session = useSession();

  if (required && session.status !== 'authenticated') {
    throw new Error(`session is ${session.status}, please make sure sesstion asigned in getServerSideProps`);
  }

  return session.data?.user as User;
}
