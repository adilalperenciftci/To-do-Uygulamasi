import { EmojiStyle } from "emoji-picker-react";
import { User } from "../types/user";

/**
 * Varsayılan bir kullanıcı nesnesini temsil eder.
 */
export const defaultUser: User = {
  name: null,
  createdAt: new Date(),
  profilePicture: null,
  emojisStyle: EmojiStyle.APPLE,
  tasks: [],
  settings: [
    {
      enableCategories: true,
      doneToBottom: false,
      enableGlow: true,
      enableReadAloud: true,
      voice: "Google UK English Male",
      voiceVolume: 0.6,
    },
  ],
  categories: [
    { id: 1, name: "Ev", emoji: "1f3e0", color: "#1fff44" },
    { id: 2, name: "İş", emoji: "1f3e2", color: "#248eff" },
    { id: 3, name: "Kişisel", emoji: "1f464", color: "#e843fe" },
    { id: 4, name: "Sağlık/Fitness", emoji: "1f4aa", color: "#ffdf3d" },
    { id: 5, name: "Eğitim", emoji: "1f4da", color: "#ff8e24" },
  ],
};
