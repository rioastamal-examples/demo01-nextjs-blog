import { StorageManager } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import Head from 'next/head';

export default function Index() {
  const uploadSuccessFn = ({ key }) => {
    console.log('File uploaded successfully:', key);
  };
  return (
    <>
      <Head>
        <title>Upload file</title>
      </Head>

      <h1>Upload file</h1>
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