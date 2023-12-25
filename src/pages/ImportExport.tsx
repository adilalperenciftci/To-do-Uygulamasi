import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import { TopBar } from "../components";
import { Task, UserProps } from "../types/user";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
import { Emoji } from "emoji-picker-react";
import { FileDownload, FileUpload, Info } from "@mui/icons-material";
import { exportTasksToJson } from "../utils";
import { IconButton, Tooltip } from "@mui/material";
import {
  CATEGORY_NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  TASK_NAME_MAX_LENGTH,
} from "../constants";
import toast from "react-hot-toast";
import { ColorPalette } from "../styles";

export const ImportExport = ({ user, setUser }: UserProps) => {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]); // Array of selected task IDs
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTaskClick = (taskId: number) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

    const handleDrop = (event: React.DragEvent) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      handleImport(file);
      console.log(file);
    };
    const handleExport = () => {
      const tasksToExport = user.tasks.filter((task: Task) => selectedTasks.includes(task.id));
      exportTasksToJson(tasksToExport);
      toast(
        (t) => (
          <div>
            İhraç edilen görevler:{" "}
            <ul>
              {tasksToExport.map((task) => (
                <li key={task.id}>
                  <ListContent>
                    <Emoji unified={task.emoji || ""} size={20} emojiStyle={user.emojisStyle} />
                    <span>{task.name}</span>
                  </ListContent>
                </li>
              ))}
            </ul>
            <Button
              variant="outlined"
              sx={{ width: "100%", p: "12px 24px", borderRadius: "16px", fontSize: "16px" }}
              onClick={() => toast.dismiss(t.id)}
            >
              Kapat
            </Button>
          </div>
        )
        // { icon: <FileDownload /> }
      );
    };

    const handleExportAll = () => {
      exportTasksToJson(user.tasks);
      toast.success(`Tüm görevler dışa aktarıldı (${user.tasks.length})`);
    };

    const handleImport = (taskFile: File) => {
      const file = taskFile;

      if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const importedTasks = JSON.parse(e.target?.result as string) as Task[];

            if (!Array.isArray(importedTasks)) {
              toast.error("İçe aktarılan dosyanın geçersiz bir yapıya sahip olduğu.");
              return;
            }
            // İçe aktarılan görev özelliğinin maksimum uzunluğunu aşıp aşmadığını kontrol edin

            const invalidTasks = importedTasks.filter((task) => {
              const isInvalid =
                (task.name && task.name.length > TASK_NAME_MAX_LENGTH) ||
                (task.description && task.description.length > DESCRIPTION_MAX_LENGTH) ||
                (task.category &&
                  task.category.some((cat) => cat.name.length > CATEGORY_NAME_MAX_LENGTH));

              return isInvalid;
            });

            if (invalidTasks.length > 0) {
              const invalidTaskNames = invalidTasks.map((task) => task.name).join(", ");
              console.error(
                `Bu görevler, maksimum karakter uzunluklarını aştığı için içe aktarılamaz: ${invalidTaskNames}`
              );
              toast.error(`Bazı görevler, maksimum karakter uzunluklarını aştığı için içe aktarılamaz`);
              return;
            }

            // İçe aktarılan kategoriler mevcut değilse user.categories güncelleştirin
            const updatedCategories = user.categories.slice(); // Mevcut kategorilerin bir kopyasını oluşturun

            importedTasks.forEach((task) => {
              task.category !== undefined &&
                task.category.forEach((importedCat) => {
                  const existingCategory = updatedCategories.find((cat) => cat.id === importedCat.id);

                  if (!existingCategory) {
                    updatedCategories.push(importedCat);
                  } else {
                    // ID eşleşiyorsa mevcut kategoriyi içe aktarılanla değiştirin
                    Object.assign(existingCategory, importedCat);
                  }
                });
            });

            setUser((prevUser) => ({
              ...prevUser,
              categories: updatedCategories,
            }));
            // İçe aktarılan görevleri önceki gibi birleştirme işlemine devam edin
            const mergedTasks = [...user.tasks, ...importedTasks];

            // Görev kimliklerine göre yinelenenleri kaldırın (varsa)
            // const uniqueTasks = Array.from(new Set(mergedTasks.map((task) => task.id)))
            //   .map((id) => mergedTasks.find((task) => task.id === id))
            //   .filter(Boolean) as Task[]; // Herhangi bir 'tanımsız' değeri kaldırın

            const uniqueTasks = mergedTasks.reduce((acc, task) => {
              const existingTask = acc.find((t) => t.id === task.id);
              if (existingTask) {
                return acc.map((t) => (t.id === task.id ? task : t));
              } else {
                return [...acc, task];
              }
            }, [] as Task[]);

            setUser((prevUser) => ({ ...prevUser, tasks: uniqueTasks }));

            // İçe aktarılan görev adlarının listesini hazırlayın
            const importedTaskNames = importedTasks.map((task) => task.name).join(", ");

            // İçe aktarılan görev adlarının listesiyle birlikte uyarıyı görüntüleyin
            console.log(`İçe Aktarılan Görevler: ${importedTaskNames}`);
            toast((t) => (
              <div>
                Görevler Başarıyla İçe Aktarıldı <br />
                <i style={{ wordBreak: "break-all" }}>{file.name}</i>
                <ul>
                  {importedTasks.map((task) => (
                    <li key={task.id}>
                      <ListContent>
                        <Emoji unified={task.emoji || ""} size={20} emojiStyle={user.emojisStyle} />
                        <span>{task.name}</span>
                      </ListContent>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outlined"
                  sx={{ width: "100%", p: "12px 24px", borderRadius: "16px", fontSize: "16px" }}
                  onClick={() => toast.dismiss(t.id)}
                >
                  Kapat
                </Button>
              </div>
            ));
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          } catch (error) {
            console.error(`İçe aktarılan dosyanın ayrıştırılması sırasında hata oluştu ${file.name}:`, error);
            // toast.error(`Error parsing the imported file -  ${file.name}`);
            toast.error(
              <div style={{ wordBreak: "break-all" }}>
                İçe aktarılan dosyanın ayrıştırılması sırasında hata oluştu: <br /> <i>{file.name}</i>
              </div>
            );
          }
        };

        reader.readAsText(file);
      }
    };

    // Çıkış yapma işleminden sonra dosya girişini temizleyin
    useEffect(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, [user.createdAt]);

    return (
      <>
        <TopBar title="İçe Aktar/İhraç Et" />
        <h2
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          İhraç etmek için görevleri seçin&nbsp;
          <Tooltip title="İçe aktarma sırasında yinelenenler kaldırılacaktır">
            <IconButton style={{ color: "#ffffff" }}>
              <Info />
            </IconButton>
          </Tooltip>
        </h2>

        <Container>
          {user.tasks.length > 0 ? (
            user.tasks.map((task: Task) => (
              <TaskContainer
                key={task.id}
                backgroundclr={task.color}
                onClick={() => handleTaskClick(task.id)}
                selected={selectedTasks.includes(task.id)}
              >
                <Checkbox size="medium" checked={selectedTasks.includes(task.id)} />
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Emoji size={24} unified={task.emoji || ""} emojiStyle={user.emojisStyle} />{" "}
                  {task.name}
                </Typography>
              </TaskContainer>
            ))
          ) : (
            <h3 style={{ opacity: 0.8, fontStyle: "italic" }}>Dışa aktarılacak göreviniz yok</h3>
          )}
        </Container>

        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <StyledButton
            onClick={handleExport}
            disabled={selectedTasks.length === 0}
            variant="outlined"
          >
            <FileDownload /> &nbsp; JSON Olarak Seçilenleri İhraç Et{" "}
            {selectedTasks.length > 0 && `[${selectedTasks.length}]`}
          </StyledButton>

          <StyledButton
            onClick={handleExportAll}
            disabled={user.tasks.length === 0}
            variant="outlined"
          >
            <FileDownload /> &nbsp; Tüm Görevleri JSON Olarak İhraç Et
          </StyledButton>

          <h2 style={{ textAlign: "center" }}>JSON'dan Görevleri İçe Aktar</h2>

          {/Windows|Linux|Macintosh/i.test(navigator.userAgent) && (
            <div style={{ width: "300px" }}>
              <DropZone onDragOver={handleDragOver} onDrop={handleDrop}>
                <FileUpload fontSize="large" color="primary" />
                <p style={{ fontWeight: 500, fontSize: "16px", margin: 0 }}>
                  İçe aktarmak için JSON dosyasını buraya bırakın{" "}
                </p>
              </DropZone>
            </div>
          )}

          <input
            accept=".json"
            id="import-file"
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files && e.target.files[0];
              file && handleImport(file);
            }}
          />
          <label htmlFor="import-file">
            <Button
              component="span"
              variant="outlined"
              sx={{
                padding: "12px 18px",
                borderRadius: "14px",
                width: "300px",
              }}
            >
              <FileUpload /> &nbsp; JSON Dosyası Seç
            </Button>
          </label>
        </Box>
      </>
    );
  };

  const TaskContainer = styled(Box)<{ backgroundclr: string; selected: boolean }>`
    display: flex;
    align-items: center;
    justify-content: left;
    margin: 8px;
    padding: 10px 4px;
    border-radius: 16px;
    background: #19172b94;
    border: 2px solid ${(props) => props.backgroundclr};
    box-shadow: ${(props) => props.selected && `0 0 8px 1px ${props.backgroundclr}`};
    transition: 0.3s all;
    width: 300px;
    cursor: "pointer";
  `;

  const ListContent = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 6px;
  `;

  const DropZone = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 6px;
    border: 2px dashed ${ColorPalette.purple};
    border-radius: 16px;
    padding: 32px 64px;
    text-align: center;
    max-width: 300px;
  `;

  const Container = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
    max-height: 350px;

    overflow-y: auto;

    /* Özel Kaydırma Çubuğu Stilleri */
    ::-webkit-scrollbar {
      width: 8px;
      border-radius: 4px;
      background-color: #ffffff15;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #ffffff30;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #ffffff50;
    }

    ::-webkit-scrollbar-track {
      border-radius: 4px;
      background-color: #ffffff15;
    }
  `;

  const StyledButton = styled(Button)`
    padding: 12px 18px;
    border-radius: 14px;
    width: 300px;

    &:disabled {
      color: #ffffff58;
      border-color: #ffffff58;
    }
  `;
