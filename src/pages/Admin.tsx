import React from "react";

import SEO from "components/SEO";

import { usePosts } from "hooks";

const Admin = () => {
  const { postsLayout } = usePosts(`all`);

  return (
    <div>
      <SEO title="Admin Panel" />
      <h1>All Posts</h1>
      {postsLayout}
    </div>
  );
};

export default Admin;
