import { useEffect, useState } from 'react';
import Head from 'next/head';
import { generateClient } from 'aws-amplify/data';
import Markdown from 'react-markdown';
import getConfig from 'next/config';
import { Loader } from '@aws-amplify/ui-react';

function Index() {
  const { publicRuntimeConfig } = getConfig();
  // const staticUserId = '99da75ec-e001-7047-3a1e-b0a089478a47';
  const staticUserId = publicRuntimeConfig.staticUserId;
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);

  const loadCurrentProfile = async function() {
    const client = generateClient();
    try {
      const { data, errors} = await client.models.User.get({
        userId: staticUserId, // Replace with the actual user ID
      }, { authMode: 'apiKey' });
      console.log('data current profile =>', data);
      console.log('errors current profile =>', errors);
      setCurrentUser(data);
      setLoading(false);
    } catch (error) {
      console.log('Fetch current profile error =>', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCurrentProfile();
  },[]);

  return (
    <>
      { !currentUser &&
        <p>Configure the STATIC_USER_ID environment variable which used in the 
          <b> next.config.js</b> file. If you don&#39;t
          have a user yet, <a href="/login">Sign up</a> and get the Cognito
          userId from Amplify console as the STATIC_USER_ID.
        </p>
      }

      { currentUser && currentUser.hasOwnProperty('name') &&
      <>
          <Head>
            <title>Demo blog</title>
          </Head>

          { loading && <Loader variation="linear" size="small" /> }
          { !loading && <>
          <h1>{currentUser.name}</h1>
          <Markdown>{currentUser.profile}</Markdown>
          </>}
        </>
      }
    </>
  );
}

export default Index;

export function getStaticProps() {
  return {
    props: {
      currentPage: '/'
    }
  }
}