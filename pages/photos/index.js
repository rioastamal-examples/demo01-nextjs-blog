import { useEffect, useState } from 'react';
import Head from 'next/head';
import { generateClient } from 'aws-amplify/data';
import { getUrl } from 'aws-amplify/storage';
import { Loader } from '@aws-amplify/ui-react';

const getSignedUrl = async function(file) {
  const { url } = await getUrl({ path: file });
  console.log('signedUrl => ', url.toString());
  return url.toString();
}

function ShowPictures(files) {
  console.log('pictures =>', files.pictures);

  return (
    files.pictures.map((picture, index) => {
      return (
        <div key={index}>
          <a href={picture.signedUrl}>
            <img src={picture.signedUrl} />
          </a>
          <p><a href={picture.signedUrl}>Download image</a></p>
        </div>
      );
    })
  );
}

function Index() {
  const staticUserId = '99da75ec-e001-7047-3a1e-b0a089478a47';
  const [currentPictures, setCurrentPictures] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCurrentPictures = async function() {
    const client = generateClient();
    try {
      const { data, errors} = await client.models.Media.listByUserId({
        userId: staticUserId, // Replace with the actual user ID
      }, { authMode: 'apiKey' });
      console.log('data current images =>', data);
      console.log('errors current images =>', errors);

      if (errors) {
        console.log('Fetch current images error =>', errors);
        setCurrentPictures([]);

        return;
      } 

      const _data = data.slice();
      for (let i = 0; i < _data.length; i++) {
        const file = _data[i];
        const signedUrl = await getSignedUrl(file.path);
        file.signedUrl = signedUrl;
      }
      console.log('_data =>', _data);
      setCurrentPictures(_data);
      setLoading(false);
    } catch (error) {
      console.log('Fetch current images error =>', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCurrentPictures();
  },[]);

  return (
    <>
      <Head>
        <title>Photos</title>
      </Head>

      <h1>Pictures</h1>
      { loading && <Loader variation="linear" size="small" /> }
      { !loading && <>
        <ShowPictures pictures={currentPictures} />
      </>}
    </>
  );
}

export default Index;

export function getStaticProps() {
  return {
    props: {
      currentPage: '/photos'
    }
  }
}