/**
 * Verilen bir tarih ile şu anki tarih arasındaki farkı hesaplar.
 * @param {Date} date - Hedef tarih.
 * @returns {string} - Tarih farkını gösteren bir dize.
 */
export const calculateDateDifference = (date: Date): string => {
  const suAnkiTarih = new Date();
  const suAnkiGun = suAnkiTarih.getDate();
  const hedefGun = date.getDate();
  const fark = date.getTime() - suAnkiTarih.getTime();
  const farkGunler = Math.floor(fark / (1000 * 60 * 60 * 24)) + 1;

  if (date < suAnkiTarih) {
    return "Görev zamanında tamamlanmadı";
  } else if (hedefGun === suAnkiGun) {
    return "Bugün";
  } else if (hedefGun === suAnkiGun + 1) {
    return "Yarın";
  } else if (farkGunler <= 7) {
    const haftaninGunAdi = date.toLocaleString(navigator.language, {
      weekday: "long",
    });
    return `${haftaninGunAdi} günü (${farkGunler} gün${
      farkGunler !== 1 ? "ler" : ""
    })`;
  } else {
    return `${farkGunler} gün sonra`;
  }
};
