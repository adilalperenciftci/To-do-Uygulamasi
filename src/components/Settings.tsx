import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import { AppSettings, UserProps } from "../types/user";
import { DialogBtn } from "../styles";
import styled from "@emotion/styled";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { VolumeDown, VolumeOff, VolumeUp, WifiOff } from "@mui/icons-material";
import { defaultUser } from "../constants/defaultUser";

interface SettingsProps extends UserProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsDialog = ({ open, onClose, user, setUser }: SettingsProps) => {
  const [settings, setSettings] = useState<AppSettings>(user.settings[0]);
  const [lastStyle] = useState<EmojiStyle>(user.emojisStyle);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [prevVoiceVol, setPrevVoiceVol] = useState<number>(user.settings[0].voiceVolume);

  const isOnline = useOnlineStatus();

  // Array of available emoji styles with their labels
  const emojiStyles: { label: string; style: EmojiStyle }[] = [
    { label: "Apple", style: EmojiStyle.APPLE },
    { label: "Facebook, Messenger", style: EmojiStyle.FACEBOOK },
    { label: "Twitter, Discord", style: EmojiStyle.TWITTER },
    { label: "Google", style: EmojiStyle.GOOGLE },
    { label: "Native", style: EmojiStyle.NATIVE },
  ];

  const getAvailableVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    const voiceInfoArray = [];

    for (const voice of voices) {
      if (voice.default) {
        console.log(voice);
      }
      voiceInfoArray.push(voice);
    }

