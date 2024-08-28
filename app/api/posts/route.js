import { fetchAuthSession } from 'aws-amplify/auth/server';
import { runWithAmplifyServerContext, AuthGetCurrentUserServer, serverClient } from '../../../libs/server-utils';
import { cookies } from 'next/headers';
import slugify from '../../../libs/slugify';

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
    // Access the JSON data
    console.log(requestData);
    const { title, summary, content, tags, slug } = requestData;
    const slugText = slugify(title);

    // Access the current user
    const user = await AuthGetCurrentUserServer();
    console.log('user =>', user);

    const item = {
      postId: `${user.userId}#${slugText}`,
      title: title,
      summary: summary,
      content: content,
      tags: tags.split(',').map((tag) => tag.trim()),
      slug: slugText,
      authorId: user.userId,
      published: true
    };
    console.log('item =>', item);

    const {errors} = await serverClient.models.Post.create(item, {
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