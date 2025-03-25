export const metadata = {
  metadataBase: new URL("https://forms.codekaro.in"),
  title: "Advanced Registration Form | Codekaro Forms",
  description:
    "A comprehensive registration form with conditional questions and advanced validation.",
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
  robots: {
    index: false,
    follow: false,
  },
};

export default function Formx4Layout({ children }) {
  return <>{children}</>;
}
