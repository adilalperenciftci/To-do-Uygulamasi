import { EmojiStyle } from "emoji-picker-react";

/**
 * Uygulamadaki bir kullanıcıyı temsil eder.
 */
export interface User {
  name: string | null;
  createdAt: Date;
  profilePicture: string | URL | null;
  emojisStyle: EmojiStyle;
  tasks: Task[];
  categories: Category[];
  // colors: string[];
  settings: AppSettings[];
}

/**
 * Uygulamadaki bir görevi temsil eder.
 */
export interface Task {
  id: number;
  done: boolean;
  pinned: boolean;
  name: string;
  description?: string;
  emoji?: string;
  color: string;
  date: Date;
  deadline?: Date;
  category?: Category[];
  lastSave?: Date;
  sharedBy?: string;
}

// export type Emoji = Omit<
//   EmojiClickData,
//   "activeSkinTone" | "names" | "unifiedWithoutSkinTone" | "getImageUrl"
// > & {
//   name: string;
// };

// export type Emoji = Pick<EmojiClickData, "unified" | "emoji" | "names">;

/**
 * Uygulamadaki bir kategoriyi temsil eder.
 */
export interface Category {
  id: number;
  name: string;
  emoji?: string;
  color: string;
}

/**
 * Kullanıcı için uygulama ayarlarını temsil eder.
 */
export interface AppSettings {
  enableCategories: boolean;
  doneToBottom: boolean;
  enableGlow: boolean;
  enableReadAloud: boolean;
  voice: string;
  voiceVolume: number;
}

/**
 * Kullanıcıyla ilgili veri gerektiren bir bileşen için props'ları temsil eder.
 */
export interface UserProps {
  user: User; // Kullanıcı verileri
  setUser: React.Dispatch<React.SetStateAction<User>>; // Kullanıcı verilerini güncellemek için fonksiyon
}
