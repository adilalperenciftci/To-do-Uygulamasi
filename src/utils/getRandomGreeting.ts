/**
 * Returns a random greeting message to inspire productivity.
 * @returns {string} A random greeting message with optional emoji code.
 */
export const getRandomGreeting = (): string => {
  const hoursLeft = 24 - new Date().getHours();

  const greetingsText: string[] = [
    "Bugünü değerlendirelim! **1f680**",
    "İşleri halledin ve günü fethedin!",
    "Üretkenliğin gücünü kucaklayın!",
    "Hedeflerinizi belirleyin, onları ezin, tekrarlayın.",
    "Bugün üretken olmanız için yeni bir fırsat!",
    "Her anı değerlendirin.",
    "Düzenli olun, önde olun.",
    "Gününüzün sorumluluğunu alın!",
    "Her seferinde bir görev, bunu başarabilirsin!",
    "Üretkenlik başarının anahtarıdır. **1f511**",
    "Planları başarıya dönüştürelim!",
    "Küçük başla, büyük başar.",
    "Verimli olun, üretken olun.",
    "Üretkenliğin gücünden yararlanın!",
    "Bir şeyleri gerçekleştirmeye hazır olun!",
    "Bu görevleri kontrol etme zamanı! **2705**",
    "Güne bir planla başlayın! **1f5d3-fe0f**",
    "Odaklanın, üretken kalın.",
    "Üretkenlik potansiyelinizi ortaya çıkarın. **1f513**",
    "Yapılacaklar listenizi yapılacaklar listesine dönüştürün! **1f4dd**",

    `İyi eğlenceler  ${new Date().toLocaleDateString("en", {
      weekday: "long",
    })}!`,
    `Happy ${new Date().toLocaleDateString("en", {
      month: "long",
    })}! Verimlilik için harika bir ay!`,
    hoursLeft > 4
      ? `${hoursLeft} Gün içinde saatler kaldı. Onları akıllıca kullanın!`
      : `Gün içinde yalnızca ${hoursLeft} saat kaldı`,
  ];

  const randomIndex = Math.floor(Math.random() * greetingsText.length);
  return greetingsText[randomIndex];
};
