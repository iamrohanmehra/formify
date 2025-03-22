import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";
export const alt = "Codekaro Campus Ambassador Program";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

// Image generation
export default async function OGImage() {
  // Font
  const interSemiBold = fetch(
    new URL(
      "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          display: "flex",
          fontSize: 32,
          color: "white",
          background: "linear-gradient(to bottom, #37404A, #1F262E)",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 50,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Top badge */}
        <div
          style={{
            position: "absolute",
            top: 30,
            backgroundColor: "#FFD700",
            color: "#1F262E",
            borderRadius: 12,
            padding: "8px 24px",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          Applications Open
        </div>

        {/* Logo placeholder */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            style={{ marginRight: 12 }}
          >
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="14 2 14 8 20 8"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="16"
              y1="13"
              x2="8"
              y2="13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1="16"
              y1="17"
              x2="8"
              y2="17"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="10 9 9 9 8 9"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 24, fontWeight: 600 }}>
            Codekaro Formify
          </span>
        </div>

        {/* Main title */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 700,
            margin: "10px 0",
            background: "linear-gradient(to right, #FFD700, #FFA500)",
            backgroundClip: "text",
            color: "transparent",
            WebkitBackgroundClip: "text",
            lineHeight: 1.2,
          }}
        >
          Campus Ambassador
        </h1>
        <h2 style={{ fontSize: 36, margin: "10px 0 20px 0" }}>Program 2024</h2>

        {/* Description */}
        <p
          style={{
            fontSize: 24,
            maxWidth: 800,
            textAlign: "center",
            color: "#E5E7EB",
            lineHeight: 1.4,
          }}
        >
          Join our team of passionate ambassadors and represent Codekaro at your
          institution
        </p>

        {/* Bottom features */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "80%",
            marginTop: 40,
          }}
        >
          <Feature emoji="🏆" text="Earn Rewards" />
          <Feature emoji="🚀" text="Gain Experience" />
          <Feature emoji="🌟" text="Build Network" />
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await interSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    }
  );
}

// Helper component for features
function Feature({ emoji, text }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: 12,
        padding: "12px 24px",
        width: 180,
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{emoji}</div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>{text}</div>
    </div>
  );
}
