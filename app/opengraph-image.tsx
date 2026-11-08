import { ImageResponse } from "next/og";
import { CLINICA } from "@/lib/constants";

export const alt = `${CLINICA.nome}: ${CLINICA.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          backgroundColor: "#1A6B5A",
          color: "#F0FDF4",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 700 }}>{CLINICA.nome}</div>
        <div style={{ fontSize: 42, marginTop: 24 }}>{CLINICA.slogan}</div>
        <div style={{ fontSize: 30, marginTop: 64 }}>
          {CLINICA.endereco.completo}
        </div>
      </div>
    ),
    size,
  );
}
