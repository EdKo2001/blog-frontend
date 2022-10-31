import React, { useState, useEffect, useRef, useCallback } from "react";

import { Grid } from "@mui/material";

import Post from "components/Post";
import SEO from "components/SEO";

import { useAppSelector } from "app/hooks";

import axios from "../../utils/axios";

import IPost from "types/Post.interface";

const Admin = () => {
  const [postsData, setPostsData] = useState([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isPostsLoading, setPostsLoading] = useState(true);
  const [deleteCallback, setDeleteCallback] = useState(true);
  const userData = useAppSelector((state) => state.auth.data);

  const [pageNumber, setPageNumber] = useState(1);
  const limit = 10;

  useEffect(() => {
    const getAllPosts = async () => {
      setPostsLoading(true);
      try {
        const allPosts = await axios.get(
          `/posts?all&page=${pageNumber}&limit=${limit}`
        );
        setPostsData(allPosts.data);
        setPosts((prevPosts) => prevPosts.concat(allPosts.data.results));
      } catch (err) {
        console.warn(err);
      } finally {
        setPostsLoading(false);
      }
    };
    getAllPosts();
  }, [pageNumber]);

  useEffect(() => {
    const getAllPosts = async () => {
      setPostsLoading(true);
      try {
        const allPosts = await axios.get(`/posts?all&page=1&limit=${limit}`);
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
      <SEO title="Admin Panel" />
      <h1>All Posts</h1>
      <Grid container spacing={4}>
        <Grid xs={12} item>
          {!isPostsLoading &&
            (posts.length === 0
              ? "There is no article created"
              : posts.map((obj, idx) =>
                  posts.length === idx + 1 ? (
                    <Post
                      key={`post${idx}`}
                      id={obj._id}
                      title={obj.title}
                      imageUrl={
                        obj.imageUrl
                          ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                          : ""
                      }
                      user={obj.user}
                      createdAt={obj.createdAt}
                      viewsCount={obj.viewsCount}
                      commentsCount={obj.comments?.length}
                      likesCount={obj.likes?.length}
                      isLiked={obj.likes?.some(
                        (like: any) => like.user === userData?._id
                      )}
                      tags={obj.tags}
                      deleteCallback={() =>
                        setDeleteCallback((prevState) => !prevState)
                      }
                      isEditable={true}
                      ref={lastPostRef}
                    />
                  ) : (
                    <Post
                      key={`post${idx}`}
                      id={obj._id}
                      title={obj.title}
                      imageUrl={
                        obj.imageUrl
                          ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                          : ""
                      }
                      user={obj.user}
                      createdAt={obj.createdAt}
                      viewsCount={obj.viewsCount}
                      commentsCount={obj.comments?.length}
                      likesCount={obj.likes?.length}
                      isLiked={obj.likes?.some(
                        (like: any) => like.user === userData?._id
                      )}
                      tags={obj.tags}
                      deleteCallback={() =>
                        setDeleteCallback((prevState) => !prevState)
                      }
                      isEditable={true}
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

export default Admin;
