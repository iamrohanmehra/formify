export const metadata = {
  metadataBase: new URL("https://forms.codekaro.in"),
  title: "Admin Login | Codekaro Formify",
  description: "Secure login portal for Codekaro Formify administrators.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({ children }) {
  return <>{children}</>;
}
