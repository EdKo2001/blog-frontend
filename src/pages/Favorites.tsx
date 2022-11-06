import React from "react";

import SEO from "components/SEO";

import { usePosts } from "hooks";

const Favorites = () => {
  const { postsLayout } = usePosts(`favorites`);

  return (
    <div>
      <SEO title="Favorites" />
      {postsLayout}
    </div>
  );
};

export default Favorites;
