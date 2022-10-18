import React from "react";

import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import { useAppSelector, useThunkDispatch } from "app/hooks";

import {
  selectAuthErrors,
  fetchRegister,
  selectIsAuth,
} from "features/auth/authSlice";

import styles from "./Login.module.scss";

const Registration = () => {
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
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert("Failed to register!");
    }

    if ("token" in data.payload) {
      window.localStorage.setItem("token", data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Create an account
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          error={Boolean(authErrors?.fullName)}
          helperText={authErrors?.fullName}
          {...register("fullName", { required: "Full name is required" })}
          className={styles.field}
          label="Full name"
          fullWidth
        />
        <TextField
          error={Boolean(authErrors?.email)}
          helperText={authErrors?.email}
          type="email"
          {...register("email", { required: "Email is required" })}
          className={styles.field}
          label="Email"
          fullWidth
        />
        <TextField
          error={Boolean(authErrors?.password)}
          helperText={authErrors?.password}
          type="password"
          {...register("password", { required: "Password is required" })}
          className={styles.field}
          label="Password"
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Register
        </Button>
      </form>
    </Paper>
  );
};

export default Registration;
