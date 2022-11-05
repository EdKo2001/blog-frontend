import React, { FC, memo } from "react";
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

const TagsBlock: FC<ITagsBlock> = memo(({ tags, isLoading = true }) => {
  return (
    <SideBlock title="Popular Tags">
      <List>
        {(isLoading ? [...Array(10)] : tags).map((name, i) => (
          <ListItem disablePadding>
            <Link
              to={`/tag/${name}`}
              style={{ textDecoration: "none", color: "black" }}
              key={i}
            >
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
            </Link>
          </ListItem>
        ))}
      </List>
    </SideBlock>
  );
});

export default TagsBlock;