    return voiceInfoArray;
  };

  // Ensure the voices are loaded before calling getAvailableVoices
  window.speechSynthesis.onvoiceschanged = () => {
    const availableVoices = getAvailableVoices();
    setAvailableVoices(availableVoices);
    console.log(availableVoices);
  };

  // Handler for updating individual setting options
  const handleSettingChange =
    (name: keyof AppSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
      // cancel read aloud
      name === "enableReadAloud" && window.speechSynthesis.cancel();
      const updatedSettings = {
        ...settings,
        [name]: event.target.checked,
      };
      setSettings(updatedSettings);
      setUser((prevUser) => ({
        ...prevUser,
        settings: [updatedSettings],
      }));
    };

  // Handler for updating the selected emoji style
  const handleEmojiStyleChange = (event: SelectChangeEvent<unknown>) => {
      const selectedEmojiStyle = event.target.value as EmojiStyle;
      setUser((prevUser) => ({
        ...prevUser,
        emojisStyle: selectedEmojiStyle,
      }));
    };
    const handleVoiceChange = (event: SelectChangeEvent<unknown>) => {
      // Seçilen sesi işle
      const selectedVoice = availableVoices.find((voice) => voice.name === event.target.value);

      // Seçilen sesle ilgili mantığı işle (ör. kullanıcı ayarlarını güncelleme)
      if (selectedVoice) {
        console.log("Seçilen Ses:", selectedVoice);

        // Kullanıcı ayarlarını seçilen sesle güncelle
        setUser((prevUser) => ({
          ...prevUser,
          settings: [
            {
              ...prevUser.settings[0],
              voice: selectedVoice.name,
            },
          ],
        }));
      }
    };
    // Ses düzeyindeki değişiklikleri işlemek için fonksiyon
    const handleVoiceVolChange = (e: Event, value: number | number[]) => {
      e.preventDefault();
      // Kullanıcı ayarlarını yeni ses düzeyiyle güncelle
      setUser((prevUser) => ({
        ...prevUser,
        settings: [
          {
            ...prevUser.settings[0],
            voiceVolume: value as number,
          },
        ],
      }));
    };

    // Sessizleştirme/demirleme düğmesi tıklamasını işle
    const handleMuteClick = () => {
      // Kullanıcı ayarlarından mevcut ses düzeyini al
      const vol = user.settings[0].voiceVolume;

      // Sessizleştirmeden önce önceki ses düzeyini kaydet
      setPrevVoiceVol(vol);

      const newVoiceVolume = vol === 0 ? (prevVoiceVol !== 0 ? prevVoiceVol : 1) : 0;

      setUser((prevUser) => ({
        ...prevUser,
        settings: [
          {
            ...prevUser.settings[0],
            voiceVolume: newVoiceVolume,
          },
        ],
      }));
    };
    return (
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          style: {
            borderRadius: "24px",
            padding: "12px",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Ayarlar</DialogTitle>
        <Container>
          {/* Emoji stili seçmek için Select bileşeni */}
          <FormGroup>
            <FormControl>
              <FormLabel>Emoji Ayarları</FormLabel>
              <StyledSelect value={user.emojisStyle} onChange={handleEmojiStyleChange}>
                {/* Çevrimdışı olduğunda stilin değiştirilemeyeceğini belirten devre dışı bir menü öğesi göster */}
                {!isOnline && (
                  <MenuItem
                    disabled
                    style={{
                      opacity: 0.8,
                      display: "flex",
                      gap: "6px",
                      fontWeight: 500,
                    }}
                  >
                    <WifiOff /> Çevrimdışıyken emoji stili değiştirilemez
                  </MenuItem>
                )}

                {emojiStyles.map((style) => (
                  <MenuItem
                    key={style.style}
                    value={style.style}
                    // Çevrimdışıyken veya varsayılan stil veya son seçilen stil olmadığında yerel olmayan stilleri devre dışı bırak
                    // Bu, çevrimdışıyken harici kaynakları (emoji'leri) getirmeyi gerektiren stillerin seçilememesini sağlar,
                    // çünkü bu emoji'ler internet bağlantısı olmadan yüklenmeyebilir.
                    disabled={
                      !isOnline &&
                      style.style !== EmojiStyle.NATIVE &&
                      style.style !== defaultUser.emojisStyle &&
                      style.style !== lastStyle
                    }
                    sx={{
                      padding: "12px 20px",
                      borderRadius: "12px",
                      margin: "8px",
                      display: "flex",
                      gap: "4px",
                    }}
                  >
                    <Emoji size={24} unified="1f60e" emojiStyle={style.style} />
                    &nbsp;
                    {/* Yerel Emoji için Boşluk */}
                    {style.style === EmojiStyle.NATIVE && "\u00A0"}
                    {style.label}
                  </MenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </FormGroup>

          {/* Farklı uygulama ayarlarını kontrol etmek için Anahtar bileşenleri */}
          <FormGroup>
            <FormLabel>Uygulama Ayarları</FormLabel>
            <FormControlLabel
              sx={{ opacity: settings.enableCategories ? 1 : 0.8 }}
              control={
                <Switch
                  checked={settings.enableCategories}
                  onChange={handleSettingChange("enableCategories")}
                />
              }
              label="Kategorileri Etkinleştir"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              sx={{ opacity: settings.enableGlow ? 1 : 0.8 }}
              control={
                <Switch checked={settings.enableGlow} onChange={handleSettingChange("enableGlow")} />
              }
              label="Parlama Efektini Etkinleştir"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              sx={{ opacity: settings.enableReadAloud ? 1 : 0.8 }}
              control={
                <Switch
                  checked={settings.enableReadAloud}
                  onChange={handleSettingChange("enableReadAloud")}
                />
              }
              label="Sesli Okumayı Etkinleştir"
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              sx={{ opacity: settings.doneToBottom ? 1 : 0.8 }}
              control={
                <Switch
                  checked={settings.doneToBottom}
                  onChange={handleSettingChange("doneToBottom")}
                />
              }
              label="Tamamlanan Görevleri Aşağıya Taşı"
            />
          </FormGroup>

          {user.settings[0].enableReadAloud && (
            <FormGroup>
              <FormControl>
                <FormLabel>Ses Ayarları</FormLabel>

                {availableVoices.length !== 0 ? (
                  <StyledSelect
                    // Değerini availableVoices dizisinin ilk sesine ayarla
                    value={user.settings[0].voice}
                    // Ses seçim değişikliğini işle
                    onChange={handleVoiceChange}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 500,
                          padding: "2px 6px",
                        },
                      },
                    }}
                  >
                    {/* MenuItem bileşenlerini oluşturmak için kullanılabilir sesler üzerinde döngü yap */}
                    {availableVoices.map((voice) => (
                      <MenuItem
                        key={voice.name}
                        value={voice.name}
                        sx={{
                          padding: "10px",
                          borderRadius: "6px",
                        }}
                      >
                        {voice.name} &nbsp;
                        {voice.default && <span style={{ fontWeight: 600 }}>Varsayılan</span>}
                      </MenuItem>
                    ))}
                  </StyledSelect>
                ) : (
                  <NoVoiceStyles>
                    Kullanılabilir ses stilleri yok. Sayfayı yenilemeyi deneyin.
                    {/* <Emoji emojiStyle={user.emojisStyle} unified="2639-fe0f" size={24} /> */}
                  </NoVoiceStyles>
                )}
              </FormControl>

              <Box>
                {/* <Typography sx={{ marginBottom: "2px", marginLeft: "18px", fontSize: "16px" }}>
                  Ses Düzeyi
                </Typography> */}

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <VolumeSlider
                    spacing={2}
                    direction="row"
                    sx={
                      {
                        // "@media (max-width: 600px)": {
                        //   width: "180px",
                        //   padding: "8px 18px 8px 9px",
                        // },
                      }
                    }
                    alignItems="center"
                  >
                    <Tooltip
                      title={user.settings[0].voiceVolume ? "Sessizleştir" : "Sesi Aç"}
                      onClick={handleMuteClick}
                    >
                      <IconButton sx={{ color: "black" }}>
                        {user.settings[0].voiceVolume === 0 ? (
                          <VolumeOff />
                        ) : user.settings[0].voiceVolume <= 0.4 ? (
                          <VolumeDown />
                        ) : (
                          <VolumeUp />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Slider
                      sx={{
                        width: "200px",
                      }}
                      value={user.settings[0].voiceVolume}
                      onChange={handleVoiceVolChange}
                      min={0}
                      max={1}
                      step={0.01}
                      aria-label="Ses Düzeyi Kaydırıcısı"
                      valueLabelFormat={() => {
                        const vol = Math.floor(user.settings[0].voiceVolume * 100);
                        return vol === 0 ? "Sessiz" : vol + "%";
                      }}
                      valueLabelDisplay="auto"
                    />
                  </VolumeSlider>
                </div>
              </Box>
            </FormGroup>
          )}
        </Container>

        <DialogActions
        // style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          {/* <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              wordBreak: "break-all",
              fontSize: "14px",
              margin: "0 18px",
              gap: "4px",
              opacity: 0.8,
            }}
          >
            Made with <Emoji unified="2764-fe0f" size={14} emojiStyle={user.emojisStyle} />{" "}
            {user.emojisStyle === EmojiStyle.NATIVE && "\u00A0"} by{" "}
            <StyledLink href="https://github.com/maciekt07" target="_blank">
              maciekt07
            </StyledLink>
          </span> */}
          <DialogBtn onClick={onClose}>Kapat</DialogBtn>
        </DialogActions>
      </Dialog>
    );
  };

  const Container = styled.div`
    display: flex;
    justify-content: left;
    align-items: left;
    flex-direction: column;
    user-select: none;
    margin: 0 18px;
    gap: 6px;
  `;

  const StyledSelect = styled(Select)`
    width: 300px;
    border-radius: 18px;
    color: black;
    margin: 8px 0;
  `;

  const NoVoiceStyles = styled.p`
    display: flex;
    align-items: center;
    gap: 6px;
    opacity: 0.8;
    font-weight: 500;
    max-width: 300px;
  `;

  const VolumeSlider = styled(Stack)`
    margin: 8px 0;
    background: #afafaf39;
    padding: 12px 24px 12px 18px;
    border-radius: 18px;
    transition: 0.3s all;
    &:hover {
      background: #89898939;
    }
  `;
