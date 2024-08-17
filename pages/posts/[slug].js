import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Markdown from 'react-markdown';
import { generateClient } from 'aws-amplify/data';

function Index() {
  const router = useRouter();
  const slug = router.query.slug;
  const [postIsNotFound, setPostIsNotFound] = useState(false);
  const [post, setPost] = useState([]);

  useEffect(() => {
    const getPostBySlug = async () => {
      if (!slug) return undefined;

      const client = generateClient();
      const {data, errors} = await client.models.Post.listBySlug({
          slug: slug
      });
  
      if (errors) {
        console.error(errors);
        setPostIsNotFound(true);
  
        return undefined;
      }
  
      console.log('data =>', data);
      if (data && data.length === 0) {
          setPostIsNotFound(true);

          return undefined;
      }

      setPost(data[0]);
      setPostIsNotFound(false);
    };

    getPostBySlug();
  }, [slug]);

  return (
    <>
      {postIsNotFound && <h1>Post is not found.</h1>}
      {post && (
        <>
          <h1>{post.title}</h1>
          <Markdown>{post.content}</Markdown>
          {/* <p>{post.content}</p> */}
        </>
      )}
    </>
  );
}

export default Index;