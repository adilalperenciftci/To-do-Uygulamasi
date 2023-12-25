import { Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { CategoryChip, DialogBtn } from "../styles";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Task, UserProps } from "../types/user";
import toast from "react-hot-toast";
import { getFontColorFromHex } from "../utils";
import { Emoji, EmojiStyle } from "emoji-picker-react";

//FIXME: Her şeyi tip güvenli hale getir
export const SharePage = ({ user, setUser }: UserProps) => {
  const n = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskParam = queryParams.get("task");
  const userNameParam = queryParams.get("userName");

  const [taskData, setTaskData] = useState<Task | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (taskParam) {
      try {
        const decodedTask = decodeURIComponent(taskParam);
        const task = JSON.parse(decodedTask) as Task;
        setTaskData(task);
      } catch (error) {
        console.error("Görev verisi çözümlenirken hata oluştu:", error);
        setError(true);
      }
    }

    if (userNameParam) {
      const decodedUserName = decodeURIComponent(userNameParam);
      setUserName(decodedUserName);
    }
  }, [taskParam, userNameParam]);
  const handleAddTask = () => {
    if (taskData) {
      // Eksik kategorileri user.categories'e ekle
      const updatedCategories = [...user.categories];
      if (taskData.category) {
        taskData.category.forEach((taskCategory) => {
          const existingCategory = updatedCategories.find((cat) => cat.id === taskCategory.id);
          if (!existingCategory) {
            updatedCategories.push(taskCategory);
          }
        });
      }

      setUser((prevUser) => ({
        ...prevUser,
        categories: updatedCategories,
        tasks: [
          ...prevUser.tasks.filter(Boolean),
          {
            ...taskData,
            id: new Date().getTime() + Math.floor(Math.random() * 1000),
            // date: new Date(),
            sharedBy: userName,
          },
        ],
      }));

      n("/");
      toast.success(() => (
        <div>
          Paylaşılan görev eklendi - <b>{taskData.name}</b>
        </div>
      ));
    }
  };

  //TODO: UI'ı tamamla
  return (
    <div>
      <Dialog
        open
        PaperProps={{
          style: {
            borderRadius: "28px",
            padding: "10px",
            width: "100% !important",
          },
        }}
      >
        {!error && taskData ? (
          <>
            <DialogTitle>Alınan Görev</DialogTitle>
            <DialogContent>
              <p>
                <b>{userName}</b> size bir görev paylaştı
              </p>
              <div
                style={{
                  background: taskData.color,
                  color: getFontColorFromHex(taskData.color || ""),
                  padding: "10px 20px",
                  borderRadius: "16px",
                  width: "300px",
                }}
              >
                <h3 style={{ display: "flex", alignItems: "center", gap: "6px", margin: "12px 0" }}>
                  {taskData?.emoji && (
                    <Emoji unified={taskData.emoji} emojiStyle={user.emojisStyle} />
                  )}
                  {taskData.name}
                </h3>
                <p>{taskData.description}</p>
                {taskData.deadline && (
                  <p>
                    Son Tarih: {new Date(taskData.deadline).toLocaleDateString()} {" • "}
                    {new Date(taskData.deadline).toLocaleTimeString()}
                  </p>
                )}

                {taskData.category && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "4px 6px",
                      justifyContent: "left",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    {taskData.category.map((cat) => (
                      <div key={cat.id}>
                        <CategoryChip
                          backgroundclr={cat.color}
                          borderclr={getFontColorFromHex(taskData.color)}
                          glow={user.settings[0].enableGlow}
                          label={cat.name}
                          size="medium"
                          avatar={
                            cat.emoji ? (
                              <Avatar
                                alt={cat.name}
                                sx={{
                                  background: "transparent",
                                  borderRadius: "0px",
                                }}
                              >
                                {cat.emoji &&
                                  (user.emojisStyle === EmojiStyle.NATIVE ? (
                                    <div>
                                      <Emoji
                                        size={18}
                                        unified={cat.emoji}
                                        emojiStyle={EmojiStyle.NATIVE}
                                      />
                                    </div>
                                  ) : (
                                    <Emoji
                                      size={20}
                                      unified={cat.emoji}
                                      emojiStyle={user.emojisStyle}
                                    />
                                  ))}
                              </Avatar>
                            ) : (
                              <></>
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <DialogBtn color="error" onClick={() => n("/")}>
                Reddet
              </DialogBtn>
              <DialogBtn
                onClick={() => {
                  handleAddTask();
                  n("/");
                }}
              >
                Görev Ekle
              </DialogBtn>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>Bir şeyler yanlış gitti</DialogTitle>
            <DialogContent>
              {/* TODO: */}
              <p>Oops! Paylaşılan görev işlenirken bir hata oluştu.</p>
            </DialogContent>
            <DialogActions>
              <DialogBtn onClick={() => n("/")}>Kapat</DialogBtn>
            </DialogActions>
          </>
        )}
      </Dialog>
    </div>
  );
};
