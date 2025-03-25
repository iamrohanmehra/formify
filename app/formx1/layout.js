export const metadata = {
  metadataBase: new URL("https://forms.codekaro.in"),
  title: "General Registration Form | Codekaro Forms",
  description: "A simple and elegant registration form for general use cases.",
  openGraph: {
    title: "Register with Codekaro",
    description:
      "Complete our registration form to join Codekaro courses and events.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register with Codekaro",
    description:
      "Complete our registration form to join Codekaro courses and events.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Formx1Layout({ children }) {
  return <>{children}</>;
}
