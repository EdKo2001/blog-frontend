import React from "react";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

import { useAppSelector, useThunkDispatch } from "app/hooks";

import { logout, selectIsAuth } from "features/auth/authSlice";

import styles from "./Header.module.scss";

const Header = () => {
  const dispatch = useThunkDispatch();
  const isAuth = useAppSelector(selectIsAuth);
  const userData = useAppSelector((state) => state.auth.data);

  const onClickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            EDUARD'S BLOG
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                {userData?.role === "admin" && (
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
                <Link to="/my-account">
                  <Button variant="text">My Account</Button>
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
        </div>
      </Container>
    </div>
  );
};

export default Header;
