import { useState, useEffect, Dispatch, SetStateAction, CSSProperties } from "react";
import styled from "@emotion/styled";
import { Avatar, Badge, Button, Tooltip } from "@mui/material";
import { AddReaction, Edit, RemoveCircleOutline } from "@mui/icons-material";
import EmojiPicker, { Emoji, EmojiClickData, EmojiStyle, SuggestionMode } from "emoji-picker-react";
import { getFontColorFromHex } from "../utils";
import { ColorPalette } from "../styles";
import { User } from "../types/user";

interface EmojiPickerProps {
  emoji?: string;
  setEmoji: Dispatch<SetStateAction<string | undefined>>;
  user: User;
  color?: string;
  width?: CSSProperties["width"];
}

export const CustomEmojiPicker = ({ emoji, setEmoji, user, color, width }: EmojiPickerProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [currentEmoji, setCurrentEmoji] = useState<string | undefined>(emoji || undefined);

  // Mevcut emoji state'i değiştiğinde, üst bileşenin emoji state'ini güncelle
  useEffect(() => {
    setEmoji(currentEmoji);
  }, [currentEmoji]);

  // Emoji prop'u boş bir stringe değiştiğinde, currentEmoji state'ini undefined olarak ayarla
  useEffect(() => {
    if (emoji === "") {
      setCurrentEmoji(undefined);
    }
  }, [emoji]);

  // EmojiPicker'ın görünürlüğünü değiştiren fonksiyon
  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prevState) => !prevState);
  };

  // EmojiPicker'da bir emoji tıklandığında çalışan handler fonksiyonu
  const handleEmojiClick = (e: EmojiClickData) => {
    toggleEmojiPicker();
    setCurrentEmoji(e.unified);
    console.log(e);
  };

  const handleRemoveEmoji = () => {
    toggleEmojiPicker();
    setCurrentEmoji(undefined);
  };

  // Avatar içeriğini, seçili bir emoji varsa veya yoksa göre render etme fonksiyonu
  const renderAvatarContent = () => {
    if (currentEmoji) {
      const emojiSize = user.emojisStyle === EmojiStyle.NATIVE ? 48 : 64;
      return (
        <div>
          <Emoji size={emojiSize} emojiStyle={user.emojisStyle} unified={currentEmoji} />
        </div>
      );
    } else {
      const fontColor = color ? getFontColorFromHex(color) : ColorPalette.fontLight;
      return (
        <AddReaction
          sx={{
            fontSize: "52px",
            color: fontColor,
            transition: ".3s all",
          }}
        />
      );
    }
  };

  return (
    <>
      <EmojiKonteyner>
        <Tooltip
          title={
            showEmojiPicker
              ? "Emoji Seçiciyi Kapat"
              : currentEmoji
              ? "Emoji Değiştir"
              : "Bir Emoji Seç"
          }
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            badgeContent={
              <Avatar
                sx={{
                  background: "#9c9c9c81",
                  backdropFilter: "blur(6px)",
                  cursor: "pointer",
                }}
                onClick={toggleEmojiPicker}
              >
                <Edit />
              </Avatar>
            }
          >
            <Avatar
              onClick={toggleEmojiPicker}
              sx={{
                width: "96px",
                height: "96px",
                background: color || ColorPalette.purple,
                transition: ".3s all",
                cursor: "pointer",
              }}
            >
              {renderAvatarContent()}
            </Avatar>
          </Badge>
        </Tooltip>
      </EmojiKonteyner>
      {showEmojiPicker && (
        <>
          <EmojiPickerKonteyner>
            <EmojiPicker
              width={width || "350px"}
              height="500px"
              emojiStyle={user.emojisStyle}
              suggestedEmojisMode={SuggestionMode.RECENT}
              autoFocusSearch={false}
              lazyLoadEmojis
              onEmojiClick={handleEmojiClick}
              searchPlaceHolder="Emoji Ara"
              previewConfig={{
                defaultEmoji: "1f4dd",
                defaultCaption: "Göreviniz için mükemmel emojiyi seçin",
              }}
            />
          </EmojiPickerKonteyner>
          {currentEmoji && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveEmoji}
                sx={{ p: "8px 20px", borderRadius: "14px" }}
              >
                <RemoveCircleOutline /> &nbsp; Emojiyi Kaldır
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

const EmojiKonteyner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 14px;
`;

const EmojiPickerKonteyner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px;
`;
