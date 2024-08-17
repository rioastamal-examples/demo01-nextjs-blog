import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext, AuthGetCurrentUserServer, cookiesClient } from '../../../libs/server-utils';
import { cookies } from 'next/headers';
import crypto from 'crypto';

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

  const hashString = function (str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
  };

  try {
    // Get the request body
    const requestData = await request.json();
    // Access the JSON data
    console.log(requestData);
    const { key } = requestData;

    // Access the current user
    const user = await AuthGetCurrentUserServer();
    console.log('user =>', user);

    const hashedKey = hashString(key);
    const item = {
      mediaId: `${user.userId}#${hashedKey}`,
      path: key,
      userId: user.userId
    };
    console.log('item =>', item);

    const {errors} = await cookiesClient.models.Media.create(item, {
      authMode: 'userPool'
    });

    if (errors) {
      return Response.json({ "message": errors[0].message }, { status: 400 });
    }

    return Response.json({ "message": "Data successfully written" });
  } catch (error) {
    return Response.json({ "message": error.toString() }, { status: 400 });
  }
}