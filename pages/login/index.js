import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Head from 'next/head';
import { useEffect } from 'react';

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export default function Index() {
  const { user } = useAuthenticator(context => [context.user]);
  console.log('isObject =>', isObject(user));
  console.log(user);

  const isAuthenticated = isObject(user);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/admin/profile'
    }
  }, [isAuthenticated]);

  return (
    <>
    <Head>
      <title>Sign in using Authenticator</title>
    </Head>

    <Authenticator>
      {({ user }) => (
        <main>
          <h1>Logged in as {user.username}</h1>
          <p>Redirecting, please wait...</p>
        </main>
      )}
    </Authenticator>
    </>
  )
}

export function getStaticProps() {
  return {
    props: {
      currentPage: '/login'
    }
  }
}