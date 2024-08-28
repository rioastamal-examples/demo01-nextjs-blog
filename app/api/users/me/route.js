import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext, AuthGetCurrentUserServer, serverClient } from '../../../../libs/server-utils';
import { cookies } from 'next/headers';

export async function POST(request) {
  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return (
          session.tokens?.accessToken !== undefined &&
          session.tokens?.idToken !== undefined
        );
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  });

  if (!authenticated) {
    return Response.json({ "authenticated": authenticated }, { status: 401 });
  }

  try {
    // Get the request body
    const requestData = await request.json();

    // Access the current user
    const user = await AuthGetCurrentUserServer();
    console.log('user =>', user);

    // Get current user data from database
    const { data, errors } = await serverClient.models.User.get(
      { userId: user.userId },
      { authMode: 'userPool' }
    );
    console.log('currentUser =>', data);
    
    if (errors) {
      return Response.json({ "message": errors[0].message }, { status: 400 });
    }

    if (data) {
      // No need to create a new user
      console.log('User already exists');
      return Response.json({ "message": "User already exists" }, { status: 200 });
    }

    // Create a new user
    console.log('Creating a new user');
    const item = {
      userId: user.userId
    }

    console.log('item =>', item);
    const responseCreate = await serverClient.models.User.create(
      item,
      { authMode: 'userPool' }
    );

    if (responseCreate?.errors) {
      return Response.json({ "message": errors[0].message }, { status: 400 });
    }

    return Response.json({ "message": "Data successfully written" });
  } catch (error) {
    return Response.json({ "message": error.toString() }, { status: 403 });
  }
}