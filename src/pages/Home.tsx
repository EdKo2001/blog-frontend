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

  useEffect(() => {
    dispatch(fetchTags());
  }, []);

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
