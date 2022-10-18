import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Container from "@mui/material/Container";

import Header from "components/Header";

import { Home, FullPost, Registration, AddPost, Login } from "./pages";

import { fetchAuthMe, resetErrors } from "features/auth/authSlice";

import { useAppDispatch, useThunkDispatch } from "app/hooks";

function App() {
  const dispatch = useThunkDispatch();
  const dispatchApp = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  useEffect(() => {
    dispatchApp(resetErrors());
  }, [location]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/tag/:slug" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="*"
            element={
              <img
                src="./404.png"
                alt="page not found"
                style={{ display: "block", margin: "auto" }}
              />
            }
          />
        </Routes>
      </Container>
    </>
  );
}

export default App;
