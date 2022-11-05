import React, { useState, useEffect, useRef, useCallback } from "react";

import { Grid } from "@mui/material";

import Post from "components/Post";
import SEO from "components/SEO";

import { useAppSelector } from "app/hooks";

import axios from "../utils/axios";

import IPost from "types/Post.interface";

const MyPosts = () => {
  const [postsData, setPostsData] = useState([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isPostsLoading, setPostsLoading] = useState(true);
  const [deleteCallback, setDeleteCallback] = useState(true);
  const userData = useAppSelector((state) => state.auth.data);

  const [pageNumber, setPageNumber] = useState(1);
  const limit = 10;

  useEffect(() => {
    const getMyPosts = async () => {
      setPostsLoading(true);
      try {
        const myPosts = await axios.get(
          `/posts?own&page=${pageNumber}&limit=${limit}`
        );
        setPostsData(myPosts.data);
        setPosts((prevPosts) => prevPosts.concat(myPosts.data.results));
      } catch (err) {
        console.warn(err);
      } finally {
        setPostsLoading(false);
      }
    };
    getMyPosts();
  }, [pageNumber]);

  useEffect(() => {
    const getAllPosts = async () => {
      setPostsLoading(true);
      try {
        const allPosts = await axios.get(`/posts?own&page=1&limit=${limit}`);
        setPostsData(allPosts.data);
        setPosts(allPosts.data.results);
      } catch (err) {
        console.warn(err);
      } finally {
        setPostsLoading(false);
      }
    };
    getAllPosts();
  }, [deleteCallback]);

  const observer: any = useRef();
  const lastPostRef = useCallback(
    (node: any) => {
      if (isPostsLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        //@ts-ignore
        if (entries[0].isIntersecting && postsData.next) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    //@ts-ignore
    [isPostsLoading, postsData.next]
  );

  return (
    <div>
      <SEO title="My Articles" />
      <Grid container spacing={4}>
        <Grid xs={12} item>
          {!isPostsLoading &&
            (posts.length === 0
              ? "You don't have created articles"
              : posts.map((obj, idx) =>
                  posts.length === idx + 1 ? (
                    <Post
                      key={`post${idx}`}
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
                    />
                  ) : (
                    <Post
                      key={`post${idx}`}
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
                    />
                  )
                ))}
          {isPostsLoading &&
            [...Array(limit)].map((_, idx) => <Post key={idx} isLoading />)}
        </Grid>
      </Grid>
    </div>
  );
};
export default MyPosts;
