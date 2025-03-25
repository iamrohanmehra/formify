export const metadata = {
  metadataBase: new URL("https://forms.codekaro.in"),
  title: "Admin Dashboard | Codekaro Forms",
  description:
    "Manage forms, view submissions, and analyze data with the Codekaro Forms Admin Dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <>{children}</>;
}
