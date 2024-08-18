import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Markdown from 'react-markdown';
import { generateClient } from 'aws-amplify/data';
import { Loader } from '@aws-amplify/ui-react';

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
  const [loading, setLoading] = useState(true);

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
        setLoading(False);
  
        return undefined;
      }
  
      console.log('data =>', data);
      if (data && data.length === 0) {
          setPostIsNotFound(true);
          setLoading(false);

          return undefined;
      }

      setPost(data[0]);
      setPostIsNotFound(false);
      setLoading(false);
    };

    getPostBySlug();
  }, [slug]);

  return (
    <>
      {postIsNotFound && <h1>Post is not found.</h1>}

      { loading && <Loader variation="linear" size="small" /> }
      {post && !loading && (
        <>
          <h1>{post.title}</h1>
          <div className="meta-line">
            <div className="meta"><time>{formatDate(post.createdAt)}</time> • <a className="tag" href="/tags/web%20development">web development</a>
            </div>
          </div>
          <Markdown>{post.content}</Markdown>
        </>
      )}
    </>
  );
}

export default Index;