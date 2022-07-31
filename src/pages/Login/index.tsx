import React from "react";
import { Navigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import { useAppSelector, useThunkDispatch } from "app/hooks";

import { fetchAuth, selectIsAuth } from "features/auth/authSlice";

import styles from "./Login.module.scss";

const Login = () => {
  const isAuth = useAppSelector(selectIsAuth);
  const dispatch = useThunkDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "test@test.ru",
      password: "123",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: any) => {
    const data = await dispatch(fetchAuth(values));

    if (!data.payload) {
      return alert("Не удалось авторизоваться!");
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
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          {...register("email", { required: "Укажите почту" })}
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Укажите пароль" })}
          fullWidth
        />
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Войти
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
