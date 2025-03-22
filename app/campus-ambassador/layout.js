import generateStructuredData from "./structured-data";
import Script from "next/script";

export const metadata = {
  title: "Campus Ambassador Program | Codekaro Formify",
  description:
    "Apply to become a Codekaro Campus Ambassador and represent us at your college or university. Join our team of passionate ambassadors to promote Codekaro events, workshops, and courses on your campus.",
  keywords: [
    "campus ambassador",
    "student ambassador",
    "Codekaro",
    "college representatives",
    "campus program",
  ],
  canonical: "/campus-ambassador",

  // Open Graph metadata (Facebook, WhatsApp, LinkedIn, etc.)
  openGraph: {
    title: "Become a Codekaro Campus Ambassador",
    description:
      "Join our team of campus ambassadors and help spread the word about Codekaro at your institution. Great opportunity for students to develop leadership skills and earn rewards.",
    url: "/campus-ambassador",
    type: "website",
    siteName: "Codekaro Formify",
    locale: "en_US",
    images: [
      {
        url: "https://forms.javascript.design/campus-ambassador.png",
        width: 1200,
        height: 630,
        alt: "Codekaro Campus Ambassador Program",
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    title: "Become a Codekaro Campus Ambassador",
    description:
      "Join our team of campus ambassadors and help spread the word about Codekaro at your institution. Great opportunity for students to develop leadership skills and earn rewards.",
    images: ["https://forms.javascript.design/campus-ambassador.png"],
    creator: "@codekaro",
    site: "@codekaro",
  },

  // Additional metadata for better SEO and sharing
  other: {
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": "Codekaro Campus Ambassador Program",
    "og:image:type": "image/png",
  },
};

export default function CampusAmbassadorLayout({ children }) {
  // Generate structured data
  const structuredData = generateStructuredData();

  return (
    <>
      {/* JSON-LD structured data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </>
  );
}
