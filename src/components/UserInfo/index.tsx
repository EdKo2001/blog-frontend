import React, { FC } from "react";
import moment from "moment";

import IUserInfo from "types/UserInfo.interface";

import styles from "./UserInfo.module.scss";

const UserInfo: FC<IUserInfo> = ({ avatarUrl, fullName, postedOn }) => {
  return (
    <div className={styles.root}>
      <img
        className={styles.avatar}
        src={avatarUrl || "/noavatar.png"}
        alt={fullName}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>
          Posted on {moment(postedOn).format("MMM Do YYYY")}
        </span>
      </div>
    </div>
  );
};

export default UserInfo;
