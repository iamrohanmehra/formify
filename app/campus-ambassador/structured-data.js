export default function generateStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Campus Ambassador Program | Codekaro Formify",
    description:
      "Apply to become a Codekaro Campus Ambassador and represent us at your college or university.",
    url: "https://formify.codekaro.in/campus-ambassador",
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
        urlTemplate: "https://formify.codekaro.in/campus-ambassador",
      },
      object: {
        "@type": "EducationalOccupationalProgram",
        name: "Codekaro Campus Ambassador Program",
      },
    },
  };
}
