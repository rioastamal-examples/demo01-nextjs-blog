import { useAuthenticator } from '@aws-amplify/ui-react';
import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import Head from 'next/head';
import { useEffect } from 'react';

export default function Index() {
  const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);
  console.log('user =>', user);

  const uploadSuccessFn = async ({ key }) => {
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: key })
      });

      if (response.ok) {
        console.log('File uploaded successfully. Path: ' + key);
        return undefined;
      }

      const errorData = await response.json(); // Parse the error response body as JSON
      throw new Error(errorData.message || 'An error occurred');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    if (authStatus === 'configuring') {
      return;
    }

    if (authStatus === 'unauthenticated') {
      console.log('redirecting to /login');
      window.location.href = '/login';
      return;
    }
  }, [authStatus]);

  return (
    <>
      <Head>
        <title>Upload file</title>
      </Head>

      <h1>Upload file</h1>
      <p>See all your uploaded files in the <a href="/admin/media">media page</a>.</p>
      <StorageManager
        acceptedFileTypes={['image/*']}
        path={({ identityId }) => `media/blog/${identityId}/`}
        maxFileCount={1}
        isResumable
        onUploadSuccess={uploadSuccessFn}
      />
    </>
  )
}