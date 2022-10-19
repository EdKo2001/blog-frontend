import React, { FC, forwardRef } from "react";
import { Link } from "react-router-dom";

import clsx from "clsx";
import axios from "utils/axios";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import UserInfo from "../UserInfo";
import PostSkeleton from "./PostSkeleton";

import { useThunkDispatch } from "app/hooks";

import { fetchRemovePost } from "features/posts/postsSlice";

import IPost from "types/Post.interface";

import styles from "./Post.module.scss";

const Post: FC<IPost> = forwardRef(
  (
    {
      id,
      title,
      createdAt,
      imageUrl,
      user,
      viewsCount,
      commentsCount,
      likesCount,
      isLiked,
      likesCallback,
      tags,
      children,
      isFullPost,
      isLoading,
      isEditable,
    },
    ref
  ) => {
    const dispatch = useThunkDispatch();

    if (isLoading) {
      return <PostSkeleton />;
    }

    const onClickRemove = () => {
      if (window.confirm("Вы действительно хотите удалить статью?")) {
        dispatch(fetchRemovePost(id as number));
      }
    };

    const like = async () => {
      await axios
        .put(`/posts/${id}/like`)
        .then(() => likesCallback?.())
        .catch((err: Error) => console.log(err));
    };

    const unlike = async () => {
      await axios
        .put(`/posts/${id}/unlike`)
        .then(() => likesCallback?.())
        .catch((err: Error) => console.log(err));
    };

    return (
      <div
        className={clsx(styles.root, { [styles.rootFull]: isFullPost })}
        //@ts-ignore
        ref={ref}
      >
        {isEditable && (
          <div className={styles.editButtons}>
            <Link to={`/posts/${id}/edit`}>
              <IconButton color="primary">
                <EditIcon />
              </IconButton>
            </Link>
            <IconButton onClick={onClickRemove} color="secondary">
              <DeleteIcon />
            </IconButton>
          </div>
        )}
        {imageUrl && (
          <img
            className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
            src={imageUrl}
            alt={title}
          />
        )}
        <div className={styles.wrapper}>
          <UserInfo {...user} postedOn={createdAt!} />
          <div className={styles.indention}>
            <h2
              className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
            >
              {isFullPost ? title : <Link to={`/posts/${id}`}>{title}</Link>}
            </h2>
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
                  <Link to={`/posts/${id}`}>
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
                  <Link to={`/posts/${id}`}>
                    <CommentIcon />
                    <span>{commentsCount}</span>
                  </Link>
                )}
              </li>
              <li>
                {isFullPost ? (
                  <button onClick={isLiked ? unlike : like}>
                    {isLiked ? (
                      <FavoriteIcon htmlColor="red" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                    <span>{likesCount}</span>
                  </button>
                ) : (
                  <Link to={`/posts/${id}`}>
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
