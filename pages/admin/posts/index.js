import { useAuthenticator, Loader } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function Index() {
  const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);
  console.log('isObject =>', isObject(user));
  console.log(user);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === 'configuring') {
      return;
    }

    if (authStatus === 'unauthenticated') {
      console.log('redirecting to /login');
      window.location.href = '/login';
      return;
    }

    if (authStatus === 'authenticated') {
      async function fetchData() {
        try {
          const client = generateClient();
          const { data, errors} = await client.models.Post.list({
            limit: 50,
            authMode: 'userPool',
            filter: {
              authorId: {
                eq: user.userId
              }
            }
          });
  
          console.log(data);
  
          if (errors) {
            console.log(errors);
          } else {
            setPosts(data);
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

  }, [authStatus]);

  return (
    <>
      <h1>My Posts</h1>
      { loading && <Loader variation="linear" size="small" /> }
      { !loading && posts.length === 0 && <p>No posts found</p> }
      <ul>
        {posts.map((_post) => (
          <li key={_post.postId}>
            <a style={{ marginRight: '0.5rem' }}href={`/posts/${_post.slug}`}>{_post.title}</a>
            <a onClick={(e) => { window.alert('Your task: Implement this feature!'); e.preventDefault()}} title="edit" href="#">[Edit]</a>
          </li>
        ))}
      </ul>      
    </>
  );
}

export default Index;

export function getStaticProps() {
  return {
    props: {
      currentPage: '/admin/posts'
    }
  }
}