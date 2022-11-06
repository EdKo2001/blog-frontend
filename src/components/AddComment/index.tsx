import React, { useState, useEffect } from "react";

import axios from "utils/axios";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import { useAppSelector } from "app/hooks";

import styles from "./AddComment.module.scss";

const Index = ({ slug, callback }: { slug: string; callback: () => void }) => {
  const userData = useAppSelector((state) => state.auth.data);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (values: any) => {
    const { text } = values;
    if (!captchaToken) {
      return setCaptchaError(true);
    }
    try {
      await axios
        .post(`/posts/${slug}/comments`, { text, captchaToken })
        .then((res: any) => {
          reset();
          callback();
          setCaptchaError(false);
          //@ts-ignore
          window.grecaptcha.reset();
          setCaptchaToken("");
        })
        .catch((err: Error) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={userData.avatarUrl} />
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <TextField
            label="Write a comment"
            variant="outlined"
            {...register("text", { required: "Text is required" })}
            maxRows={10}
            multiline
            fullWidth
          />
          <ReCAPTCHA
            sitekey={process.env.REACT_APP_CAPTCHA_SITE_KEY!}
            onChange={(value: string) => (
              setCaptchaToken(value), setCaptchaError(false)
            )}
            className={styles.captcha}
          />
          {captchaError && (
            <p style={{ color: "red", margin: 0 }}>Please solve the captcha</p>
          )}
          <Button disabled={!isValid} type="submit" variant="contained">
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

export default Index;
