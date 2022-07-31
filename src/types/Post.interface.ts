interface IPost {
  _id?: number;
  id?: number;
  title?: string;
  createdAt?: string;
  imageUrl?: string;
  user?: object;
  viewsCount?: number;
  commentsCount?: number;
  tags?: number[];
  children?: any;
  isFullPost?: boolean;
  isLoading?: boolean;
  isEditable?: boolean;
}

export default IPost;
