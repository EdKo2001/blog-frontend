import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import Post from "components/Post";
import TagsBlock from "components/TagsBlock";

import { fetchPosts, fetchTags } from "features/posts/postsSlice";

import { useAppSelector, useThunkDispatch } from "app/hooks";

const Home = () => {
  const dispatch = useThunkDispatch();
  const userData = useAppSelector((state) => state.auth.data);
  const { posts, tags } = useAppSelector((state) => state.posts);
  const [tabIndex, setTabIndex] = useState(0);
  const { slug } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const limit = 4;

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const handleTabChange = (_: any, newTabIndex: number) => {
    setPageNumber(1);
    setTabIndex(newTabIndex);
  };

  useEffect(() => {
    setPageNumber(1);
  }, [slug]);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPosts({ tag: slug, page: pageNumber, limit }));
    } else {
      if (tabIndex === 1) {
        dispatch(fetchPosts({ popular: true, page: pageNumber, limit }));
      } else if (tabIndex === 2) {
        dispatch(fetchPosts({ relevant: true, page: pageNumber, limit }));
      } else {
        dispatch(fetchPosts({ page: pageNumber, limit }));
      }
    }
  }, [tabIndex, slug, pageNumber]);

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  const observer: any = useRef();
  const lastPostRef = useCallback(
    (node: any) => {
      if (isPostsLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && posts.items.next) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isPostsLoading, posts.items.next]
  );

  return (
    <>
      {!slug && (
        <Tabs
          style={{ marginBottom: 15 }}
          aria-label="post categories"
          value={tabIndex}
          onChange={handleTabChange}
        >
          <Tab label="Latest" />
          <Tab label="Popular" />
          <Tab label="Relevant" />
        </Tabs>
      )}
      {slug && (
        <Tabs style={{ marginBottom: 15 }} aria-label={slug} value={0}>
          <Tab label={slug} />
        </Tabs>
      )}
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {posts.items.results.map((obj, index) =>
            posts.items.results.length === index + 1 ? (
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
                isEditable={userData?._id === obj.user?._id}
              />
            )
          )}
          {isPostsLoading &&
            [...Array(limit)].map((_, idx) => <Post key={idx} isLoading />)}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
