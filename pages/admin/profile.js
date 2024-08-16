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

    console.log(authStatus);
    
    if (!isAuthenticated) {
      window.location.href = '/login';
      console.log('redirecting to /login');
      return null;
    }
  }, [isAuthenticated]);

  return (
    <>
      <h1>My Profile</h1>
      {isAuthenticated ? <div>Authenticated | <Link href="/logout">Logout</Link></div> : null}
    </>
  );
}

export default Index;

export function getStaticProps() {
  return {
    props: {
      currentPage: '/admin/profile'
    }
  }
}