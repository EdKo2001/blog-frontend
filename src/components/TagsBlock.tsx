import React, { FC } from "react";
import { Link } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import SideBlock from "./SideBlock";

import ITagsBlock from "types/TagsBlock.interface";

const TagsBlock: FC<ITagsBlock> = ({ items, isLoading = true }) => {
  const uniqueTags = items.filter((element, index) => {
    return items.indexOf(element) === index;
  });

  return (
    <SideBlock title="Tags">
      <List>
        {(isLoading ? [...Array(5)] : uniqueTags).map((name, i) => (
          <Link
            to={`/tag/${name}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem key={i} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </SideBlock>
  );
};

export default TagsBlock;
