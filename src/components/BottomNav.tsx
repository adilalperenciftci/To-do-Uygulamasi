import { Add, Category, GetApp, Person, TaskAlt } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box, css, styled } from "@mui/material";
import { ColorPalette, pulseAnimation, slideInBottom } from "../styles";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResponsiveDisplay } from "../hooks/useResponsiveDisplay";
import { User } from "../types/user";

interface BottomNavProps {
  user: User;
}

/**
 * Alt navigasyon çubuğunu render etmek için komponent.
 */
export const BottomNav = ({ user }: BottomNavProps): JSX.Element | null => {
  const isMobile = useResponsiveDisplay();
  const location = useLocation();
  const [value, setValue] = useState<number | undefined>();
  const navigate = useNavigate();

  const smallIconSize = "29px";

  // Aktif butonu mevcut rota bazında ayarlamak için useEffect hook'u
  useEffect(() => {
    const pathParts = location.pathname.split("/"); // Yolu '/' ile böl
    if (pathParts[1] === "task") {
      setValue(0); // Kullanıcı görev sayfasındaysa değeri 0 olarak ayarla
    } else {
      // Diğer rotaları önceki gibi ele al
      switch (location.pathname) {
        case "/categories":
          setValue(1);
          break;
        case "/add":
          setValue(2);
          break;
        case "/import-export":
          setValue(3);
          break;
        case "/user":
          setValue(4);
          break;
        case "/":
          setValue(0);
          break;
        default:
          setValue(undefined); // Tanımlanmamış rota için yedek plan
      }
    }
  }, [location.pathname]);

  // Mobil cihaz değilse, navigasyon çubuğunu render etme.
  if (!isMobile) {
    return null;
  }

  return (
    <Kapsayici>
      <StilBottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setValue(newValue);
          event.preventDefault();
        }}
      >
        <NavigasyonButonu
          onClick={() => navigate("/")}
          label="Görevler"
          icon={<TaskAlt sx={{ fontSize: smallIconSize }} />}
        />
        <NavigasyonButonu
          onClick={() => navigate("/categories")}
          label="Kategoriler"
          icon={<Category sx={{ fontSize: smallIconSize }} />}
          disabled={!user.settings[0].enableCategories}
        />
        <NavigasyonButonu
          onClick={() => navigate("add")}
          showLabel={false}
          aria-label="Ekle"
          icon={
            <EkleIconu
              fontSize="large"
              animate={user.tasks.length === 0 && value !== 2 ? true : undefined}
            />
          }
        />
        <NavigasyonButonu
          onClick={() => navigate("import-export")}
          label="İçe/Dışa Aktar"
          icon={<GetApp sx={{ fontSize: smallIconSize }} />}
        />
        <NavigasyonButonu
          onClick={() => navigate("user")}
          label="Profil"
          icon={<Person sx={{ fontSize: smallIconSize }} />}
        />
      </StilBottomNavigation>
    </Kapsayici>
  );
};

const EkleIconu = styled(Add)<{ animate?: boolean }>`
  border: 2px solid ${ColorPalette.purple};
  background-color: #232e58;
  font-size: 38px;
  border-radius: 100px;
  padding: 6px;
  margin: 14px;
  ${({ animate }) =>
    animate &&
    css`
      animation: ${pulseAnimation} 1.2s infinite;
    `}
`;

const Kapsayici = styled(Box)`
  position: fixed;
  bottom: 0;
  width: 100%;
  margin: 0;
  animation: ${slideInBottom} 0.5s ease;
  z-index: 999; /*9999*/
`;

const StilBottomNavigation = styled(BottomNavigation)`
  border-radius: 24px 24px 0 0;
  background: #232e58e1;
  backdrop-filter: blur(18px);
  margin: 0px 20px 0px -20px;
  padding: 18px 10px 32px 10px;
`;

const NavigasyonButonu = styled(BottomNavigationAction)`
  border-radius: 18px;
  margin: 4px;
  color: white;

  &:disabled {
    opacity: 0.6;
    & .MuiBottomNavigationAction-label {
      text-shadow: none;
    }
  }
  & .MuiBottomNavigationAction-label {
    font-size: 13px;
    text-shadow: 0 0 12px #000000ce;
  }
  & .Mui-selected {
    /* text-shadow: 0 0 5px ${ColorPalette.purple}; */
  }
`;
