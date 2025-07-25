'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is a mock. In a real app, you'd import this from your auth provider.
// It would likely be populated by a hook like `useAuth()` that uses `useContext`.
const useAuth = () => {
  // In a real app, this would check a cookie, session, or call an API.
  // We'll simulate a loading state and an authenticated CBL user.
  return {
    user: { name: 'OC-Phil', role: 'CBL_ROLE', isCBL: true },
    isLoading: false,
    // user: null, // <-- To test the unauthenticated case
    // isLoading: true, // <-- To test the loading case
    // user: { name: 'Regular User', role: 'USER_ROLE', isCBL: false }, // <-- To test non-CBL user
  };
};

// Export the useAuth hook for use in other components
export { useAuth };

// A simple loading spinner component.
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string,
): React.ComponentType<P> {
  return function WithAuth(props: P) {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
      if (!isLoading && (!user || user.role !== requiredRole)) {
        // Redirect them to the login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they
        // login, which is a nicer user experience.
        router.push('/login?redirect=' + window.location.pathname);
      }
    }, [user, isLoading, router, requiredRole]);

    if (isLoading || !user || user.role !== requiredRole) {
      return <LoadingSpinner />;
    }
    return <Component {...props} />;
  };
}
