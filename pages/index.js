import { useEffect, useState } from 'react';
import Head from 'next/head';
import { generateClient } from 'aws-amplify/data';
import Markdown from 'react-markdown';
import getConfig from 'next/config';

function Index() {
  const { publicRuntimeConfig } = getConfig();
  // const staticUserId = '99da75ec-e001-7047-3a1e-b0a089478a47';
  const staticUserId = publicRuntimeConfig.staticUserId;
  const [currentUser, setCurrentUser] = useState({})

  const loadCurrentProfile = async function() {
    const client = generateClient();
    try {
      const { data, errors} = await client.models.User.get({
        userId: staticUserId, // Replace with the actual user ID
      }, { authMode: 'apiKey' });
      console.log('data current profile =>', data);
      console.log('errors current profile =>', errors);
      setCurrentUser(data);
    } catch (error) {
      console.log('Fetch current profile error =>', error);
    }
  }

  useEffect(() => {
    loadCurrentProfile();
  },[]);

  return (
    <>
      { currentUser.hasOwnProperty('name') &&
      <>
          <Head>
            <title>{currentUser.name}&#39;s Photos</title>
          </Head>

          <h1>{currentUser.name}</h1>
          <Markdown>{currentUser.profile}</Markdown>
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