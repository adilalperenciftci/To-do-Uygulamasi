import {
  ContentCopy,
  Delete,
  Done,
  Edit,
  IosShare,
  Launch,
  Link,
  PushPin,
  RecordVoiceOver,
} from "@mui/icons-material";
import { User } from "../types/user";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { BottomSheet } from "react-spring-bottom-sheet";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import styled from "@emotion/styled";
import "react-spring-bottom-sheet/dist/style.css";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { ColorPalette, DialogBtn } from "../styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

//TODO: Tüm fonksiyonları TasksMenu bileşenine taşı

interface TaskMenuProps {
  user: User;
  selectedTaskId: number | null;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  anchorEl: null | HTMLElement;
  handleMarkAsDone: () => void;
  handlePin: () => void;
  handleDeleteTask: () => void;
  handleDuplicateTask: () => void;
  handleCloseMoreMenu: () => void;
  handleReadAloud: () => void;
}

export const TaskMenu = ({
  user,
  selectedTaskId,
  setEditModalOpen,
  anchorEl,
  handleMarkAsDone,
  handlePin,
  handleDeleteTask,
  handleDuplicateTask,
  handleCloseMoreMenu,
  handleReadAloud,
}: TaskMenuProps) => {
  const [showShareDialog, setShowShareDialog] = useState<boolean>(false);
  const n = useNavigate();

  const redirectToTaskDetails = () => {
    const selectedTask = user.tasks.find((task) => task.id === selectedTaskId);
    const taskId = selectedTask?.id.toString().replace(".", "");
    n(`/task/${taskId}`);
  };
  //TODO: Linkleri daha kısa hale getir
  const generateShareableLink = (taskId: number | null, userName: string) => {
    const task = user.tasks.find((task) => task.id === taskId);
    if (task) {
      const encodedTask = encodeURIComponent(JSON.stringify(task));
      const encodedUserName = encodeURIComponent(userName);
      return `${window.location.href}share?task=${encodedTask}&userName=${encodedUserName}`;
    }
    return "";
  };
  const handleCopyToClipboard = () => {
    const linkToCopy = generateShareableLink(selectedTaskId, user.name || "Kullanıcı");

    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        toast.success("Bağlantı kopyalandı");
      })

      .catch((error) => {
        console.error("Bağlantı kopyalanırken hata oluştu:", error);
        toast.error("Bağlantı kopyalanırken hata oluştu");
      });
  };

  const handleShare = () => {
    const linkToShare = generateShareableLink(selectedTaskId, user.name || "Kullanıcı");
    if (navigator.share) {
      navigator
        .share({
          title: "Görevi Paylaş",
          text: `Bu görevi kontrol et: ${
            user.tasks.find((task) => task.id === selectedTaskId)?.name
          }`,
          url: linkToShare,
        })
        .then(() => {
          console.log("Bağlantı başarıyla paylaşıldı");
        })
        .catch((error) => {
          console.error("Bağlantı paylaşılırken hata oluştu:", error);
          toast.error("Bağlantı paylaşılırken hata oluştu");
        });
    }
  };

  const menuItems: JSX.Element = (
    <div>
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          handleMarkAsDone();
        }}
      >
        <Done /> &nbsp;{" "}
        {user.tasks.find((task) => task.id === selectedTaskId)?.done
          ? "Tamamlanmamış olarak işaretle"
          : "Tamamlandı olarak işaretle"}
      </StyledMenuItem>
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          handlePin();
        }}
      >
        <PushPin /> &nbsp;{" "}
        {user.tasks.find((task) => task.id === selectedTaskId)?.pinned ? "Sabitleme" : "Sabitli"}
      </StyledMenuItem>
      <StyledMenuItem onClick={redirectToTaskDetails}>
        <Launch /> &nbsp; Görev detayları
      </StyledMenuItem>
      {user.settings[0].enableReadAloud && (
        <StyledMenuItem
          onClick={handleReadAloud}
          disabled={window.speechSynthesis.speaking || window.speechSynthesis.pending}
        >
          <RecordVoiceOver /> &nbsp; Sesli Okuma
        </StyledMenuItem>
      )}

      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          // const shareableLink = generateShareableLink(selectedTaskId, user.name || "User");
          setShowShareDialog(true);
        }}
      >
        <Link /> &nbsp; Paylaş
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem
        onClick={() => {
          handleCloseMoreMenu();
          setEditModalOpen(true);
        }}
      >
        <Edit /> &nbsp; Düzenle
      </StyledMenuItem>
      <StyledMenuItem onClick={handleDuplicateTask}>
        <ContentCopy /> &nbsp; Kopyala
      </StyledMenuItem>
      <Divider />
      <StyledMenuItem
        clr={ColorPalette.red}
        onClick={() => {
          handleCloseMoreMenu();
          handleDeleteTask();
        }}
      >
        <Delete /> &nbsp; Sil
      </StyledMenuItem>
    </div>
  );
  const isMobile = useResponsiveDisplay();
  return (
    <>
      {isMobile ? (
        <BottomSheet
          open={Boolean(anchorEl)}
          onDismiss={handleCloseMoreMenu}
          snapPoints={({ minHeight, maxHeight }) => [minHeight, maxHeight]}
          expandOnContentDrag
          header={
            <SheetHeader>
              <Emoji
                emojiStyle={user.emojisStyle}
                size={32}
                unified={user.tasks.find((task) => task.id === selectedTaskId)?.emoji || ""}
              />{" "}
              {user.emojisStyle === EmojiStyle.NATIVE && "\u00A0 "}
              {user.tasks.find((task) => task.id === selectedTaskId)?.name}
            </SheetHeader>
          }
        >
          <SheetContent>{menuItems}</SheetContent>
        </BottomSheet>
      ) : (
        <Menu
          id="task-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMoreMenu}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "18px",
              minWidth: "200px",
              boxShadow: "none",
              padding: "6px 4px",
            },
          }}
          MenuListProps={{
            "aria-labelledby": "more-button",
          }}
        >
          {menuItems}
        </Menu>
      )}
      <Dialog
        open={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        PaperProps={{
          style: {
            borderRadius: "28px",
            padding: "10px",
            width: "100% !important",
          },
        }}
      >
        <DialogTitle>Görevi Paylaş</DialogTitle>
        <DialogContent>
          <span>
            Görevi Paylaş <b>{user.tasks.find((task) => task.id === selectedTaskId)?.name}</b>
          </span>
          <ShareField
            value={generateShareableLink(selectedTaskId, user.name || "Kullanıcı")}
            fullWidth
            variant="outlined"
            label="Paylaşılabilir Bağlantı"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => {
                      handleCopyToClipboard();
                    }}
                    sx={{ padding: "8px 12px", borderRadius: "12px" }}
                  >
                    <ContentCopy /> &nbsp; Kopyala
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{
              mt: 3,
            }}
          />
        </DialogContent>
        <DialogActions>
          <DialogBtn onClick={() => setShowShareDialog(false)}>Kapat</DialogBtn>
          <DialogBtn onClick={handleShare}>
            <IosShare sx={{ mb: "4px" }} /> &nbsp; Paylaş
          </DialogBtn>
        </DialogActions>
      </Dialog>
    </>
  );
};

const SheetHeader = styled.h3`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  color: ${ColorPalette.fontDark};
  margin: 10px;
  font-size: 20px;
`;

const SheetContent = styled.div`
  color: ${ColorPalette.fontDark};
  margin: 20px 10px;
  & .MuiMenuItem-root {
    font-size: 16px;
    padding: 16px;
    &::before {
      content: "";
      display: inline-block;
      margin-right: 10px;
    }
  }
`;
const StyledMenuItem = styled(MenuItem)<{ clr?: string }>`
  margin: 0 6px;
  padding: 12px;
  border-radius: 12px;
  box-shadow: none;
  color: ${({ clr }) => clr || ColorPalette.fontDark};

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ShareField = styled(TextField)`
  margin-top: 22px;
  .MuiOutlinedInput-root {
    border-radius: 14px;
    transition: 0.3s all;
  }
`;
