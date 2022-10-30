import React from "react";

import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import SEO from "components/SEO";

import { useAppSelector, useThunkDispatch } from "app/hooks";

import {
  selectAuthErrors,
  fetchAuth,
  selectIsAuth,
} from "features/auth/authSlice";

import styles from "./Login.module.scss";

const Login = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const authErrors = useAppSelector(selectAuthErrors);
  const dispatch = useThunkDispatch();

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (values: any) => {
    try {
      const data = await dispatch(fetchAuth(values));

      if (!data.payload) {
        return alert("Failed to login!");
      }

      if ("token" in data.payload) {
        window.localStorage.setItem("token", data.payload.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <SEO title="Sign In" />
      <Typography classes={{ root: styles.title }} variant="h5">
        Sign In
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="Email"
          error={Boolean(authErrors?.email)}
          helperText={authErrors?.email}
          type="email"
          {...register("email", { required: "Email is required" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Password"
          error={Boolean(authErrors?.password)}
          helperText={authErrors?.password}
          {...register("password", { required: "Password is required" })}
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Sign In
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
