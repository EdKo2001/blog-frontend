import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Container from "@mui/material/Container";

import Header from "components/Header";
import SEO from "components/SEO";

import { authLoginMe, resetErrors } from "features/auth/authSlice";

import { useAppDispatch, useThunkDispatch } from "app/hooks";

import { AdminRoute, AuthorRoute, PrivateRoute } from "utils/routes";

const Home = lazy(() => import("./pages/Home"));
const FullPost = lazy(() => import("./pages/FullPost"));
const Registration = lazy(() => import("./pages/Registration"));
const AddPost = lazy(() => import("./pages/AddPost"));
const Login = lazy(() => import("./pages/Login"));
const MyPosts = lazy(() => import("./pages/MyPosts"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Admin = lazy(() => import("./pages/Admin"));

const App = () => {
  const dispatch = useThunkDispatch();
  const dispatchApp = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(authLoginMe());
  }, []);

  useEffect(() => {
    dispatchApp(resetErrors());
  }, [location]);

  return (
    <HelmetProvider>
      <SEO />
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/posts"
            element={
              <Suspense>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/posts/:slug"
            element={
              <Suspense>
                <FullPost />
              </Suspense>
            }
          />
          <Route
            path="/posts/:slug/edit"
            element={
              <Suspense>
                <AuthorRoute>
                  <AddPost />
                </AuthorRoute>
              </Suspense>
            }
          />
          <Route
            path="/add-post"
            element={
              <Suspense>
                <AuthorRoute>
                  <AddPost />
                </AuthorRoute>
              </Suspense>
            }
          />
          <Route
            path="/my-posts"
            element={
              <Suspense>
                <AuthorRoute>
                  <MyPosts />
                </AuthorRoute>
              </Suspense>
            }
          />
          <Route
            path="/favorites"
            element={
              <Suspense>
                <PrivateRoute>
                  <Favorites />
                </PrivateRoute>
              </Suspense>
            }
          />
          <Route
            path="/tag/:slug"
            element={
              <Suspense>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense>
                <Registration />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense>
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense>
                <h1 style={{ textAlign: "center" }}>Page Not Found</h1>
                <img
                  src="/404.png"
                  alt="page not found 404"
                  style={{ display: "block", margin: "auto" }}
                />
              </Suspense>
            }
          />
        </Routes>
      </Container>
    </HelmetProvider>
  );
};

export default App;
