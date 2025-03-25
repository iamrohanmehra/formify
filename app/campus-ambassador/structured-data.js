export default function generateStructuredData() {
  const baseUrl = "https://forms.javascript.design";

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Campus Ambassador Program | Codekaro Forms",
    description:
      "Join Codekaro's Campus Ambassador Program and help us grow our community of developers.",
    url: `${baseUrl}/campus-ambassador`,
    mainEntity: {
      "@type": "EducationalOccupationalProgram",
      name: "Codekaro Campus Ambassador Program",
      description:
        "Join our team of campus ambassadors and help spread the word about Codekaro at your institution.",
      provider: {
        "@type": "Organization",
        name: "Codekaro",
        url: "https://codekaro.in",
      },
      offers: {
        "@type": "Offer",
        category: "Student Program",
        availability: "https://schema.org/InStock",
      },
      occupationalCategory: "Student Ambassador",
      applicationStartDate: "2024-01-01",
      timeToComplete: "P6M",
    },
    potentialAction: {
      "@type": "ApplyAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/campus-ambassador`,
      },
      object: {
        "@type": "EducationalOccupationalProgram",
        name: "Codekaro Campus Ambassador Program",
      },
    },
  };
}
