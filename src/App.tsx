import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Container from "@mui/material/Container";

import Header from "components/Header";

import { Home, FullPost, Registration, AddPost, Login } from "./pages";

import { fetchAuthMe, selectIsAuth } from "features/auth/authSlice";

import { useAppSelector, useThunkDispatch } from "app/hooks";

function App() {
  const isAuth = useAppSelector(selectIsAuth);
  const dispatch = useThunkDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [isAuth]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
