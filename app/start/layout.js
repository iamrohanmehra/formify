export const metadata = {
  metadataBase: new URL("https://forms.codekaro.in"),
  title: "Get Started | Codekaro Forms",
  description:
    "Begin your journey with Codekaro Forms - create and share powerful online forms in minutes.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Get Started with Codekaro Forms",
    description:
      "Learn how to create, customize, and share online forms with Codekaro Forms.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Get Started with Codekaro Forms",
    description:
      "Learn how to create, customize, and share online forms with Codekaro Forms.",
  },
};

export default function StartLayout({ children }) {
  return <>{children}</>;
}
