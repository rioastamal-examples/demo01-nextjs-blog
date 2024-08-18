import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Markdown from 'react-markdown';
import { generateClient } from 'aws-amplify/data';

function Index() {
  // Format the date to 'Fri Mar 19 2021'
  const formatDate = function(theDate) {
    const date = new Date(theDate);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

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
          <div className="meta-line">
            <div className="meta"><time>{formatDate(post.createdAt)}</time> • <a className="tag" href="/tags/web%20development">web development</a>
            </div>
          </div>
          <Markdown>{post.content}</Markdown>
          {/* <p>{post.content}</p> */}
        </>
      )}
    </>
  );
}

export default Index;