/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import React from 'react';

interface OrganizationJsonLdProps {
  name: string;
  url: string;
  logo?: string | null;
  email?: string;
  phone?: string;
}

export const OrganizationJsonLd: React.FC<OrganizationJsonLdProps> = ({
  name,
  url,
  logo,
  email,
  phone,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'PublishingHouse',
    name,
    url,
    logo: logo || `${url}/templates/npa-logo.png`,
    email: email || 'editornrjbe@gmail.com',
    telephone: phone || '+91-9888934889',
    sameAs: ['https://npajournals.org'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface JournalJsonLdProps {
  name: string;
  issn: string;
  url: string;
  publisherName: string;
  description: string;
}

export const JournalJsonLd: React.FC<JournalJsonLdProps> = ({
  name,
  issn,
  url,
  publisherName,
  description,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Periodical',
    name,
    issn,
    url,
    description,
    publisher: {
      '@type': 'Organization',
      name: publisherName,
    },
    inLanguage: 'en',
    accessMode: 'textual',
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
