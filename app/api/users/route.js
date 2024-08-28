import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext, AuthGetCurrentUserServer, serverClient } from '../../../libs/server-utils';
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
    // Access JSON data
    const { fullname, subdomain, profile } = requestData;

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

    // Update user profile
    console.log('Updating user profile');
    const item = {
      userId: user.userId,
      email: user.signInDetails?.loginId,
      name: fullname,
      subdomain: subdomain,
      profile: profile,
    }

    console.log('item =>', item);
    const responseUpdate = await serverClient.models.User.update(
      item,
      { authMode: 'userPool' }
    );

    console.log('responseUpdate =>', responseUpdate);

    if (responseUpdate?.errors) {
      return Response.json({ "message": errors[0].message }, { status: 400 });
    }

    return Response.json({ "message": "Data successfully updated" });
  } catch (error) {
    return Response.json({ "message": error.toString() }, { status: 403 });
  }
}