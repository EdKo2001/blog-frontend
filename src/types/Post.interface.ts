interface IPost {
  _id?: number;
  id?: number;
  title?: string;
  createdAt?: string;
  imageUrl?: string;
  user?: object;
  viewsCount?: number;
  commentsCount?: number;
  likesCount?: number;
  isLiked?: boolean;
  likesCallback?: () => void;
  tags?: number[];
  children?: any;
  isFullPost?: boolean;
  isLoading?: boolean;
  isEditable?: boolean;
}

export default IPost;
