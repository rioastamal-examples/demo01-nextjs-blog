import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import Link from 'next/link'

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function Index() {
  const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);
  console.log('isObject =>', isObject(user));
  console.log(user);

  let isAuthenticated = authStatus === 'authenticated';

  useEffect(() => {
    if (authStatus === 'configuring') {
      return;
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
      console.log('redirecting to /login');
      return null;
    }
  }, [isAuthenticated]);

  return (
    <>
      <div style={{ paddingTop: '3rem' }} className="article"></div>
      <h1>My Profile</h1>
      <hr />
      {isAuthenticated ? <div>Authenticated | <Link href="/logout">Logout</Link></div> : null}
    </>
  );
}

export default Index;