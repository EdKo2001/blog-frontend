import React, { useState, useEffect, useRef, useCallback } from "react";

import { Grid } from "@mui/material";

import Post from "components/Post";

import { useAppSelector } from "app/hooks";

import axios from "../../utils/axios";

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
  }, [pageNumber, deleteCallback]);

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
      <Grid container spacing={4}>
        <Grid xs={12} item>
          {!isPostsLoading &&
            (posts.length === 0
              ? "You don't have created articles"
              : posts.map((obj, index) =>
                  posts.length === index + 1 ? (
                    <Post
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
                      isEditable={userData?._id === obj.user?._id}
                      ref={lastPostRef}
                    />
                  ) : (
                    <Post
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
