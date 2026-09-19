/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

export interface ResearchTopic {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  jelCodes: string[];
  keywords: string[];
}

export const RESEARCH_TOPICS: ResearchTopic[] = [
  {
    slug: 'corporate-finance',
    title: 'Corporate Finance & Capital Markets',
    shortDescription: 'Empirical research on corporate governance, capital structure, valuation, IPOs, and market efficiency.',
    longDescription:
      'The Corporate Finance & Capital Markets cluster focuses on quantitative and empirical investigations into corporate investment decisions, cost of capital, dividend policy, mergers and acquisitions (M&A), corporate risk management, and the behavior of emerging equity and debt markets.',
    jelCodes: ['G30', 'G31', 'G32', 'G34'],
    keywords: ['corporate finance', 'capital structure', 'governance', 'valuation', 'mergers', 'acquisitions', 'dividends', 'stock market'],
  },
  {
    slug: 'behavioral-economics',
    title: 'Behavioral Economics & Decision Sciences',
    shortDescription: 'Psychological, cognitive, and emotional factors shaping financial decisions, heuristics, and market anomalies.',
    longDescription:
      'Investigating bounded rationality, investor sentiment, prospect theory, cognitive biases, and consumer economic behaviors. This track brings together empirical experiments and behavioral finance methodologies to explore real-world decision-making beyond neoclassical assumptions.',
    jelCodes: ['D91', 'G40', 'G41'],
    keywords: ['behavioral economics', 'investor sentiment', 'heuristics', 'biases', 'consumer behavior', 'decision sciences', 'market anomalies'],
  },
  {
    slug: 'fintech-digital-economy',
    title: 'Fintech, AI & The Digital Economy',
    shortDescription: 'Algorithmic trading, blockchain, digital banking, central bank digital currencies (CBDC), and AI in management.',
    longDescription:
      'Analyzing structural disruptions in financial systems driven by financial technology (Fintech), machine learning, decentralized finance (DeFi), digital lending, automated advisory, and the macroeconomic implications of algorithmic commerce.',
    jelCodes: ['O33', 'G23', 'C45', 'E42'],
    keywords: ['fintech', 'artificial intelligence', 'machine learning', 'blockchain', 'digital economy', 'cbdc', 'banking', 'e-commerce'],
  },
  {
    slug: 'esg-sustainable-finance',
    title: 'ESG, Sustainable Finance & Green Economy',
    shortDescription: 'Environmental, Social, and Governance (ESG) reporting, carbon credits, green bonds, and ethical investments.',
    longDescription:
      'Addressing global sustainability challenges through financial innovation. Topics include ESG compliance, climate finance risk modeling, green bond pricing, corporate social responsibility (CSR) ROI, and the transition to net-zero circular economies.',
    jelCodes: ['Q56', 'M14', 'G11', 'Q01'],
    keywords: ['esg', 'sustainable finance', 'green bonds', 'climate risk', 'corporate social responsibility', 'sustainability', 'green economy'],
  },
  {
    slug: 'international-trade-macro',
    title: 'International Trade & Applied Macroeconomics',
    shortDescription: 'Monetary policy, global supply chains, inflation dynamics, currency fluctuations, and trade policy impacts.',
    longDescription:
      'Examining international economic linkages, exchange rate volatility, supply chain resilience, tariff policies, central bank interest rate transmission, foreign direct investment (FDI), and macroeconomic growth across advanced and developing nations.',
    jelCodes: ['F10', 'F31', 'F40', 'E52'],
    keywords: ['international trade', 'macroeconomics', 'monetary policy', 'inflation', 'supply chains', 'fdi', 'exchange rates', 'trade policy'],
  },
  {
    slug: 'strategic-management-leadership',
    title: 'Strategic Management & Organizational Leadership',
    shortDescription: 'Competitive dynamics, executive decision-making, organizational resilience, and agile business models.',
    longDescription:
      'Theoretical and case-based inquiries into strategic management, dynamic capabilities, executive leadership styles, knowledge transfer, innovation management, and organizational transformation during periods of economic uncertainty.',
    jelCodes: ['M10', 'M12', 'L10', 'L25'],
    keywords: ['strategic management', 'leadership', 'organizational behavior', 'competitive advantage', 'innovation', 'business models'],
  },
];

export function getTopicBySlug(slug: string): ResearchTopic | undefined {
  return RESEARCH_TOPICS.find((t) => t.slug === slug);
}
