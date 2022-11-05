import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  ChangeEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

import SimpleMDE from "react-simplemde-editor";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import SEO from "components/SEO";
import ErrorText from "components/ErrorText";

import axios from "utils/axios";

import { useAppSelector } from "app/hooks";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

const AddPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const authData = useAppSelector((state) => state.auth?.data);

  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState("published");
  const [errors, setErrors] = useState({});
  const [imageErrorText, setImageErrorText] = useState("");

  const inputFileRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(slug);

  const handleChangeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event?.target?.files) {
        return;
      }
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
      setImageErrorText("");
    } catch (err) {
      console.warn(err);
      setImageErrorText(err.response.data.message);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = useCallback((value: any) => {
    setText(value);
  }, []);

  const onSubmit = async (status?: string) => {
    try {
      const fields = {
        title,
        imageUrl,
        tags,
        text,
        status,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${slug}`, fields)
        : await axios.post("/posts", fields);

      setErrors({});

      navigate(`/posts/${isEditing ? slug : data.slug}`);
    } catch (err) {
      console.warn(err);
      setErrors(
        err.response.data.errors
          ? err.response.data.errors
          : { message: err.response.data.message }
      );
    }
  };

  useEffect(() => {
    if (slug) {
      axios
        .get(`/posts/${slug}`)
        .then(({ data }: any) => {
          if (data.user._id !== authData._id && authData.role !== "admin") {
            return navigate("/my-posts");
          }
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(","));
          setStatus(data.status);
        })
        .catch((err: Error) => {
          console.warn(err);
          setTimeout(() => {
            navigate("/my-posts");
          }, 1000);
        });
    }
  }, []);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Enter text...",
      status: false,
      autosave: { uniqueId: "uniqueId", enabled: true, delay: 1000 },
    }),
    []
  );

  return (
    <Paper style={{ padding: 30 }}>
      <SEO title="Write an article" />
      <Button
        onClick={() => inputFileRef.current?.click()}
        variant="outlined"
        size="large"
      >
        Upload preview
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Delete
          </Button>
          <img
            className={styles.image}
            src={`${process.env.REACT_APP_BACKEND_URL}${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <ErrorText text={imageErrorText} />
      <br />
      <br />
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Article title..."
        //@ts-ignore
        error={Boolean(errors?.title)}
        //@ts-ignore
        helperText={errors?.title}
        fullWidth
        required
      />
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <ErrorText
        //@ts-ignore
        text={errors?.text}
      />
      <ErrorText
        //@ts-ignore
        text={errors?.message}
      />
      <div className={styles.buttons}>
        <Button
          onClick={() => onSubmit(status)}
          size="large"
          variant="contained"
        >
          {isEditing ? "Save" : "Publish"}
        </Button>
        <Button
          onClick={() =>
            onSubmit(status === "drafted" ? "published" : "drafted")
          }
          size="large"
          variant="contained"
          color="secondary"
        >
          {status === "drafted" ? "Publish" : "Draft"}
        </Button>
        <a href={isEditing ? "/my-posts" : "/"}>
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};

export default AddPost;
