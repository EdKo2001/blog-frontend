import React, { ReactNode } from "react";
import { Navigate, Route } from "react-router-dom";

import { selectIsAuth } from "features/auth/authSlice";

import { useAppSelector } from "app/hooks";

export const PrivateRoute = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const isAuth = useAppSelector(selectIsAuth);
  return isAuth ? children : <Navigate to="/login" />;
};

export const AuthorRoute = ({
  children,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const isAuth = useAppSelector(selectIsAuth);
  const role = useAppSelector((state) => state.auth?.data?.role);

  return isAuth && (role === "author" || role === "admin") ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = useAppSelector(selectIsAuth);
  const role = useAppSelector((state) => state.auth?.data?.role);

  return isAuth && role === "admin" ? children : <Navigate to="/login" />;
};
