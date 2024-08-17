import { useAuthenticator, Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Head from 'next/head';
import { useEffect } from 'react';

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export default function Index() {
  const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);
  console.log('isObject =>', isObject(user));
  console.log(user);

  const isAuthenticated = isObject(user);

  useEffect(() => {
    console.log('authStatus => ', authStatus);
    const createUser = async () => {
      try {
        // Create user in database if not exists
        const response = await fetch('/api/users/me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: '{}'
        });

        if (response.ok) {
          console.log('User created:', await response.json());
          return;
        }

        const errorData = await response.json(); // Parse the error response body as JSON
        throw new Error(errorData.message || 'An error occurred');
      } catch (error) {
        console.error('Error creating user:', error);
      }
    };

    if (isAuthenticated) {
      (async() => {
        await createUser();
        setTimeout(() => {
          window.location.href = '/admin/profile';
        }, 2000);
      })();
    }

    return undefined;
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