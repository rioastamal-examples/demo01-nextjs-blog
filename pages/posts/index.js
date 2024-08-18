import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import Head from 'next/head';

function ShowPosts({ data }) {
  // Format the date to 'Fri Mar 19 2021'
  const formatDate = function(theDate) {
    const date = new Date(theDate);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  return (
    <div>
      {data.map((post) => (
        <div key={post.postId} className="post-item">
          <h3><a className="post-item-title" href={"/posts/" + post.slug}>{post.title}</a></h3>
          <p className="post-item-desc">{post.summary}<a className="post-item-more" href={"/posts/" + post.slug}>Read More →</a></p>
          <time className="post-item-date">{formatDate(post.createdAt)}</time>
        </div>
      ))}
    </div>
  ); 
}

export default function Index() {
  const staticUserId = '99da75ec-e001-7047-3a1e-b0a089478a47';
  const [CurrentPosts, setCurrentPosts] = useState([])

  const loadCurrentPosts = async function() {
    const client = generateClient();
    try {
      const { data, errors} = await client.models.Post.listByAuthorId({
        authorId: staticUserId, // Replace with the actual user ID
      }, { authMode: 'apiKey' });
      console.log('data current posts =>', data);
      console.log('errors current posts =>', errors);

      if (errors) {
        console.log('current posts error =>', errors);
        setCurrentPosts([]);

        return;
      } 
      console.log('_data =>', data);
      setCurrentPosts(data);
    } catch (error) {
      console.log('Fetch current posts error =>', error);
    }
  }

  useEffect(() => {
    loadCurrentPosts();
  },[]);

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>

    <h1>Posts</h1>
    <ShowPosts data={CurrentPosts} />
    </>
  )
}

export function getStaticProps() {
  return {
    props: {
      currentPage: '/posts'
    }
  }
}