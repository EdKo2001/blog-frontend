import { CSSProperties } from "react";

interface ISearch {
  value?: string;
  cb: (searchValue: string) => void;
  style?: CSSProperties;
  debounce?: boolean;
  delay?: number;
}

export default ISearch;
