export const formatDate = (date: Date): string => {
  const bugun = new Date();
  const dun = new Date(bugun);
  dun.setDate(bugun.getDate() - 1);
  const birGun = 24 * 60 * 60 * 1000; // Bir günün milisaniye cinsinden değeri
  const birHafta = 7 * birGun; // Bir haftanın milisaniye cinsinden değeri

  if (ayniGunMu(date, bugun)) {
    return `Bugün saat ${saatiFormatla(date)}`;
  } else if (ayniGunMu(date, dun)) {
    return `Dün saat ${saatiFormatla(date)}`;
  } else if (date.getTime() > bugun.getTime() - birHafta) {
    return `${haftaninGunu(date)} ${saatiFormatla(date)}`;
  } else {
    return sadeceTarihiFormatla(date);
  }
};

const ayniGunMu = (tarih1: Date, tarih2: Date): boolean => {
  return (
    tarih1.getFullYear() === tarih2.getFullYear() &&
    tarih1.getMonth() === tarih2.getMonth() &&
    tarih1.getDate() === tarih2.getDate()
  );
};

const saatiFormatla = (tarih: Date): string => {
  return tarih.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const sadeceTarihiFormatla = (tarih: Date): string => {
  const secenekler: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return tarih.toLocaleDateString(navigator.language, secenekler);
};

const haftaninGunu = (tarih: Date): string =>
  tarih.toLocaleDateString(navigator.language, { weekday: "long" });
