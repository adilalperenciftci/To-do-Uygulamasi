import React, { ErrorInfo } from "react";
import { User } from "../types/user";
import { StyledLink } from "../styles";
import { Emoji } from "emoji-picker-react";
import { Button } from "@mui/material";
import { exportTasksToJson } from "../utils";
import { Delete, FileDownload } from "@mui/icons-material";
import toast from "react-hot-toast";

interface ErrorBoundaryProps {
  user: User;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Çocuk bileşenlerindeki hataları yakalayıp gösteren ErrorBoundary bileşeni.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error: error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Hata:", error);
    console.error("Hata Bilgisi:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1
            style={{
              color: "#ff3131",
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
            }}
          >
            Oops! Bir hata oluştu&nbsp;
            <Emoji size={38} unified="1f644" />.
          </h1>{" "}
          <h2>
            Düzeltmek için yerel dosyalarınızı (çerezler ve önbellek) temizleyin ve sayfayı yenileyin.
            Sorun devam ederse, lütfen sorunu{" "}
            <StyledLink href="https://github.com/maciekt07/TodoApp/issues">
              Github Issues
            </StyledLink>
            üzerinden bildirin.
          </h2>
          <div
            style={{
              margin: "16px 0",
            }}
          >
            <Button
              size="large"
              variant="outlined"
              sx={{ p: "12px 20px", borderRadius: "14px" }}
              onClick={() => {
                localStorage.clear();
                location.reload();
              }}
            >
              <Delete /> &nbsp; Otomatik Temizle
            </Button>
          </div>
          <h3>
            <span style={{ color: "#ff3131" }}>HATA:</span> [{this.state.error?.name}]{" "}
            {this.state.error?.message}
          </h3>
          <details
            style={{
              border: "2px solid #ffffff2e",
              padding: "8px",
              borderRadius: "8px",
              background: "#ffffff15",
            }}
          >
            <summary>Hata yığını</summary>
            <div style={{ opacity: 0.8, fontSize: "12px" }}>
              {this.state.error?.stack?.replace(this.state.error?.message, "")}
            </div>
          </details>
          <pre>
            <Button
              variant="outlined"
              sx={{ m: "14px 6px", p: "12px 20px", borderRadius: "14px" }}
              onClick={() => {
                exportTasksToJson(this.props.user.tasks);
                toast.success(`Tüm görevler dışa aktarıldı (${this.props.user.tasks.length})`);
              }}
            >
              <FileDownload /> &nbsp; Görevleri JSON Olarak Dışa Aktar
            </Button>
            <br />
            <code>{JSON.stringify(this.props.user, null, 4)}</code>
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
