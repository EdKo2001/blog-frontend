interface IPost {
  _id?: number;
  id?: number;
  title?: string;
  createdAt?: string;
  imageUrl?: string;
  user?: { _id: number };
  viewsCount?: number;
  comments?: [];
  commentsCount?: number;
  likes?: [];
  likesCount?: number;
  isLiked?: boolean;
  likesCallback?: () => void;
  tags?: number[];
  deleteCallback?: () => void;
  children?: any;
  isFullPost?: boolean;
  isLoading?: boolean;
  isEditable?: boolean;
  ref?: any;
}

export default IPost;
