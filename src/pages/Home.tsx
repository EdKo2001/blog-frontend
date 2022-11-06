import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";

import TagsBlock from "components/TagsBlock";
import SEO from "components/SEO";

import { fetchTags } from "features/tags/tagsSlice";

import { useAppSelector, useThunkDispatch } from "app/hooks";

import { useMediaQuery, usePosts } from "../hooks";

const Home = () => {
  const { slug } = useParams();

  const dispatch = useThunkDispatch();

  const { tags } = useAppSelector((state) => state.tags);

  const { postsLayout, setPosts } = usePosts("");

  const [pageTitle, setPageTitle] = useState("Latest Posts");

  const [tabIndex, setTabIndex] = useState(0);

  const isTablet = useMediaQuery("(min-width: 800px)");

  const isTagsLoading = tags.status === "loading";

  const handleTabChange = (e: any, newTabIndex: number) => {
    setPageTitle(e.target.textContent + " Posts");
    setTabIndex(newTabIndex);
  };

  useEffect(() => {
    setPageTitle(slug ? `Posts with #${slug}` : "Latest Posts");
  }, [slug]);

  useEffect(() => {
    if (slug) {
      setPosts(`tag=${slug}`);
    } else {
      if (tabIndex === 1) {
        setPosts("popular");
      } else if (tabIndex === 2) {
        setPosts("relevant");
      } else {
        setPosts("");
      }
    }
  }, [tabIndex, slug]);

  // useEffect(() => {
  //   if (!firstRender) {
  //     const getPosts = async (options?: string) => {
  //       setPostsLoading(true);
  //       try {
  //         const result = await axios.get(
  //           `/posts${options ? "/" + options : ""}`
  //         );
  //         setPostsData(result.data);
  //         setPosts((prevPosts) => prevPosts.concat(result.data.results));
  //       } catch (err) {
  //         console.warn(err);
  //       } finally {
  //         setPostsLoading(false);
  //       }
  //     };

  //     if (slug) {
  //       getPosts(`tag=${slug}`);
  //     } else {
  //       if (tabIndex === 1) {
  //         getPosts(`popular`);
  //       } else if (tabIndex === 2) {
  //         getPosts(`relevant`);
  //       } else {
  //         getPosts();
  //       }
  //     }
  //   }
  // }, [deleteCallback]);

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

  // const observer: any = useRef();
  // const lastPostRef = useCallback(
  //   (node: any) => {
  //     if (isPostsLoading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       //@ts-ignore
  //       if (entries[0].isIntersecting && postsData.next) {
  //         console.log("we are here");
  //         setPageNumber((prevPageNumber) => prevPageNumber + 1);
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   //@ts-ignore
  //   [isPostsLoading, postsData.next]
  // );

  return (
    <>
      <SEO title={pageTitle} />
      {!isTablet && (
        <Grid xs={12} item>
          <TagsBlock tags={tags.items.results} isLoading={isTagsLoading} />
        </Grid>
      )}
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
        {postsLayout}
        {/* {isPostsLoading && posts.length === 0 ? (
          <Grid md={8} xs={12} item>
            {[...Array(limit)].map((_, idx) => (
              <Post key={idx} isLoading />
            ))}
          </Grid>
        ) : (
          <Grid md={8} xs={12} item>
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
        )} */}
        <Grid md={4} xs={12} item>
          {isTablet && (
            <TagsBlock tags={tags.items.results} isLoading={isTagsLoading} />
          )}
          <img
            src="/banner.jpg"
            alt="your banner"
            style={{ maxWidth: "100%" }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
