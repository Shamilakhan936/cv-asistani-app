// This file is now using Clerk for authentication
import { currentUser } from '@clerk/nextjs';

// Helper function to get current user info
export async function getCurrentUser() {
  const user = await currentUser();
  return { userId: user?.id };
}

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  const user = await currentUser();
  return !!user?.id;
}

// Types for user data
export interface UserData {
  id: string;
  name?: string | null;
  email?: string | null;
  imageUrl?: string | null;
}

// Get user data helper
export async function getUserData(): Promise<UserData | null> {
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    name: user.firstName ? `${user.firstName} ${user.lastName || ''}` : null,
    email: user.emailAddresses[0]?.emailAddress || null,
    imageUrl: user.imageUrl
  };
} 