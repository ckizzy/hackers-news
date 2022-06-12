import axios from 'axios';
import { useEffect, useState } from 'react';
import { API_URL } from '../config';

export const useFetchData = (startPost, endPost) => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState(null);
  const [postIds, setPostIds] = useState([]);

  const transformPostsData = post => {
    const transformedPost = {
      num: post.num,
      id: post.id,
      title: post.title,
      author: post.by,
      score: post.score,
      time: post.time,
      url: post.url
    };

    return transformedPost;
  };

  const getPostIds = async () => {
    //fetch
    const { data } = await axios.get(`${API_URL}v0/beststories.json`);
    return data;
  };

  const getPostDataById = async postId => {
    const { data } = await axios.get(`${API_URL}v0/item/${postId}.json`);
    return data;
  };

  const refreshData = () => setPostIds([]);

  useEffect(() => {
    const getData = async (startPost, endPost) => {
      setIsPending(true);

      try {
        if (postIds.length === 0) {
          const ids = await getPostIds();
          if (!ids) throw new Error();
          setPostIds(ids);
        }

        const slicedPosts = postIds.slice(startPost, endPost);

        const postsArray = [];

        const results = await Promise.all(
          slicedPosts.map(async postId => {
            const post = await getPostDataById(postId);
            if (!post) throw new Error();
            return post;
          })
        );

        let num = startPost + 1;

        results.forEach(post => {
          const transformedPost = transformPostsData({ ...post, num });
          num++;

          postsArray.push(transformedPost);
        });

        setPosts(postsArray);
        setError(null);
        setIsPending(false);
      } catch (err) {
        setError('Problem with fetching data.');
        setIsPending(false);
      }
    };
    getData(startPost, endPost);
  }, [startPost, endPost, postIds]);

  return {
    totalPostsNumber: postIds.length,
    posts,
    isPending,
    error,
    refreshData
  };
};
