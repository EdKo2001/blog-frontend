import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

import Search from "./Search";

import IPostsSearch from "types/PostsSearch.interface";

const PostsSearch: FC<IPostsSearch> = ({ style, value }) => {
  const navigate = useNavigate();

  return (
    <Search
      style={style}
      value={value}
      cb={(searchValue) => navigate(`/search?s=${searchValue}`)}
    />
  );
};

export default PostsSearch;
