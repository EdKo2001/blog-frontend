import React, { useState } from "react";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { Drawer, IconButton } from "@mui/material";

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

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            EDUARD'S BLOG
          </Link>
          {isTablet ? (
            <div className={styles.buttons}>
              {isAuth ? (
                <>
                  {userData?.role === "admin" && (
                    <Link to="/admin">
                      <Button variant="text">Admin</Button>
                    </Link>
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
                        <Link to="/admin" onClick={toggleDrawer(false)}>
                          <Button variant="text">Admin</Button>
                        </Link>
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
    </div>
  );
};

export default Header;
