import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import { Category, Task, User } from "../types/user";
import styled from "@emotion/styled";
import { DESCRIPTION_MAX_LENGTH, TASK_NAME_MAX_LENGTH } from "../constants";
import { DialogBtn } from "../styles";
import { CategorySelect, ColorPicker, CustomEmojiPicker } from ".";
import toast from "react-hot-toast";

interface EditTaskProps {
  open: boolean;
  task?: Task;
  onClose: () => void;
  onSave: (editedTask: Task) => void;
  user: User;
}

export const EditTask = ({ open, task, onClose, onSave, user }: EditTaskProps) => {
  const [editedTask, setEditedTask] = useState<Task | undefined>(task);
  const [nameError, setNameError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<string | undefined>();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  useEffect(() => {
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      emoji: emoji,
    }));
  }, [emoji]);

  useEffect(() => {
    setEditedTask(task);
    setSelectedCategories(task?.category as Category[]);
  }, [task]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "name" && value.length > TASK_NAME_MAX_LENGTH) {
      setNameError(true);
    } else {
      setNameError(false);
    }

    if (name === "description" && value.length > DESCRIPTION_MAX_LENGTH) {
      setDescriptionError(true);
    } else {
      setDescriptionError(false);
    }

    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      [name]: value,
    }));
  };

  const handleSave = () => {
    document.body.style.overflow = "auto";
    if (editedTask && !nameError && !descriptionError) {
      onSave(editedTask);
      toast.success(
        <div>
          Görev <b>{editedTask.name}</b> güncellendi.
        </div>
      );
    }
  };

  const handleCancel = () => {
    onClose();
    setEditedTask(task);
    setSelectedCategories(task?.category as Category[]);
  };

  useEffect(() => {
    setEditedTask((prevTask) => ({
      ...(prevTask as Task),
      category: (selectedCategories as Category[]) || undefined,
    }));
  }, [selectedCategories]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setEditedTask(task);
        setSelectedCategories(task?.category as Category[]);
      }}
      PaperProps={{
        style: {
          borderRadius: "24px",
          padding: "12px",
          maxWidth: "600px",
        },
      }}
    >
      <DialogTitle
        sx={{
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Görevi Düzenle</span>
        {editedTask?.lastSave && (
          <SonDüzenleme>
            Son Düzenleme: {new Date(editedTask?.lastSave).toLocaleDateString()}
            {" • "}
            {new Date(editedTask?.lastSave).toLocaleTimeString()}
          </SonDüzenleme>
        )}
      </DialogTitle>
      <DialogContent>
        <CustomEmojiPicker
          user={user}
          emoji={editedTask?.emoji || undefined}
          setEmoji={setEmoji}
          color={editedTask?.color}
          width="400px"
        />
        <StilInput
          label="Ad"
          name="name"
          value={editedTask?.name || ""}
          onChange={handleInputChange}
          fullWidth
          error={nameError || editedTask?.name === ""}
          helperText={
            editedTask?.name === ""
              ? "Ad gereklidir"
              : nameError
              ? `Ad en fazla ${TASK_NAME_MAX_LENGTH} karakter olmalıdır`
              : undefined
          }
        />
        <StilInput
          label="Açıklama"
          name="description"
          value={editedTask?.description || ""}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          error={descriptionError}
          helperText={
            descriptionError &&
            `Açıklama çok uzun (maksimum ${DESCRIPTION_MAX_LENGTH} karakter)`
          }
        />

        <StilInput
          label="Son Teslim Tarihi"
          name="deadline"
          type="datetime-local"
          value={editedTask?.deadline}
          onChange={handleInputChange}
          focused
          fullWidth
        />

        {user.settings[0].enableCategories !== undefined && user.settings[0].enableCategories && (
          <>
            <Etiket>Kategori</Etiket>
            <CategorySelect
              user={user}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </>
        )}
        <Etiket>Renk</Etiket>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <ColorPicker
            width={"100%"}
            color={editedTask?.color || "#000000"}
            onColorChange={(color) => {
              setEditedTask((prevTask) => ({
                ...(prevTask as Task),
                color: color,
              }));
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <DialogBtn onClick={handleCancel}>İptal</DialogBtn>
        <DialogBtn
          onClick={handleSave}
          color="primary"
          disabled={nameError || editedTask?.name === ""}
        >
          Kaydet
        </DialogBtn>
      </DialogActions>
    </Dialog>
  );
};

const StilInput = styled(TextField)`
  margin: 14px 0;
  & .MuiInputBase-root {
    border-radius: 16px;
  }
`;

const Etiket = styled(Typography)`
  margin-left: 8px;
  font-weight: 500;
  font-size: 16px;
`;

const SonDüzenleme = styled.span`
  font-size: 14px;
  font-style: italic;
  font-weight: 400;
  opacity: 0.8;
`;
