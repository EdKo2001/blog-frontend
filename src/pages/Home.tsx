import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";

import axios from "../utils/axios";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import Post from "components/Post";
import TagsBlock from "components/TagsBlock";
import SEO from "components/SEO";

import { fetchPosts, fetchTags } from "features/posts/postsSlice";

import { useAppSelector, useThunkDispatch } from "app/hooks";

import IPost from "types/Post.interface";

const Home = () => {
  const { slug } = useParams();

  const dispatch = useThunkDispatch();
  const userData = useAppSelector((state) => state.auth.data);
  const { tags } = useAppSelector((state) => state.posts);

  const [postsData, setPostsData] = useState([]);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [isPostsLoading, setPostsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Latest Posts");
  const [pageNumber, setPageNumber] = useState(1);
  const [tabIndex, setTabIndex] = useState(0);

  const limit = 4;

  // const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  const handleTabChange = (e: any, newTabIndex: number) => {
    setPageNumber(1);
    setPageTitle(e.target.textContent + " Posts");
    setTabIndex(newTabIndex);
  };

  useEffect(() => {
    setPageNumber(1);
    setPageTitle(slug ? `Posts with #${slug}` : "Latest Posts");
  }, [slug]);

  useEffect(() => {
    setPostsData([]);
    setPosts([]);
  }, [slug, tabIndex]);

  useEffect(() => {
    const getPosts = async (options: string) => {
      setPostsLoading(true);
      try {
        const result = await axios.get(`/posts?${options}`);
        setPostsData(result.data);
        setPosts((prevPosts) => prevPosts.concat(result.data.results));
      } catch (err) {
        console.warn(err);
      } finally {
        setPostsLoading(false);
      }
    };

    if (slug) {
      getPosts(`tag=${slug}&page=${pageNumber}&limit=${limit}`);
    } else {
      if (tabIndex === 1) {
        getPosts(`popular&page=${pageNumber}&limit=${limit}`);
      } else if (tabIndex === 2) {
        getPosts(`relevant&page=${pageNumber}&limit=${limit}`);
      } else {
        getPosts(`page=${pageNumber}&limit=${limit}`);
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
    <>
      <SEO title={pageTitle} />
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
          {posts.length === 0 ? (
            <>No articles</>
          ) : (
            posts.map((obj, idx) =>
              posts.length === idx + 1 ? (
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
                  isEditable={userData?._id === obj.user?._id}
                  key={`post${idx}`}
                />
              )
            )
          )}
          {isPostsLoading &&
            [...Array(limit)].map((_, idx) => <Post key={idx} isLoading />)}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock tags={tags.items.results} isLoading={isTagsLoading} />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
