import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import axios from "utils/axios";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Drawer, IconButton } from "@mui/material";

import PostsSearch from "components/PostsSearch";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { useAppSelector, useThunkDispatch } from "app/hooks";

import { logout, selectIsAuth } from "features/auth/authSlice";

import useMediaQuery from "hooks/useMediaQuery";

import styles from "./Header.module.scss";

const Header = () => {
  const dispatch = useThunkDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const userData = useAppSelector((state) => state.auth.data);

  const [searchParams] = useSearchParams();
  const nagivate = useNavigate();

  const [isMobNavOpen, setMobNavOpen] = useState(false);

  const isTablet = useMediaQuery("(min-width: 800px)");

  const onClickLogout = () => {
    dispatch(logout());
    window.localStorage.removeItem("token");
  };

  const toggleDrawer =
    (open: boolean) => (e: React.KeyboardEvent | React.MouseEvent) => {
      if (
        e &&
        e.type === "keydown" &&
        ((e as React.KeyboardEvent).key === "Tab" ||
          (e as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setMobNavOpen(open);
    };

  const importPosts = async () => {
    await axios
      .post("/scrape/posts")
      .then(
        (res: { data: { posts?: any[]; message?: string } }) => (
          alert(res?.data?.message), nagivate(0)
        )
      )
      .catch((err: Error) => console.warn(err));
  };

  return (
    <header className={styles.header}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link className={styles.logo} to="/">
              <img src="/logo.png" />
            </Link>
            <PostsSearch
              style={{ margin: "0 15px 0 20px" }}
              value={searchParams.get("s") ?? ""}
            />
          </div>
          {isTablet ? (
            <div className={styles.buttons}>
              {isAuth ? (
                <>
                  {userData?.role === "admin" && (
                    <>
                      <Link to="/admin">
                        <Button variant="text">Admin</Button>
                      </Link>
                      <Button variant="text" onClick={importPosts}>
                        Import Posts
                      </Button>
                    </>
                  )}
                  {(userData?.role === "author" ||
                    userData?.role === "admin") && (
                    <>
                      <Link to="/my-posts">
                        <Button variant="text">My Articles</Button>
                      </Link>
                      <Link to="/add-post">
                        <Button variant="text">Write an article</Button>
                      </Link>
                    </>
                  )}
                  <Link to="/favorites">
                    <Button variant="text">Favorites</Button>
                  </Link>
                  <Button
                    onClick={onClickLogout}
                    variant="contained"
                    color="error"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outlined">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="contained">Create an account</Button>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={toggleDrawer(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                <MenuIcon htmlColor="black" />
              </button>
              <Drawer
                anchor="right"
                open={isMobNavOpen}
                onClose={toggleDrawer(false)}
              >
                <IconButton
                  style={{ justifyContent: "flex-end", color: "black" }}
                  onClick={toggleDrawer(false)}
                >
                  <CloseIcon />
                </IconButton>
                <div className={styles.buttons}>
                  {isAuth ? (
                    <>
                      {userData?.role === "admin" && (
                        <>
                          <Link to="/admin" onClick={toggleDrawer(false)}>
                            <Button variant="text">Admin</Button>
                          </Link>
                          <Button variant="text" onClick={importPosts}>
                            Import Posts
                          </Button>
                        </>
                      )}
                      {(userData?.role === "author" ||
                        userData?.role === "admin") && (
                        <>
                          <Link to="/my-posts" onClick={toggleDrawer(false)}>
                            <Button variant="text">My Articles</Button>
                          </Link>
                          <Link to="/add-post" onClick={toggleDrawer(false)}>
                            <Button variant="text">Write an article</Button>
                          </Link>
                        </>
                      )}
                      <Link to="/favorites" onClick={toggleDrawer(false)}>
                        <Button variant="text">Favorites</Button>
                      </Link>
                      <Button
                        onClick={(e) => (
                          toggleDrawer(false)(e), onClickLogout()
                        )}
                        variant="contained"
                        color="error"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={toggleDrawer(false)}>
                        <Button variant="outlined">Sign In</Button>
                      </Link>
                      <Link to="/register" onClick={toggleDrawer(false)}>
                        <Button variant="contained">Create an account</Button>
                      </Link>
                    </>
                  )}
                </div>
              </Drawer>
            </>
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
