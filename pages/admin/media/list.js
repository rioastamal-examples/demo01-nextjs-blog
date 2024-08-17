import { useAuthenticator, Loader, Collection, Card, Link } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import { StorageImage } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';
import { getUrl } from 'aws-amplify/storage';

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function Index() {
  const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);
  console.log('isObject =>', isObject(user));
  console.log(user);

  let isAuthenticated = authStatus === 'authenticated';
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSignedUrl = async function(file) {
    const { url } = await getUrl({ path: file });
    console.log('signedUrl => ', url.toString());
    return url.toString();
  }

  useEffect(() => {
    if (authStatus === 'configuring') {
      return;
    }

    if (!isAuthenticated) {
      // window.location.href = '/login';
      console.log('redirecting to /login');
      return null;
    }

    if (isAuthenticated) {
      async function fetchData() {
        try {
          const client = generateClient();
          const { data, errors} = await client.models.Media.list({
            limit: 50,
            authMode: 'userPool',
            filter: {
              userId: {
                eq: user.userId
              }
            }
          });
  
          console.log(data);
  
          if (errors) {
            console.log(errors);
          } else {
            const _data = data.slice();
            for (let i = 0; i < _data.length; i++) {
              const file = _data[i];
              const signedUrl = await getSignedUrl(file.path);
              file.signedUrl = signedUrl;
            }
            setFiles(_data);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
  
      console.log('Auth status fetchData', authStatus, user);
      fetchData();
    }

  }, [isAuthenticated]);

  return (
    <>
      <h1>Media</h1>
      { loading && <Loader variation="linear" size="small" /> }
      { !loading && files.length === 0 && <p>No media found</p> }
      <div className="image-container">
      <Collection
        type="list"
        direction="row"
        items={files}
        wrap="wrap">

        {(file, index) => (
          <Card key={index}>
            <div className="image-item">
              <a href={file.signedUrl} target="_blank">
                <StorageImage path={file.path} />
              </a>
            </div>
          </Card>
        )}

      </Collection>
      </div>
    </>
  );
}

export default Index;

export function getStaticProps() {
  return {
    props: {
      currentPage: '/admin/media/list'
    }
  }
}