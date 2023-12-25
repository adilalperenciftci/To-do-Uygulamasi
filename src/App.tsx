import { useStorageState } from "./hooks/useStorageState";
import { defaultUser } from "./constants/defaultUser";
import { User } from "./types/user";
import { ColorPalette, GlobalStyles, MuiTheme } from "./styles";
import { ThemeProvider } from "@mui/material";
import { useEffect } from "react";
import { ErrorBoundary } from "./components";
import { MainLayout } from "./layouts/MainLayout";
import { AppRouter } from "./router";
import { Toaster } from "react-hot-toast";
import { useResponsiveDisplay } from "./hooks/useResponsiveDisplay";

function App() {
  const [user, setUser] = useStorageState<User>(defaultUser, "user");
  const isMobile = useResponsiveDisplay();

  // Kullanıcı özelliklerini varsayılan değerlerle başlat
  useEffect(() => {
    const updateNestedProperties = (userObject: any, defaultObject: any) => {
      if (!userObject) {
        return defaultObject;
      }

      Object.keys(defaultObject).forEach((key) => {
        const userValue = userObject[key];
        const defaultValue = defaultObject[key];

        if (typeof defaultValue === "object" && defaultValue !== null) {
          // Özellik bir nesne ise, iç içe geçmiş özellikleri güncelle
          userObject[key] = updateNestedProperties(userValue, defaultValue);
        } else if (userValue === undefined) {
          // Özellik kullanıcıda eksikse güncelle
          userObject[key] = defaultValue;
        }
      });

      return userObject;
    };

    // Tüm özellikler için kullanıcıyı varsayılan değerlerle güncelle, iç içe geçmiş olanlar da dahil
    setUser((prevUser) => {
      // Kullanıcı değişmediyse güncelleme yapma
      if (
        JSON.stringify(prevUser) !==
        JSON.stringify(updateNestedProperties({ ...prevUser }, defaultUser))
      ) {
        return updateNestedProperties({ ...prevUser }, defaultUser);
      }
      return prevUser;
    });
  }, []);

  const userProps = { user, setUser };

  return (
    <>
      <ThemeProvider theme={MuiTheme}>
        <GlobalStyles />
        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          containerStyle={{
            marginBottom: isMobile ? "96px" : "12px",
          }}
          toastOptions={{
            position: "bottom-center",
            duration: 4000,
            style: {
              padding: "14px 22px",
              borderRadius: "20px",
              fontSize: "17px",
              border: `2px solid ${ColorPalette.purple}`,
              background: "#141431e0",
              WebkitBackdropFilter: "blur(6px)",
              backdropFilter: "blur(6px)",
              color: ColorPalette.fontLight,
            },
            success: {
              iconTheme: {
                primary: ColorPalette.purple,
                secondary: "white",
              },
              style: {},
            },
            error: {
              iconTheme: {
                primary: "#ff3030",
                secondary: "white",
              },
              style: {
                borderColor: "#ff3030",
              },
            },
          }}
        />
        <ErrorBoundary user={user}>
          <MainLayout {...userProps}>
            <AppRouter {...userProps} />
          </MainLayout>
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
}

export default App;
