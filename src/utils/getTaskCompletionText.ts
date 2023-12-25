/**
 * Tamamlanma yüzdesine bağlı olarak bir görev tamamlanma mesajı döndürür.
 * @param {number} completionPercentage - Görevlerin tamamlanma yüzdesi.
 * @returns {string} Bir görev tamamlanma mesajı.
 */
export const getTaskCompletionText = (completionPercentage: number): string => {
  switch (true) {
    case completionPercentage === 0:
      return "Henüz hiç görev tamamlanmadı. Devam et!";
    case completionPercentage === 100:
      return "Tebrikler! Tüm görevler tamamlandı!";
    case completionPercentage >= 75:
      return "Neredeyse tamamlandı!";
    case completionPercentage >= 50:
      return "Yarı yoldasınız! Devam edin!";
    case completionPercentage >= 25:
      return "İyi ilerliyorsunuz.";
    default:
      return "Henüz başlamışsınız.";
  }
};
