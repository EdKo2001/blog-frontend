import React from "react";

import SEO from "components/SEO";

import { usePosts } from "hooks";

const MyPosts = () => {
  const { postsLayout } = usePosts(`own`);

  return (
    <div>
      <SEO title="My Articles" />
      {postsLayout}
    </div>
  );
};

export default MyPosts;
