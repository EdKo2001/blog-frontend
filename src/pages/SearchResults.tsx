import React, { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import { usePosts } from "hooks";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const { postsLayout, setPosts } = usePosts(`search=${searchParams.get("s")}`);

  const search = searchParams.get("s");

  useEffect(() => {
    setPosts(`search=${search}`);
  }, [search]);

  if (!searchParams.get("s")) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <h1>Search Results: {search}</h1>
      {postsLayout}
    </>
  );
};

export default SearchResults;
