export const metadata = {
  metadataBase: new URL("https://forms.codekaro.in"),
  title: "Advanced Registration Form | Codekaro Formify",
  description:
    "Sign up for premium Codekaro courses and special events with our comprehensive registration form.",
  openGraph: {
    title: "Register for Premium Codekaro Courses",
    description:
      "Complete our advanced registration form to access premium content and special events.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register for Premium Codekaro Courses",
    description:
      "Complete our advanced registration form to access premium content and special events.",
  },
};

export default function Formx4Layout({ children }) {
  return <>{children}</>;
}
