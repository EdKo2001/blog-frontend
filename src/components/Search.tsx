import React, { FC, useState, useEffect } from "react";

import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";

import { useDebounce } from "hooks";

import ISearch from "types/Search.interface";

const SearchWrapper = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha("#808080", 0.25),
  "&:hover": {
    backgroundColor: alpha("#808080", 0.3),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("button")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  zIndex: 9,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Search: FC<ISearch> = ({ value, cb, style, delay, debounce }) => {
  const [search, setSearch] = useState(value!);

  useDebounce(
    () => {
      if (debounce) {
        cb(search);
      }
    },
    [search],
    delay
  );

  useEffect(() => {
    setSearch(value!);
  }, [value]);

  return (
    <SearchWrapper
      style={style}
      onSubmit={(e) => (e.preventDefault(), cb(search))}
    >
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        onChange={(
          e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
        ) => setSearch(e.target.value)}
        value={search}
      />
    </SearchWrapper>
  );
};
export default Search;
