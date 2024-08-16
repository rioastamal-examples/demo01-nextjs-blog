import { useAuthenticator, Loader } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';

function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function ReadFromDb() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const client = generateClient();
        const response = await client.models.User.list({
          limit: 50
        }, { authMode: 'userPool' });

        console.log(response);

        if (response.hasOwnProperty('errors')) {
          setError(response.errors);
        } else {
          setUsers(response.data);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}

function Index() {
  const { authStatus, user } = useAuthenticator(context => [context.authStatus, context.user]);
  console.log('isObject =>', isObject(user));
  console.log(user);

  let isAuthenticated = authStatus === 'authenticated';
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
          const { data, errors} = await client.models.User.list({
            limit: 50,
            authMode: 'userPool' 
          });
  
          console.log(data);
  
          if (errors) {
            console.log(errors);
          } else {
            setUsers(data);
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
      <h1>Read from DB</h1>
      { loading && <Loader variation="linear" size="small" /> }
      <ul>
        {users.map((_user) => (
          <li key={_user.userId}>{_user.name} - {_user.email}</li>
        ))}
      </ul>      
    </>
  );
}

export default Index;