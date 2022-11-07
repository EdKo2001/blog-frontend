import React from "react";

import SEO from "components/SEO";

import { usePosts } from "hooks";

const Favorites = () => {
  const { postsLayout } = usePosts(`favorites`);

  return (
    <div>
      <SEO title="Favorites" />
      <h1>Favorites</h1>
      {postsLayout}
    </div>
  );
};

export default Favorites;
