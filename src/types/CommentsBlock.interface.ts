interface ICommentsBlock {
  items: {
    user: {
      fullName: string;
      avatarUrl: string;
    };
    text: string;
  }[];
  children?: any;
  isLoading?: boolean;
}

export default ICommentsBlock;
