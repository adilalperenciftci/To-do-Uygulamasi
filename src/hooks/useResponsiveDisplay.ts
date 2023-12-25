import { useEffect, useState } from "react";
/**
 * Ekran genişliğine bağlı olarak mevcut cihazın daha küçük bir cihaz olup olmadığını belirlemek için özel bir React hook'u.
 * @param {number} [breakpoint=768] - Bir cihazın "daha küçük" olarak kabul edildiği piksel cinsinden kesme noktası.
 * @returns {boolean} - Mevcut cihazın daha küçük bir cihaz olup olmadığını belirten bir boolean değeri.
 */
export const useResponsiveDisplay = (breakpoint: number = 768): boolean => {
  const [isSmallerDevice, setIsSmallerDevice] = useState<boolean>(false);
  const checkScreenSize = () => {
    setIsSmallerDevice(window.innerWidth < breakpoint);
  };
  useEffect(() => {
    checkScreenSize();
    const handleResize = () => checkScreenSize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  return isSmallerDevice;
};
