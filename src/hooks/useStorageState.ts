import { useState, useEffect } from "react";
/**
 * localStorage'da değeri saklayan ve güncellemek için bir fonksiyon döndüren özel bir React hook'u.
 * @param {any} defaultValue - Durumun varsayılan değeri.
 * @param {string} key - Değerin localStorage'da saklanacağı anahtar.
 * @returns {[any, Function]} Mevcut durum değerini ve güncellemek için bir fonksiyonu içeren bir tuple.
 * @example const [count, setCount] = useStorageState(1, "count")
 */
export function useStorageState<T>(
  defaultValue: T,
  key: string
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
