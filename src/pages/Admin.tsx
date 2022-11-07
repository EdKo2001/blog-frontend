import React from "react";

import SEO from "components/SEO";
import Search from "components/Search";

import { usePosts } from "hooks";

const Admin = () => {
  const { postsLayout, setPosts } = usePosts(`all`);

  return (
    <div>
      <SEO title="Admin Panel" />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1>All Posts</h1>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p>Search posts by title</p>
          <Search
            cb={(searchValue) =>
              setPosts(searchValue ? `search=${searchValue}&all` : "all")
            }
            debounce
          />
        </div>
      </div>

      {postsLayout}
    </div>
  );
};

export default Admin;
