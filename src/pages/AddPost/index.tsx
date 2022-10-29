import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
  ChangeEvent,
} from "react";
import { useNavigate, Navigate, useParams } from "react-router-dom";

import SimpleMDE from "react-simplemde-editor";

import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

import axios from "utils/axios";

import { useAppSelector } from "app/hooks";

import { selectIsAuth } from "features/auth/authSlice";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";

const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useAppSelector(selectIsAuth);
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const inputFileRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(id);

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
    } catch (err) {
      console.warn(err);
      alert("File upload error!");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = useCallback((value: any) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert("Error getting article!");
    }
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }: any) => {
          setTitle(data.title);
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTags(data.tags.join(","));
        })
        .catch((err: Error) => {
          console.warn(err);
          alert("Error getting article!");
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

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
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
            src={`${process.env.REACT_APP_API_URL}${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Article title..."
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
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Save" : "Publish"}
        </Button>
        <Button
          onClick={() => {}}
          size="large"
          variant="contained"
          color="secondary"
        >
          Draft
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};

export default AddPost;
