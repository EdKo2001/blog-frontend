import React, { FC } from "react";

import IUserInfo from "types/UserInfo.interface";

import styles from "./UserInfo.module.scss";

const UserInfo: FC<IUserInfo> = ({ avatarUrl, fullName, additionalText }) => {
  return (
    <div className={styles.root}>
      <img
        className={styles.avatar}
        src={avatarUrl || "/noavatar.png"}
        alt={fullName}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};

export default UserInfo;
