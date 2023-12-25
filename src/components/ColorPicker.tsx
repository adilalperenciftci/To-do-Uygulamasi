import { CSSProperties, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Casino, Colorize, Done } from "@mui/icons-material";
import { getFontColorFromHex } from "../utils";
import { Grid, Tooltip } from "@mui/material";

interface ColorPickerProps {
  color: string;
  onColorChange: (newColor: string) => void;
  width?: CSSProperties["width"];
}

/**
 * Renk seçimi yapmak için özel Color Picker komponenti.
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onColorChange, width }) => {
  const [selectedColor, setSelectedColor] = useState<string>(color);

  const isHexColor = (value: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(value);

  // Önceden tanımlanmış renk seçenekleri
  const colors: string[] = [
    "#FF5733", // Kırmızı tonu
    "#33FF57", // Yeşil tonu
    "#3357FF", // Mavi tonu
    "#FF33F6", // Pembe tonu
    "#33FFF6", // Turkuaz tonu
    "#F633FF", // Mor tonu
    "#FFC733", // Sarı tonu
    "#33FFC7", // Açık yeşil tonu
    "#C733FF", // Lila tonu
    "#FF5733", // Turuncu tonu
    "#57FF33", // Açık yeşil tonu
    "#5733FF", // Koyu mavi tonu
  ];

  useEffect(() => {
    // Renk prop'u değiştiğinde seçili rengi güncelle
    setSelectedColor(color);
  }, [color]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    handleColorChange(e.target.value as string);

  // Rastgele bir renk seç
  const handleRandomColor = () => {
    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    randomColor = "#" + ("000000" + randomColor).slice(-6);
    handleColorChange(randomColor);
  };

  // Geçerli rengin geçerli bir hex renk olup olmadığını kontrol et ve değilse güncelle
  useEffect(() => {
    if (!isHexColor(color)) {
      console.log(`Geçersiz hex renk: ${color}`);
      handleColorChange("#FF5733"); // Varsayılan renk olarak kırmızı tonunu ayarla
    }
  }, [color]);

  return (
    <div>
      <Grid
        maxWidth={width || 400}
        sx={{
          marginTop: "16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: selectedColor,
          color: getFontColorFromHex(selectedColor),
          padding: "8px",
          borderRadius: "100px",
          transition: ".3s all",
          border: "2px solid #ffffffab",
        }}
      >
        {selectedColor.toUpperCase()}
      </Grid>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: width || 400,
        }}
      >
        <Grid container spacing={1} maxWidth={width || 400} m={1}>
          {colors.map((color) => (
            <Grid item key={color}>
              <RenkElementi
                clr={color}
                aria-label={`Renk seç - ${color}`}
                onClick={() => {
                  handleColorChange(color);
                }}
              >
                {color === selectedColor && <Done />}
              </RenkElementi>
            </Grid>
          ))}
          <Tooltip title="Özel renk ayarla">
            <Grid item>
              <RenkSeciciKapsayici>
                <RenkElementi clr={selectedColor}>
                  <StilRenkSecici
                    type="color"
                    value={selectedColor}
                    onChange={handlePickerChange}
                  />
                  <RenkAyarlaIconu clr={selectedColor} />
                </RenkElementi>
              </RenkSeciciKapsayici>
            </Grid>
          </Tooltip>
          <Tooltip title="Rastgele renk">
            <Grid item>
              <RenkElementi clr="#1a81ff" onClick={handleRandomColor}>
                <Casino />
              </RenkElementi>
            </Grid>
          </Tooltip>
        </Grid>
      </div>
    </div>
  );
};

// Renk seçimi için stilize edilmiş buton
const RenkElementi = styled.button<{ clr: string }>`
  background-color: ${({ clr }) => clr};
  color: ${({ clr }) => getFontColorFromHex(clr)};
  border: none;
  cursor: pointer;
  width: 48px;
  height: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  transition: 0.2s all;
  transform: scale(1);

  &:focus-visible {
    outline: 4px solid #FF5733; // Kırmızı tonu
  }
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 12px ${({ clr }) => clr};
  }
`;

const RenkSeciciKapsayici = styled.div`
  display: flex;
  align-items: center;
`;

const StilRenkSecici = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 54px;
  width: 54px;
  display: flex;

  background-color: transparent;
  border: none;
  cursor: pointer;

  &::-webkit-color-swatch {
    border-radius: 18px;
    border: none;
  }
  &::-moz-color-swatch {
    border-radius: 18px;
    border: none;
  }
`;

const RenkAyarlaIconu = styled(Colorize)<{ clr: string }>`
  color: ${({ clr }) => getFontColorFromHex(clr)};
  position: absolute;
  cursor: pointer;
  pointer-events: none;
`;
