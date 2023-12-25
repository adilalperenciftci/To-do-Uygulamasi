/**
 * Mevcut saat'e göre bir selamlama döndürür.
 * @returns {string} Uygun selamlama.
 */
export const displayGreeting = (): string => {
  const suan = new Date();
  const suankiSaat = suan.getHours();
  let selamlama: string;
  if (suankiSaat < 12 && suankiSaat >= 5) {
    selamlama = "Günaydın";
  } else if (suankiSaat < 18 && suankiSaat > 12) {
    selamlama = "İyi günler";
  } else {
    selamlama = "İyi akşamlar";
  }

  return selamlama;
};
