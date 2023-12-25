import { Category, Task, UserProps } from "../types/user";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddTaskButton, Container, StyledInput } from "../styles";
import { Edit } from "@mui/icons-material";

import { Button, Typography } from "@mui/material";

import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { CategorySelect, ColorPicker, TopBar, CustomEmojiPicker } from "../components";

import toast from "react-hot-toast";

export const AddTask = ({ user, setUser }: UserProps) => {
  const [name, setName] = useState<string>("");
  const [emoji, setEmoji] = useState<string | undefined>();
  const [color, setColor] = useState<string>("#b624ff");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const n = useNavigate();

  useEffect(() => {
    document.title = "Todo Uygulaması - Görev Ekle";
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    if (newName.length > TASK_NAME_MAX_LENGTH) {
      setNameError(`İsim ${TASK_NAME_MAX_LENGTH} karakterden az veya eşit olmalıdır`);
    } else {
      setNameError("");
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = event.target.value;
    setDescription(newDescription);
    if (newDescription.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(
        `Açıklama ${DESCRIPTION_MAX_LENGTH} karakterden az veya eşit olmalıdır`
      );
    } else {
      setDescriptionError("");
    }
  };

  // const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setColor(event.target.value);
  // };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeadline(event.target.value);
  };

  const handleAddTask = () => {
    if (name !== "") {
      if (name.length > TASK_NAME_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH) {
        return; // İsim veya açıklama maksimum uzunluğu aşıyorsa görev eklenmez
      }

      const newTask: Task = {
        id: new Date().getTime() + Math.floor(Math.random() * 1000),
        done: false,
        pinned: false,
        name,
        description: description !== "" ? description : undefined,
        emoji: emoji ? emoji : undefined,
        color,
        date: new Date(),
        deadline: deadline !== "" ? new Date(deadline) : undefined,
        category: selectedCategories ? selectedCategories : [],
      };

      setUser((prevUser) => ({
        ...prevUser,
        tasks: [...prevUser.tasks, newTask],
      }));

      n("/");
      toast.success(() => (
        <div>
          Görev eklendi - <b>{newTask.name}</b>
        </div>
      ));
    } else {
      toast.error("Lütfen bir görev adı girin");
    }
  };

  return (
    <>
      <TopBar title="Yeni Görev Ekle" />
      <Container>
        <CustomEmojiPicker user={user} setEmoji={setEmoji} color={color} />
        <StyledInput
          label="Görev Adı"
          name="name"
          placeholder="Görev adını girin"
          value={name}
          onChange={handleNameChange}
          focused
          error={nameError !== ""}
          helperText={nameError}
        />
        <StyledInput
          label="Görev Açıklaması (isteğe bağlı)"
          name="name"
          placeholder="Görev açıklamasını girin"
          value={description}
          onChange={handleDescriptionChange}
          multiline
          rows={4}
          focused
          error={descriptionError !== ""}
          helperText={descriptionError}
        />
        <StyledInput
          label="Görev Bitiş Tarihi (isteğe bağlı)"
          name="name"
          placeholder="Bitiş tarihini girin"
          type="datetime-local"
          value={deadline}
          onChange={handleDeadlineChange}
          focused
        />
        {user.settings[0].enableCategories !== undefined && user.settings[0].enableCategories && (
          <>
            <br />
            <Typography>Kategori (isteğe bağlı)</Typography>

            <CategorySelect
              user={user}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              width="400px"
            />
            <Link to="/categories">
              <Button
                sx={{
                  margin: "8px 0 24px 0 ",
                  padding: "12px 24px",
                  borderRadius: "12px",
                }}
              >
                <Edit /> &nbsp; Kategorileri Düzenle
              </Button>
            </Link>
          </>
        )}
        <Typography>Renk</Typography>
        <ColorPicker
          color={color}
          onColorChange={(color) => {
            setColor(color);
          }}
        />

        {/* <Typography>Color</Typography>
        <ColorPicker type="color" value={color} onChange={handleColorChange} /> */}
        <AddTaskButton
          onClick={handleAddTask}
          disabled={
            name.length > TASK_NAME_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH
          }
        >
          Görev Oluştur
        </AddTaskButton>
      </Container>
    </>
  );
};
