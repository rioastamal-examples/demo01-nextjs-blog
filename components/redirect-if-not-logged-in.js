import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

const RedirectIfNotLoggedIn = ({ children }) => {
  const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);

  const isAuthenticated = authStatus === 'authenticated';

  useEffect(() => {
    if (authStatus === 'configuring') {
      return;
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, [authStatus, isAuthenticated, router]);

  return isAuthenticated ? children : null;
};

export default RedirectIfNotLoggedIn;
