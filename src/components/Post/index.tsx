import React, { FC, forwardRef } from "react";
import { Link } from "react-router-dom";

import clsx from "clsx";
import axios from "utils/axios";

import Tooltip from "@mui/material/Tooltip";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import UserInfo from "../UserInfo";
import PostSkeleton from "./PostSkeleton";

import IPost from "types/Post.interface";

import styles from "./Post.module.scss";

const Post: FC<IPost> = forwardRef(
  (
    {
      isAuth,
      title,
      slug,
      excerpt,
      createdAt,
      imageUrl,
      user,
      viewsCount,
      commentsCount,
      likesCount,
      isLiked,
      likesCallback,
      tags,
      deleteCallback,
      children,
      isFullPost,
      isLoading,
      isEditable,
    },
    ref
  ) => {
    if (isLoading) {
      return <PostSkeleton />;
    }

    const onClickRemove = async () => {
      await axios
        .delete(`/posts/${slug}`)
        .then(() => deleteCallback?.())
        .catch((err: Error) => console.warn(err));
    };

    const like = async () => {
      await axios
        .put(`/posts/${slug}/like`)
        .then(() => likesCallback?.())
        .catch((err: Error) => console.warn(err));
    };

    const unlike = async () => {
      await axios
        .put(`/posts/${slug}/unlike`)
        .then(() => likesCallback?.())
        .catch((err: Error) => console.warn(err));
    };

    return (
      <div
        className={clsx(styles.root, { [styles.rootFull]: isFullPost })}
        //@ts-ignore
        ref={ref}
      >
        {isEditable && (
          <div className={styles.editButtons}>
            <Link to={`/posts/${slug}/edit`} aria-label="Edit Post">
              <IconButton color="primary" aria-label="Edit Post">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton
              onClick={onClickRemove}
              color="secondary"
              aria-label="Delete Post"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        {imageUrl &&
          (isFullPost ? (
            <img
              className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
              src={imageUrl}
              alt={title?.replace(/&nbsp;/g, " ")}
            />
          ) : (
            <Link to={`/posts/${slug}`}>
              <img
                className={clsx(styles.image, {
                  [styles.imageFull]: isFullPost,
                })}
                src={imageUrl}
                alt={title?.replace(/&nbsp;/g, " ")}
              />
            </Link>
          ))}
        <div className={styles.wrapper}>
          <UserInfo {...user} postedOn={createdAt!} />
          <div className={styles.indention}>
            <h2
              className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
            >
              {isFullPost ? (
                title?.replace(/&nbsp;/g, " ")
              ) : (
                <Link to={`/posts/${slug}`}>
                  {title?.replace(/&nbsp;/g, " ")}
                </Link>
              )}
            </h2>
            {excerpt && (
              <div
                dangerouslySetInnerHTML={{ __html: excerpt }}
                className={styles.excerpt}
              />
            )}
            {tags && tags.length > 0 && (
              <ul className={styles.tags}>
                {tags.map((name) => (
                  <li key={name}>
                    <Link to={`/tag/${name}`}>#{name}</Link>
                  </li>
                ))}
              </ul>
            )}
            {children && <div className={styles.content}>{children}</div>}
            <ul className={styles.postDetails}>
              <li>
                {isFullPost ? (
                  <>
                    <EyeIcon />
                    <span>{viewsCount}</span>
                  </>
                ) : (
                  <Link
                    to={`/posts/${slug}`}
                    style={{
                      color: "rgba(0, 0, 0, 0.87)",
                      textDecoration: "none",
                    }}
                  >
                    <EyeIcon />
                    <span>{viewsCount}</span>
                  </Link>
                )}
              </li>
              <li>
                {isFullPost ? (
                  <>
                    <CommentIcon />
                    <span>{commentsCount}</span>
                  </>
                ) : (
                  <Link
                    to={`/posts/${slug}`}
                    style={{
                      color: "rgba(0, 0, 0, 0.87)",
                      textDecoration: "none",
                    }}
                  >
                    <CommentIcon />
                    <span>{commentsCount}</span>
                  </Link>
                )}
              </li>
              <li>
                {isFullPost ? (
                  !isAuth ? (
                    <Tooltip
                      title={
                        <Link to="/login" style={{ color: "white" }}>
                          Please log in
                        </Link>
                      }
                      placement="top"
                      arrow
                    >
                      <button
                        onClick={isLiked ? unlike : like}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        {isLiked ? (
                          <FavoriteIcon htmlColor="red" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                        <span>{likesCount}</span>
                      </button>
                    </Tooltip>
                  ) : (
                    <button
                      onClick={isLiked ? unlike : like}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {isLiked ? (
                        <FavoriteIcon htmlColor="red" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                      <span>{likesCount}</span>
                    </button>
                  )
                ) : (
                  <Link
                    to={`/posts/${slug}`}
                    style={{
                      color: "rgba(0, 0, 0, 0.87)",
                      textDecoration: "none",
                    }}
                  >
                    {isLiked ? (
                      <FavoriteIcon htmlColor="red" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                    <span>{likesCount}</span>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
);

export default Post;
