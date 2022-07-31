import React, { FC } from "react";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import ISideBlock from "types/SideBlock.interface";

import styles from "./SideBlock.module.scss";

const SideBlock: FC<ISideBlock> = ({ title, children }) => {
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography variant="h6" classes={{ root: styles.title }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};

export default SideBlock;
