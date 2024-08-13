import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';

export default function Index() {
  const { authStatus, signOut } = useAuthenticator(context => [context.authStatus, context.signOut]);

  useEffect(() => {
    console.log('authStatus', authStatus);

    if (authStatus === 'configuring') {
      return undefined;
    }

    if (['authenticated', 'unauthenticated'].indexOf(authStatus) > -1) {
      const s = signOut();
      console.log(s);
      window.location.href = '/login';
      console.log('redirecting to /login');
    }
    
    return undefined;

  }, [authStatus]);

  return (
    <h2>Signing out...</h2>
  );
}