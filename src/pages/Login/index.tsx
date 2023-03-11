import React from "react";

import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import SEO from "components/SEO";
import ErrorText from "components/ErrorText";

import { useAppSelector, useThunkDispatch } from "app/hooks";

import {
  selectAuthErrors,
  authLogin,
  selectIsAuth,
} from "features/auth/authSlice";

import styles from "./Login.module.scss";

// const customTextField = TextField.prototype.

const Login = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const authErrors = useAppSelector(selectAuthErrors);
  const dispatch = useThunkDispatch();

  const { register, handleSubmit } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (values: any) => {
    try {
      await dispatch(authLogin(values))
        .then((res) => {
          if ("token" in res.payload) {
            window.localStorage.setItem("token", res.payload.token);
          }
        })
        .catch((err) => console.warn(err));
    } catch (error) {
      console.log(error);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      {/* <SEO title="Sign In" /> */}
      <Typography classes={{ root: styles.title }} variant="h5">
        Sign In
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} data-testid="login-form">
        <TextField
          className={styles.field}
          label="Email"
          error={Boolean(authErrors?.email)}
          helperText={authErrors?.email}
          type="email"
          {...register("email", { required: "Email is required" })}
          fullWidth
          required
          data-testid="email"
        />
        <TextField
          className={styles.field}
          label="Password"
          error={Boolean(authErrors?.password)}
          helperText={authErrors?.password}
          type="password"
          {...register("password", { required: "Password is required" })}
          fullWidth
          required
          data-testid="password"
        />
        <ErrorText text={authErrors?.message} style={{ textAlign: "center" }} />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Sign In
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
