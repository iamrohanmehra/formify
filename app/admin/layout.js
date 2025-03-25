export const metadata = {
  metadataBase: new URL("https://forms.codekaro.in"),
  title: "Admin Dashboard | Codekaro Formify",
  description:
    "Manage forms, view submissions, and analyze data with the Codekaro Formify Admin Dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <>{children}</>;
}
