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
export default async function TwitterImage() {
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
          background: "linear-gradient(to bottom right, #37404A, #1F262E)",
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
        {/* Twitter tag */}
        <div
          style={{
            position: "absolute",
            top: 30,
            right: 30,
            display: "flex",
            alignItems: "center",
            fontSize: 20,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="white"
            style={{ marginRight: 8 }}
          >
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          @codekaro
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
            color: "#FFD700",
            lineHeight: 1.2,
          }}
        >
          Campus Ambassador
        </h1>
        <h2 style={{ fontSize: 36, margin: "10px 0 20px 0", color: "#F9FAFB" }}>
          Program 2024
        </h2>

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
          Apply now to represent Codekaro at your college and gain leadership
          experience
        </p>

        {/* Apply button */}
        <div
          style={{
            marginTop: 40,
            backgroundColor: "#FFD700",
            color: "#1F262E",
            padding: "12px 32px",
            borderRadius: 8,
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          APPLY NOW
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
