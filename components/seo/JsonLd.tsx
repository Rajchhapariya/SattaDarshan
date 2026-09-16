import React from "react";

const BASE_URL = "https://satta-darshan-7jgo.vercel.app";

type JsonLdProps = {
  data: Record<string, any> | Array<Record<string, any>>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SattaDarshan",
    alternateName: ["Satta Darshan", "SattaDarshan Civic Intelligence"],
    url: BASE_URL,
    description:
      "Independent, non-government civic intelligence platform compiling public political, legislative, and electoral information across India.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/politicians?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SattaDarshan",
    url: BASE_URL,
    logo: `${BASE_URL}/icon.png`,
    description:
      "An independent, non-partisan civic data and public legislative information initiative.",
    sameAs: [],
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

export function generatePersonSchema(p: any, canonicalUrl: string) {
  const jobTitle = p.currentOffice || p.ministerialRank || p.role || "Member of Parliament";
  const location = p.constituency ? `${p.constituency}, ${p.state}` : p.state || "India";

  const person: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: p.name,
      url: canonicalUrl,
      jobTitle,
      description: p.bio || `Public records profile for ${p.name}, ${jobTitle} (${p.partyName || "Independent"}), representing ${location}.`,
    },
  };

  if (p.photo) {
    person.mainEntity.image = p.photo.startsWith("http") ? p.photo : `${BASE_URL}${p.photo}`;
  }

  if (p.partyName) {
    person.mainEntity.memberOf = {
      "@type": "Organization",
      name: p.partyName,
      ...(p.party ? { url: `${BASE_URL}/parties/${p.party}` } : {}),
    };
  }

  if (p.state) {
    person.mainEntity.workLocation = {
      "@type": "AdministrativeArea",
      name: p.state,
    };
  }

  if (p.socialLinks) {
    const sameAs = [
      p.socialLinks.twitter,
      p.socialLinks.facebook,
      p.socialLinks.website,
    ].filter(Boolean);
    if (sameAs.length > 0) {
      person.mainEntity.sameAs = sameAs;
    }
  }

  return person;
}

export function generatePartySchema(party: any, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "PoliticalParty",
    name: party.name,
    alternateName: party.abbr || undefined,
    url: canonicalUrl,
    logo: party.logo ? (party.logo.startsWith("http") ? party.logo : `${BASE_URL}${party.logo}`) : undefined,
    description: party.description || `Political party profile, leadership, and public parliamentary seat records for ${party.name}.`,
    ...(party.headquarters ? { address: { "@type": "PostalAddress", addressLocality: party.headquarters } } : {}),
  };
}

export function generateStateSchema(state: any, canonicalUrl: string) {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "AdministrativeArea",
    name: state.name,
    url: canonicalUrl,
    containedInPlace: {
      "@type": "Country",
      name: "India",
    },
    description: `Legislative and governance profile for the state/territory of ${state.name}. Assembly Seats: ${state.totalAssemblySeats || 0}, Lok Sabha Seats: ${state.totalLokSabhaSeats || 0}.`,
  };

  if (state.capital) {
    schema.containedInPlace = {
      "@type": "Country",
      name: "India",
    };
  }

  return schema;
}

export function generateParliamentSchema(chamber: "Lok Sabha" | "Rajya Sabha", canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: `${chamber} of India`,
    alternateName: chamber === "Lok Sabha" ? "House of the People" : "Council of States",
    url: canonicalUrl,
    parentOrganization: {
      "@type": "GovernmentOrganization",
      name: "Parliament of India",
      url: "https://sansad.in",
    },
    description: `Official parliamentary chamber overview for the ${chamber} of India with seating distributions, state representation, and member records.`,
  };
}
