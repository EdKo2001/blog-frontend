interface ICommentsBlock {
  items: {
    user: {
      fullName: string;
      avatarUrl: string;
    };
    text: string;
    createdAt: Date;
  }[];
  children?: any;
  isLoading?: boolean;
}

export default ICommentsBlock;
