import React, { FC, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import axios from "utils/axios";

import Post from "components/Post";
import AddComment from "components/AddComment";
import CommentsBlock from "components/CommentsBlock";
import SEO from "components/SEO";

import { useAppSelector } from "app/hooks";
import { selectIsAuth } from "features/auth/authSlice";

import IPost from "types/Post.interface";

const FullPost: FC<IPost> = () => {
  const [data, setData] = useState<any>();
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isCommentsLoading, setCommentsLoading] = useState(true);
  const [commentsCallback, setCommentsCallback] = useState(true);
  const [likesCallback, setLikesCallback] = useState(true);
  const { id } = useParams();
  const isAuth = useAppSelector(selectIsAuth);
  const userData = useAppSelector((state) => state.auth.data);

  useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res: any) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.warn(err);
        alert("Ошибка при получении статьи");
      });
  }, []);

  useEffect(() => {
    axios
      .get(`/posts/${id}/comments`)
      .then((res: any) => {
        setComments(res.data);
        setCommentsLoading(false);
      })
      .catch((err: Error) => {
        console.warn(err);
        alert("Ошибка при получении Комментарий");
      });
  }, [commentsCallback]);

  useEffect(() => {
    axios
      .get(`/posts/${id}/likes`)
      .then((res: any) => {
        setLikes(res.data);
      })
      .catch((err: Error) => {
        console.warn(err);
        alert("Ошибка при получении Лайков");
      });
  }, [likesCallback]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <SEO title={data?.title} description={data?.text.substring(0, 150)} />
      <Post
        id={data?._id}
        title={data?.title}
        imageUrl={
          data?.imageUrl
            ? `${process.env.REACT_APP_BACKEND_URL}${data?.imageUrl}`
            : ""
        }
        user={data?.user}
        createdAt={data?.createdAt}
        viewsCount={data?.viewsCount}
        commentsCount={comments.length}
        likesCount={likes.length}
        isLiked={likes.some((like: any) => like.user === userData?._id)}
        likesCallback={() => setLikesCallback((prevState) => !prevState)}
        tags={data?.tags}
        isFullPost
      >
        <ReactMarkdown children={data?.text} />
      </Post>
      <CommentsBlock items={comments} isLoading={isCommentsLoading}>
        {isAuth && (
          <AddComment
            postId={data?._id}
            callback={() => setCommentsCallback((prevState) => !prevState)}
          />
        )}
      </CommentsBlock>
    </>
  );
};

export default FullPost;
