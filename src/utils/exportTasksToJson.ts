import { Task } from "../types/user";

/**
 * Bir görev dizisini JSON dosyasına dönüştürüp indirmeyi başlatır.
 * @param {Task[]} selectedTasks - Dışa aktarılacak görev dizisi.
 */
export const exportTasksToJson = (selectedTasks: Task[]): void => {
  // Dosya adı için mevcut tarih ve saati al
  const timestamp = new Date().toLocaleString().replace(/[/:, ]/g, "_");
  const filename = `Görevler_${timestamp}.json`;

  // JSON verisini oluştur
  const dataStr = JSON.stringify(selectedTasks, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });

  // Blob için bir URL oluştur
  const url = window.URL.createObjectURL(blob);

  // Bir bağlantı elemanı oluştur ve indirmeyi başlat
  const linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.download = filename;
  linkElement.click();
  console.log(`Görevler ${filename} dosyasına dışa aktarıldı`);
  // URL nesnesini temizle
  window.URL.revokeObjectURL(url);
};
