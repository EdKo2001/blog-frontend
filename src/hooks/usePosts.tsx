import React, { useState, useEffect, useRef, useCallback } from "react";

import axios from "../utils/axios";

import Grid from "@mui/material/Grid";

import Post from "components/Post";

import useFirstRender from "hooks/useFirstRender";

import { useAppSelector } from "app/hooks";

import IPost from "types/Post.interface";

const usePosts = (options: string, limit = 10) => {
  const [urlParameters, setUrlParameters] = useState(options);
  const [postsData, setPostsData] = useState([]);
  const [postsArray, setPostsArray] = useState<IPost[]>([]);
  const [isPostsLoading, setPostsLoading] = useState(true);
  const [deleteCallback, setDeleteCallback] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const userData = useAppSelector((state) => state.auth.data);

  const firstRender = useFirstRender();

  const setPosts = useCallback((newValue: string) => {
    setUrlParameters((oldValue) => {
      if (oldValue === newValue) {
        return oldValue;
      }
      return newValue;
    });
  }, []);

  console.log("urlParameters", urlParameters);

  const getPosts = async () => {
    setPostsLoading(true);
    try {
      const result = await axios.get(`/posts?${urlParameters}`);
      setPostsData(result.data);
      setPostsArray((prevPosts) => prevPosts.concat(result.data.results));
    } catch (err) {
      console.warn(err);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    setPostsData([]);
    setPostsArray([]);
  }, [urlParameters]);

  useEffect(() => {
    getPosts();
  }, [pageNumber, urlParameters]);

  useEffect(() => {
    if (!firstRender) {
      getPosts();
    }
  }, [deleteCallback]);

  const observer: any = useRef();
  const lastPostRef = useCallback(
    (node: any) => {
      if (isPostsLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        //@ts-ignore
        if (entries[0].isIntersecting && postsData.next) {
          console.log("we are here");
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    //@ts-ignore
    [isPostsLoading, postsData.next]
  );

  return {
    setPosts,
    postsData,
    posts: postsArray,
    isPostsLoading,
    postsLayout:
      isPostsLoading && postsArray.length === 0 ? (
        <Grid md={8} xs={12} item>
          {[...Array(limit)].map((_, idx) => (
            <Post key={idx} isLoading />
          ))}
        </Grid>
      ) : (
        <Grid md={8} xs={12} item>
          {postsArray.length === 0 ? (
            <>No articles</>
          ) : (
            postsArray.map((obj, idx) =>
              postsArray.length === idx + 1 ? (
                <Post
                  title={obj.title}
                  slug={obj.slug}
                  imageUrl={
                    obj.imageUrl
                      ? `${process.env.REACT_APP_BACKEND_URL}${obj.imageUrl}`
                      : ""
                  }
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={obj.commentsCount}
                  likesCount={obj.likesCount}
                  isLiked={obj.likes?.some(
                    (like: any) => like.user === userData?._id
                  )}
                  tags={obj.tags}
                  deleteCallback={() =>
                    setDeleteCallback((prevState) => !prevState)
                  }
                  isEditable={userData?._id === obj.user?._id}
                  ref={lastPostRef}
                  key={`post${idx}`}
                />
              ) : (
                <Post
                  title={obj.title}
                  slug={obj.slug}
                  imageUrl={
                    obj.imageUrl
                      ? `${process.env.REACT_APP_BACKEND_URL}${obj.imageUrl}`
                      : ""
                  }
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={obj.commentsCount}
                  likesCount={obj.likesCount}
                  isLiked={obj.likes?.some(
                    (like: any) => like.user === userData?._id
                  )}
                  tags={obj.tags}
                  deleteCallback={() =>
                    setDeleteCallback((prevState) => !prevState)
                  }
                  isEditable={userData?._id === obj.user?._id}
                  key={`post${idx}`}
                />
              )
            )
          )}
          {isPostsLoading &&
            [...Array(limit)].map((_, idx) => <Post key={idx} isLoading />)}
        </Grid>
      ),
  };
};

export default usePosts;
