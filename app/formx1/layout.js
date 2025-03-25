export const metadata = {
  metadataBase: new URL("https://forms.codekaro.in"),
  title: "General Registration Form | Codekaro Formify",
  description:
    "Register for Codekaro courses and events with our easy-to-use online form.",
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
};

export default function Formx1Layout({ children }) {
  return <>{children}</>;
}
