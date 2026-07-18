import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: "#B3542D",
          color: "#F5EDE3",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          fontWeight: 500,
          letterSpacing: "-0.02em",
        }}
      >
        L
      </div>
    ),
    { ...size }
  );
}
