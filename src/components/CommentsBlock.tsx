import React, { FC } from "react";
import moment from "moment";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";

import SideBlock from "./SideBlock";

import ICommentsBlock from "types/CommentsBlock.interface";

const CommentsBlock: FC<ICommentsBlock> = ({
  items,
  children,
  isLoading = true,
}) => {
  return (
    <SideBlock title="Comments">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton variant="circular" width={40} height={40} />
                ) : (
                  <Avatar alt={obj.user?.fullName} src={obj.user?.avatarUrl} />
                )}
              </ListItemAvatar>
              {isLoading ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>
              ) : (
                <ListItemText
                  primary={
                    <>
                      {obj.user?.fullName}{" "}
                      <span style={{ fontSize: 11 }}>
                        {moment(obj.createAt).format("MMM D YYYY")}
                      </span>
                    </>
                  }
                  secondary={obj.text}
                />
              )}
            </ListItem>
            {items.length - 1 !== index && (
              <Divider variant="inset" component="li" />
            )}
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};

export default CommentsBlock;
