import React, { FC, CSSProperties } from "react";

import IErrorText from "types/ErrorText.interface";

const ErrorText: FC<IErrorText> = ({ text, style, className }) => {
  const errorStyles: CSSProperties = {
    color: "#d32f2f",
    margin: "-5px 0 10px",
    fontSize: "0.75rem",
  };

  return text ? (
    <p
      style={{ ...errorStyles, ...style }}
      className={`${className ? className : ""}`}
    >
      {text}
    </p>
  ) : (
    <></>
  );
};

export default ErrorText;
