/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with authentic NRJBE journal data...');

  // 1. Admin User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  await prisma.adminUser.upsert({
    where: { email: 'admin@nrjbe.in' },
    update: { passwordHash },
    create: {
      email: 'admin@nrjbe.in',
      name: 'Editor-in-Chief / Chief Administrator',
      passwordHash,
      role: 'superadmin',
    },
  });

  // 2. Site Setting
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      journalName: 'National Research Journal of Business Economics',
      shortName: 'NRJBE',
      tagline: 'An International Reputed Peer Reviewed Refereed Research Journal | Open Access Journal',
      issn: '2349-2015',
      impactFactor: '6.74',
      frequency: 'Biannual (2 Issues Per Year)',
      peerReviewType: 'Double Blind Peer Review Process',
      languages: 'English',
      accessibility: 'Open Access (CC-BY-NC 4.0)',
      plagiarismLimit: '25% Allowed (Turnitin / Urkund)',
      aiContentLimit: '10% Allowed',
      apcOnline: '1800 INR',
      apcPrint: '2300 INR',
      subscriptionPrice: '3500/- (Bi-Annual)',
      publisherName: 'National Press Associates',
      publisherUrl: 'https://npajournals.org',
      contactEmail: 'editornrjbe@gmail.com',
      contactPhone: '+91-9888934889',
      contactPhoneAlt: '+91-7986925354',
      whatsappNumber: '919888934889',
      address: 'Publishing Office: National Press Associates, Regional HQ, India',
      heroTitle: 'Advancing Global Research in Business & Economics',
      heroSubtitle: 'A globally recognized peer-reviewed refereed international journal fostering cutting-edge theoretical and empirical scientific contributions with digital object identifiers (DOIs).',
      heroBadge: 'ISSN: 2349-2015 | Impact Factor: 6.74 | Open Access | Zenodo DOI Indexed',
      bannerText: 'CALL FOR PAPERS 2026 (July-December) - Submit your original manuscripts for rapid peer-review and DOI assignment.',
      bannerActive: true,
      aboutOverview: 'National Research Journal of business economics is a peer-reviewed and refereed academic scholarly business journal (ISSN: 2349-2015) dedicated to advancing research and discourse in the fields of Business Management, Economics, Finance, and related areas. The journal upholds rigorous academic standards, ensuring the publication of high-quality research contributions.',
    },
  });

  // 3. Navigation Items
  await prisma.navItem.deleteMany({});
  
  const navHome = await prisma.navItem.create({
    data: { label: 'Home', path: '/', order: 1 },
  });
  const navCurrent = await prisma.navItem.create({
    data: { label: 'Current Issue', path: '/current-issue', order: 2 },
  });
  const navArchives = await prisma.navItem.create({
    data: { label: 'Archives', path: '/archives', order: 3 },
  });
  const navEditorial = await prisma.navItem.create({
    data: { label: 'Editorial Board', path: '/editorial-board', order: 4 },
  });
  const navSubmit = await prisma.navItem.create({
    data: { label: 'Submit Paper', path: '/submit-paper', order: 5 },
  });
  const navTrack = await prisma.navItem.create({
    data: { label: 'Track Paper', path: '/track-status', order: 6 },
  });

  // Dropdown: For Authors
  const navAuthors = await prisma.navItem.create({
    data: { label: 'For Authors', path: '#', order: 7 },
  });
  await prisma.navItem.createMany({
    data: [
      { label: 'Manuscript Guidelines', path: '/page/manuscript-guidelines', parentId: navAuthors.id, order: 1 },
      { label: 'Research Areas', path: '/page/research-areas', parentId: navAuthors.id, order: 2 },
      { label: 'Author Instructions', path: '/page/author-instructions', parentId: navAuthors.id, order: 3 },
      { label: 'Copyright Agreement Form', path: '/page/copyright-form', parentId: navAuthors.id, order: 4 },
      { label: 'View Paper Template', path: '/page/paper-template', parentId: navAuthors.id, order: 5 },
      { label: 'Publication Charges (APC)', path: '/page/publication-charges', parentId: navAuthors.id, order: 6 },
    ],
  });

  // Dropdown: Journal Policies
  const navPolicies = await prisma.navItem.create({
    data: { label: 'Journal Policies', path: '#', order: 8 },
  });
  await prisma.navItem.createMany({
    data: [
      { label: 'Editorial Policy', path: '/page/editorial-policy', parentId: navPolicies.id, order: 1 },
      { label: 'Peer Review Process', path: '/page/peer-review-process', parentId: navPolicies.id, order: 2 },
      { label: 'Publication Ethics & Practices', path: '/page/publication-ethics', parentId: navPolicies.id, order: 3 },
      { label: 'Plagiarism Policy', path: '/page/plagiarism-policy', parentId: navPolicies.id, order: 4 },
      { label: 'Open Access, Licensing & Copyright', path: '/page/open-access-licensing', parentId: navPolicies.id, order: 5 },
      { label: 'Disclaimer & Privacy Policy', path: '/page/privacy-policy', parentId: navPolicies.id, order: 6 },
      { label: 'Indexing & Abstracting', path: '/page/indexing', parentId: navPolicies.id, order: 7 },
      { label: 'FAQ', path: '/page/faq', parentId: navPolicies.id, order: 8 },
    ],
  });

  const navSubscribe = await prisma.navItem.create({
    data: { label: 'Subscribe Journal', path: '/subscribe', order: 9 },
  });
  const navContact = await prisma.navItem.create({
    data: { label: 'Contact Us', path: '/contact', order: 10 },
  });

  // 4. Volumes and Issues
  await prisma.volume.deleteMany({});
  
  const vol12 = await prisma.volume.create({
    data: {
      volumeNumber: 12,
      year: 2026,
      title: 'Volume 12 (2026)',
      description: 'Annual Volume 12 covering cutting-edge research in business administration, economics, and finance.',
      isActive: true,
    },
  });

  const vol11 = await prisma.volume.create({
    data: {
      volumeNumber: 11,
      year: 2025,
      title: 'Volume 11 (2025)',
      description: 'Annual Volume 11 archive.',
      isActive: true,
    },
  });

  const issueCurrent = await prisma.issue.create({
    data: {
      volumeId: vol12.id,
      issueNumber: '1',
      title: 'Volume 12, Issue 1 (January - June 2026)',
      monthYear: 'January - June 2026',
      isCurrent: true,
      status: 'Published',
    },
  });

  const issuePast1 = await prisma.issue.create({
    data: {
      volumeId: vol11.id,
      issueNumber: '2',
      title: 'Volume 11, Issue 2 (July - December 2025)',
      monthYear: 'July - December 2025',
      isCurrent: false,
      status: 'Published',
    },
  });

  const issuePast2 = await prisma.issue.create({
    data: {
      volumeId: vol11.id,
      issueNumber: '1',
      title: 'Volume 11, Issue 1 (January - June 2025)',
      monthYear: 'January - June 2025',
      isCurrent: false,
      status: 'Published',
    },
  });

  // 5. Articles (Real authentic papers from NRJBE)
  await prisma.article.deleteMany({});

  const articlesData = [
    {
      issueId: issueCurrent.id,
      paperId: 'HEA-6a647828e3453',
      title: 'HEALTH INSURANCE ADOPTION AND FINANCIAL PROTECTION IN INDIA: A SYSTEMATIC REVIEW OF PUBLIC SCHEMES AND PRIVATE INSURANCE MARKETS WITH SPECIAL REFERENCE TO PUNJAB',
      authors: 'Amanpreet Singh, Navneet Seth',
      affiliations: 'Department of Business Economics, Panjab University, Chandigarh, India',
      abstract: 'Health insurance is an important mechanism for improving access to healthcare and protecting households from financial hardship caused by illness. India has expanded publicly funded health insurance while private health insurance markets have also grown. However, insurance coverage does not necessarily provide effective financial protection because households may continue to pay for medicines, diagnostics, outpatient care, non-covered services, and other residual costs. This review synthesises evidence published between 2010 and 2025 on determinants of health insurance adoption and the relationship between public and private health insurance and financial protection in India, with particular attention to Punjab. Methods: A systematic narrative review was structured around PRISMA 2020 reporting principles. Results indicate that health insurance adoption is influenced by income, education, awareness, accessibility, and trust. Punjab-specific evidence indicates substantial financial burden associated with healthcare, especially for non-communicable diseases.',
      keywords: 'health insurance adoption, financial protection, public health insurance, PM-JAY, out-of-pocket expenditure, catastrophic health expenditure, India, Punjab, systematic review',
      doi: 'https://doi.org/10.5281/zenodo.21549492',
      pageRange: '01-14',
      views: 342,
      downloads: 128,
    },
    {
      issueId: issueCurrent.id,
      paperId: 'ADA-6a6894a05ee24',
      title: 'ADAPTATION AND IMPACT OF UPI ON STREET VENDORS IN TRIBAL AREAS OF BASTAR DIVISION, CHHATTISGARH',
      authors: 'Rameshwar Mandavi, Tumeshwar, Suraj Sahu',
      affiliations: 'School of Studies in Economics, Pt. Ravishankar Shukla University, Raipur, India',
      abstract: "India's UPI recorded approximately 228 billion transactions worth nearly Rs. 300 lakh crores in 2025, making it the world's largest real-time retail payment system. Despite this national growth, its penetration into remote tribal economies remains largely unexplored. This paper examines UPI adaptation and impact among street vendors in Bastar Division of Chhattisgarh, a seven-district predominantly Scheduled Tribe region, through a mixed-method approach combining structured survey (n=34) with systematic stall-by-stall field observations across three distinct markets. The field data reveal a sharp urban–rural digital divide: at Geedam Haat (rural), only 22.6% stalls accepted UPI, while at Jagdalpur Sanjay Market (urban), 87.7% accepted UPI. Device ownership and women's digital access emerge as primary policy hurdles.",
      keywords: 'UPI adoption in Bastar, tribal economy, street vendors, Bastar Division, financial inclusion, women vendors, digital divide, Chhattisgarh',
      doi: 'https://doi.org/10.5281/zenodo.21643325',
      pageRange: '15-28',
      views: 512,
      downloads: 241,
    },
    {
      issueId: issueCurrent.id,
      paperId: 'IMP-6a6c7d4a88b17',
      title: 'IMPACT OF DIRECT AND INDIRECT TAXES ON ECONOMIC GROWTH IN INDIA: AN EMPIRICAL ANALYSIS',
      authors: 'Dr. Rajni',
      affiliations: 'Department of Commerce, Kurukshetra University, Haryana, India',
      abstract: "The taxation system of a country significantly influences fiscal sustainability, income distribution, and overall economic growth. With the beginning of economic reforms from 1991, the Indian tax system has undergone substantial transformation. The period from 2000–01 to 2024–25 has witnessed major developments such as fiscal consolidation measures, implementation of the Goods and Services Tax (GST), digitization of tax administration, the Global Financial Crisis, and the COVID-19 pandemic. In this context, the present study examines the growth, composition, and shifting dynamics of direct and indirect tax revenues in India. Empirical results demonstrate a strong positive correlation between GST rationalization and revenue buoyancies.",
      keywords: 'Taxation, Direct Taxes, Indirect Taxes, Tax–GDP Ratio, Fiscal Capacity, GST, Revenue Growth, India',
      doi: 'https://doi.org/10.5281/zenodo.21719894',
      pageRange: '29-42',
      views: 420,
      downloads: 195,
    },
    {
      issueId: issueCurrent.id,
      paperId: 'HEA-6a74254932177',
      title: "HEALTHCARE FINANCING AND ECONOMIC DEVELOPMENT: EXAMINING THE ROLE OF HEALTH INSURANCE IN AGRA'S URBAN ECONOMY",
      authors: 'Suraj Pratap Singh',
      affiliations: 'Faculty of Social Sciences, Dayalbagh Educational Institute, Agra, India',
      abstract: "Healthcare financing plays an important role in promoting economic stability and enhancing public health outcomes in urban economies. This study examines the relationship between healthcare financing and economic development by examining the role of health insurance in the urban economy of Agra City. Using primary data from 65 respondents via a structured questionnaire, descriptive and inferential statistics analyze the level of awareness, accessibility, and utilization of health plans. The results show that health insurance plays a significant role in reducing catastrophic healthcare shocks and preserving household savings.",
      keywords: 'Health Care Financing, Quality of Healthcare Services, Insurance Development Linkage, Urban Economy, Agra',
      doi: 'https://doi.org/10.5281/zenodo.21849236',
      pageRange: '43-52',
      views: 290,
      downloads: 87,
    },
    {
      issueId: issueCurrent.id,
      paperId: 'IMP-6a76f81fd7478',
      title: 'IMPACT ON THE BEHAVIOR OF EMPLOYEES ETHICS IN BUSINESS',
      authors: 'Dr. Ramesh Kumar',
      affiliations: 'Department of Management Studies, New Delhi, India',
      abstract: 'Ethical issues in enterprises are often discussed in scientific studies. Most describe organizational ethics from the perspective of corporate social responsibility or its impact on the behavior of employees. The authors depart from schematic formulaic thinking of ethics as a set of normative values to investigate a purely strategic business approach: examining how organizational ethics can be integrated into brand differentiation, pricing structures, and competitive advantage.',
      keywords: 'communication, business ethics, employee behavior, management, promotion, corporate strategy',
      doi: 'https://doi.org/10.5281/zenodo.21849236',
      pageRange: '53-64',
      views: 310,
      downloads: 114,
    },
    {
      issueId: issueCurrent.id,
      paperId: 'THE-6a82cfe8352cb',
      title: 'THE ROLE OF FINANCIAL LITERACY IN INVESTMENT DECISIONS AMONG WORKING WOMEN IN INDIA: A SYSTEMATIC LITERATURE REVIEW',
      authors: 'Smita Verma, Vipin Bihari Srivastava',
      affiliations: 'Department of Commerce & Financial Studies, University of Allahabad, Prayagraj, India',
      abstract: 'This study investigates how financial literacy influences investment decisions among working women in India through a systematic literature review (SLR) of 65 studies identified via the PRISMA framework. Findings indicate that women with higher financial literacy exhibit increased confidence and are more likely to make informed and diversified investment decisions beyond traditional gold and fixed deposits. The study underscores the necessity for targeted workplace financial literacy programs and digital financial inclusion.',
      keywords: 'Financial Literacy, Investment Decision, Working Women, Financial Inclusion, Financial Empowerment, Investment Behaviour, Systematic Literature Review, PRISMA',
      doi: 'https://doi.org/10.5281/zenodo.21976846',
      pageRange: '65-80',
      views: 654,
      downloads: 312,
    },
    {
      issueId: issueCurrent.id,
      paperId: 'AMU-6a86dbefd456f',
      title: "AMUL: FROM VILLAGE TO NATIONAL PRIDE — How a Farmer-Owned Cooperative Became India's Largest Food Brand",
      authors: 'Bhoomi Makwana, Ibrahim Choudhary',
      affiliations: 'Institute of Rural Management Anand (IRMA), Gujarat, India',
      abstract: 'Amul began in 1946 as a protest. A small group of farmers in Kaira district, Gujarat, tired of being underpaid by a private milk trader with a government-backed monopoly, organised themselves into a cooperative to sell milk directly. Under the guidance of Sardar Vallabhbhai Patel and Tribhuvandas Patel, and later shaped decisively by Dr. Verghese Kurien, that local protest grew into the GCMMF behind the Amul brand, crossing ₹1 lakh crore in annual turnover. This case study traces that historic journey, analyzing the Anand Pattern supply chain and iconic brand marketing strategies.',
      keywords: 'Amul, Dairy Cooperative, Anand Pattern, White Revolution, Rural Marketing, FMCG, Brand Strategy, India',
      doi: 'https://doi.org/10.5281/zenodo.22019284',
      pageRange: '81-94',
      views: 780,
      downloads: 405,
    },
    {
      issueId: issueCurrent.id,
      paperId: 'DRI-6a86dea07c51b',
      title: 'DRIVING SUSTAINABLE GROWTH IN THE SPICE INDUSTRY: THE CASE OF MANGAL MASALA MAZAGAON MUMBAI',
      authors: 'Dimple Waghela',
      affiliations: 'Department of Commerce, SNDT Women’s University, Mumbai, India',
      abstract: "For more than a century, Mangal Masala has been a trusted name in the Indian spice industry. Established in 1912 and headquartered in Mumbai, the company has built its reputation by offering authentic, high-quality spices. Despite its strong legacy, consumer shopping behaviors, direct-to-consumer digital channels, and modern packaging present new challenges against corporate competitors like Everest, MDH, and Catch. This case study provides strategic recommendations for brand rejuvenation.",
      keywords: 'Spice Industry, Mangal Masala, FMCG, Brand Heritage, Distribution Channels, Packaging Innovation, Sustainable Growth',
      doi: 'https://doi.org/10.5281/zenodo.22184931',
      pageRange: '95-104',
      views: 315,
      downloads: 98,
    },
    {
      issueId: issueCurrent.id,
      paperId: 'A_C-6a86e6e7ec870',
      title: "GREEN FREIGHT, GROUNDED REALITY? EXAMINING WHETHER INDIA'S DEDICATED FREIGHT CORRIDOR CAN WIN BACK HIGH-VALUE CARGO FROM ROAD TRANSPORT",
      authors: 'Saurabh Patil, Nikunj Sagar',
      affiliations: 'Centre for Transportation & Logistics, IIM Ahmedabad, India',
      abstract: "Balancing India's environmental and infrastructure ambitions with commercial logistics realities that actually shift freight from road to rail is a crucial economic challenge. This empirical study evaluates rail vs road cost differentials, transit reliability, and multimodal last-mile connectivity along the Western and Eastern Dedicated Freight Corridors (DFCs).",
      keywords: 'Dedicated Freight Corridor, DFC, Logistics, Rail Freight, Multimodal Transport, Supply Chain, Infrastructure Development',
      doi: 'https://doi.org/10.5281/zenodo.22689042',
      pageRange: '105-118',
      views: 489,
      downloads: 211,
    },
    {
      issueId: issueCurrent.id,
      paperId: 'EFF-6aa28f7864e5e',
      title: 'EFFECTIVENESS OF MOTION GRAPHICS IN ADVERTISING: A Qualitative Study of Visual Communication, Brand Engagement, and Consumer Response',
      authors: 'Kapil Chowdhury',
      affiliations: 'Department of Media and Communication Studies, Symbiosis International University, Pune, India',
      abstract: 'Motion graphics use animation and graphic design to bring together visuals, text, colour, and sound to create animated digital content. As viewers have increasingly gravitated towards video over static ads, brands have adopted dynamic kinetic typography. Secondary sources were collected from 30 academic journal articles, master’s dissertations, and doctoral theses published between 2018 and 2026. Results show motion graphics excel at capturing user attention and enhancing short-term message recall.',
      keywords: 'Motion graphics, Advertising effectiveness, visual communication, kinetic typography, Brand engagement, Digital Marketing',
      doi: 'https://doi.org/10.5281/zenodo.22689042',
      pageRange: '119-132',
      views: 590,
      downloads: 320,
    },
  ];

  for (const art of articlesData) {
    await prisma.article.create({
      data: {
        ...art,
        pdfUrl: `/uploads/papers/${art.paperId}.pdf`,
        certificateUrl: `/uploads/certificates/cert-${art.paperId}.pdf`,
      },
    });
  }

  // 6. Pages (Policy and Content)
  await prisma.page.deleteMany({});
  
  await prisma.page.createMany({
    data: [
      {
        slug: 'editorial-policy',
        title: 'Editorial Policy',
        subtitle: 'Our Commitment to Scholarly Rigor and Academic Excellence',
        contentHtml: `
          <h3>1. Scope and Objective</h3>
          <p>The <strong>National Research Journal of Business Economics (NRJBE)</strong> is an international peer-reviewed and refereed research journal. The primary objective is to provide an intellectual platform for scholars, researchers, and practitioners in Business Administration, Economics, Finance, Commerce, and Allied Disciplines.</p>
          
          <h3>2. Originality and Integrity</h3>
          <p>Manuscripts submitted to NRJBE must be original and not under consideration by any other journal or publisher. All submissions are screened for originality using automated plagiarism detection software.</p>

          <h3>3. Section Policies</h3>
          <ul>
            <li><strong>Original Research Papers:</strong> Empirical, theoretical, or mixed-method papers contributing fresh perspectives.</li>
            <li><strong>Review Articles:</strong> In-depth systematic literature reviews following PRISMA guidelines.</li>
            <li><strong>Case Studies:</strong> Analytical investigations of corporate, cooperative, or public initiatives.</li>
            <li><strong>Conference Proceedings:</strong> Peer-reviewed special collections from reputable academic summits.</li>
          </ul>
        `,
      },
      {
        slug: 'peer-review-process',
        title: 'Peer Review Process',
        subtitle: 'Transparent, Fair, and Rigorous Double-Blind Review',
        contentHtml: `
          <h3>Double-Blind Peer Review Mechanism</h3>
          <p>NRJBE strictly enforces a <strong>Double-Blind Peer Review</strong> policy. The identity of both the authors and the referees are concealed throughout the review process to eliminate bias based on nationality, institutional affiliation, or gender.</p>
          
          <div class="steps-box">
            <h4>Review Timeline & Stages:</h4>
            <ol>
              <li><strong>Initial Editorial Screening (Days 1-3):</strong> Plagiarism check (&le;25% similarity, &le;10% AI generated), scope validation, and formatting compliance.</li>
              <li><strong>Reviewer Assignment (Days 4-7):</strong> Manuscript forwarded to at least two subject matter experts.</li>
              <li><strong>Referees Evaluation (Days 8-21):</strong> Assessment of methodology, clarity, contributions, literature review, and statistical rigor.</li>
              <li><strong>Editorial Decision:</strong> Accepted without changes, Revision Required (Minor/Major), or Rejected.</li>
              <li><strong>Final Proofing & DOI Assignment:</strong> Rapid publication upon completion of camera-ready proof and copyright submission.</li>
            </ol>
          </div>
        `,
      },
      {
        slug: 'publication-ethics',
        title: 'Publication Ethics & Malpractice Statement',
        subtitle: 'Adhering to COPE (Committee on Publication Ethics) Guidelines',
        contentHtml: `
          <h3>Duties of Editors</h3>
          <p>Editors are responsible for deciding which of the articles submitted to the journal should be published. The validation of the work in question and its importance to researchers and readers must always drive such decisions.</p>

          <h3>Duties of Authors</h3>
          <ul>
            <li><strong>Authenticity:</strong> Authors of reports of original research should present an accurate account of the work performed as well as an objective discussion of its significance.</li>
            <li><strong>Data Access:</strong> Authors may be asked to provide the raw data in connection with a paper for editorial review.</li>
            <li><strong>Authorship of the Paper:</strong> Authorship should be limited to those who have made a significant contribution to the conception, design, execution, or interpretation of the reported study.</li>
            <li><strong>Conflict of Interest:</strong> All authors must disclose any financial or substantive conflict of interest that might be construed to influence the results or interpretation of their manuscript.</li>
          </ul>
        `,
      },
      {
        slug: 'plagiarism-policy',
        title: 'Plagiarism & AI Content Policy',
        subtitle: 'Zero Tolerance for Academic Dishonesty',
        contentHtml: `
          <h3>Similarity & AI Thresholds</h3>
          <p>NRJBE employs industry-standard plagiarism detection tools (Turnitin and Urkund) before initiating peer review.</p>
          <ul>
            <li><strong>Plagiarism / Similarity Index:</strong> Must be <strong>strictly below 25%</strong> (excluding references and bibliography).</li>
            <li><strong>AI-Generated Content:</strong> Must not exceed <strong>10%</strong>. AI tools used solely for grammar correction must be disclosed by the authors.</li>
            <li><strong>Consequences:</strong> Any paper with plagiarism exceeding permissible bounds will be rejected outright. If detected post-publication, the article will be retracted with a public notice.</li>
          </ul>
        `,
      },
      {
        slug: 'open-access-licensing',
        title: 'Open Access, Licensing & Copyright',
        subtitle: 'Unrestricted Global Knowledge Dissemination',
        contentHtml: `
          <h3>Creative Commons Attribution License (CC-BY-NC 4.0)</h3>
          <p>This is an open access journal, which means that all content is freely available without charge to the user or his/her institution. Users are allowed to read, download, copy, distribute, print, search, or link to the full texts of the articles, or use them for any other lawful non-commercial purpose.</p>
          <p>Authors retain copyright and grant the journal right of first publication under Creative Commons CC-BY-NC 4.0.</p>
        `,
      },
      {
        slug: 'manuscript-guidelines',
        title: 'Manuscript Submission Guidelines',
        subtitle: 'Formatting, Style, and Submission Criteria for Prospective Authors',
        contentHtml: `
          <h3>Paper Structure</h3>
          <p>Manuscripts should be compiled in the following order:</p>
          <ol>
            <li><strong>Title:</strong> Concise and informative (Capitalized, 14pt Bold).</li>
            <li><strong>Author Details:</strong> Names, Affiliations, City, Country, and Corresponding Author Email & WhatsApp.</li>
            <li><strong>Abstract:</strong> 150–250 words summarizing Background, Objective, Methodology, Results, and Conclusion.</li>
            <li><strong>Keywords:</strong> 4 to 8 relevant keywords separated by semicolons.</li>
            <li><strong>Main Text:</strong> Introduction, Literature Review, Methodology, Results & Discussion, Conclusion, Policy Implications.</li>
            <li><strong>References:</strong> APA 7th Edition style.</li>
          </ol>
        `,
      },
      {
        slug: 'research-areas',
        title: 'Scope & Research Areas',
        subtitle: 'Interdisciplinary Coverage in Business, Economics, and Management',
        contentHtml: `
          <h3>Approved Research Domains</h3>
          <div class="grid grid-cols-2 gap-4">
            <ul>
              <li>Business Economics & Macroeconomic Policy</li>
              <li>Financial Markets, Banking, & Fintech</li>
              <li>Human Resource Management & Organizational Behaviour</li>
              <li>Marketing Management & Consumer Analytics</li>
              <li>Supply Chain, Logistics & Operations</li>
            </ul>
            <ul>
              <li>Corporate Governance & Business Ethics</li>
              <li>Digital Transformation & Information Systems</li>
              <li>International Trade & FDI</li>
              <li>Microfinance & Rural Economics</li>
              <li>Sustainable Business & ESG Frameworks</li>
            </ul>
          </div>
        `,
      },
      {
        slug: 'author-instructions',
        title: 'Author Instructions',
        subtitle: 'Step-by-step Guide to Manuscript Submission and Tracking',
        contentHtml: `
          <h3>How to Submit</h3>
          <p>Authors can submit manuscripts directly via our <a href="/submit-paper">Online Paper Submission Portal</a>. Please have the following ready:</p>
          <ul>
            <li>Complete Word (.docx) or PDF manuscript.</li>
            <li>Signed Copyright Agreement Form.</li>
            <li>List of all co-author names and institutional emails.</li>
          </ul>
          <p>Upon submission, an automated <strong>Tracking ID</strong> (e.g. <code>SUB-2026-XXXX</code>) is generated. Use our <a href="/track-status">Track Paper Status</a> tool anytime to follow your manuscript's progress.</p>
        `,
      },
      {
        slug: 'copyright-form',
        title: 'Copyright Agreement Form',
        subtitle: 'Official Download & Electronic Submission of Publishing Agreement',
        contentHtml: `
          <p>All authors must submit a signed copyright transfer agreement before final camera-ready publication. You can download the official form below:</p>
          <div class="p-4 border rounded bg-slate-50 my-4">
            <h4 class="font-bold text-slate-800">Download Official Forms</h4>
            <ul class="list-disc ml-5 mt-2 space-y-2">
              <li><a href="/templates/Copyright-Form.pdf" class="text-blue-600 underline font-semibold" download>Download Copyright Agreement Form (PDF)</a></li>
              <li><a href="/templates/Paper-Template.docx" class="text-blue-600 underline font-semibold" download>Download Author Paper Template (.DOCX)</a></li>
            </ul>
          </div>
        `,
      },
      {
        slug: 'paper-template',
        title: 'Author Paper Template',
        subtitle: 'Standardized Typography and Column Layout for NRJBE Submissions',
        contentHtml: `
          <p>We provide standard Microsoft Word (.docx) and PDF templates that follow the required single-column and double-column camera-ready formats.</p>
          <div class="p-4 bg-emerald-50 border border-emerald-200 rounded my-4">
            <p class="font-medium text-emerald-900">Ensure your paper uses Times New Roman font (12pt body text, 1.15 line spacing) with APA citation style.</p>
          </div>
          <p><a href="/templates/Paper-Template.docx" class="btn btn-primary" download>Download Word Template (.DOCX)</a></p>
        `,
      },
      {
        slug: 'publication-charges',
        title: 'Publication Charges (APC)',
        subtitle: 'Transparent, Low-Cost Article Processing Fees',
        contentHtml: `
          <h3>Article Processing Charges (APC)</h3>
          <p>NRJBE is committed to maintaining low publication costs while providing international DOI indexing, editorial peer-review, and lifetime digital archiving.</p>
          <table class="w-full border mt-4 text-left">
            <thead>
              <tr class="bg-slate-100 border-b">
                <th class="p-3">Service</th>
                <th class="p-3">Indian Authors</th>
                <th class="p-3">International Authors</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-3 font-semibold">Online Publication + Zenodo/CrossRef DOI + e-Certificate</td>
                <td class="p-3 font-bold text-emerald-700">₹1,800 INR</td>
                <td class="p-3 font-bold text-emerald-700">$50 USD</td>
              </tr>
              <tr class="border-b">
                <td class="p-3 font-semibold">Online + Printed Hard Copy + Hard Copy Certificate</td>
                <td class="p-3 font-bold text-emerald-700">₹2,300 INR</td>
                <td class="p-3 font-bold text-emerald-700">$85 USD</td>
              </tr>
            </tbody>
          </table>
        `,
      },
      {
        slug: 'indexing',
        title: 'Indexing & Abstracting',
        subtitle: 'Worldwide Scholarly Visibility and Discoverability',
        contentHtml: `
          <p>All papers published in NRJBE are archived and indexed across global scholarly indexing databases and academic repositories, including:</p>
          <ul class="grid grid-cols-2 gap-3 mt-4">
            <li class="p-3 bg-slate-50 border rounded font-medium">Google Scholar</li>
            <li class="p-3 bg-slate-50 border rounded font-medium">Zenodo (CERN / OpenAIRE)</li>
            <li class="p-3 bg-slate-50 border rounded font-medium">CrossRef (DOI)</li>
            <li class="p-3 bg-slate-50 border rounded font-medium">ResearchGate</li>
            <li class="p-3 bg-slate-50 border rounded font-medium">Academia.edu</li>
            <li class="p-3 bg-slate-50 border rounded font-medium">Mendeley</li>
            <li class="p-3 bg-slate-50 border rounded font-medium">WorldCat</li>
            <li class="p-3 bg-slate-50 border rounded font-medium">DRJI (Directory of Research Journals Indexing)</li>
          </ul>
        `,
      },
      {
        slug: 'privacy-policy',
        title: 'Privacy & Disclaimer Policy',
        subtitle: 'Data Protection, Institutional Disclaimers, and Ethical Policies',
        contentHtml: `
          <h3>Privacy Policy</h3>
          <p>The names, email addresses, and contact numbers entered in this journal site will be used exclusively for the stated purposes of this journal and will not be made available for any other purpose or to any third party.</p>
          
          <h3>Disclaimer</h3>
          <p>The views and opinions expressed in published articles are solely those of the authors and do not necessarily reflect the official policy or position of National Press Associates or the Editorial Board of NRJBE.</p>
        `,
      },
      {
        slug: 'faq',
        title: 'Frequently Asked Questions (FAQ)',
        subtitle: 'Common Inquiries Regarding Submissions, Reviews, and Publication',
        contentHtml: `
          <div class="space-y-4">
            <div class="p-4 border rounded">
              <h4 class="font-bold text-lg">1. How long does the review process take?</h4>
              <p class="text-slate-600 mt-1">Our peer review process takes approximately 7 to 14 days under fast-track processing.</p>
            </div>
            <div class="p-4 border rounded">
              <h4 class="font-bold text-lg">2. Will I receive a DOI for my research paper?</h4>
              <p class="text-slate-600 mt-1">Yes! Every published paper receives a unique Digital Object Identifier (DOI) powered by Zenodo / Crossref.</p>
            </div>
            <div class="p-4 border rounded">
              <h4 class="font-bold text-lg">3. How can I download my publication certificate?</h4>
              <p class="text-slate-600 mt-1">Visit our Current Issue or Archives page and click 'Download Certificate' beside your paper, or enter your Paper ID in the Track Status page.</p>
            </div>
          </div>
        `,
      },
    ],
  });

  // 7. Editorial Members
  await prisma.editorialMember.deleteMany({});
  await prisma.editorialMember.createMany({
    data: [
      {
        name: 'Dr. Harvinder S. Sandhu',
        designation: 'Professor & Dean',
        department: 'University Business School (UBS)',
        institution: 'Guru Nanak Dev University, Amritsar, India',
        country: 'India',
        role: 'Editor-in-Chief',
        isEditorInChief: true,
        order: 1,
      },
      {
        name: 'Dr. Michael Richardson',
        designation: 'Associate Professor of Finance',
        department: 'Department of Economics & Finance',
        institution: 'University of Westminster, London, United Kingdom',
        country: 'United Kingdom',
        role: 'International Advisory Board',
        order: 2,
      },
      {
        name: 'Dr. Priya Narayanan',
        designation: 'Professor of Management Studies',
        department: 'Department of Commerce and Management',
        institution: 'Loyola College, Chennai, India',
        country: 'India',
        role: 'Associate Editor',
        order: 3,
      },
      {
        name: 'Dr. Alok Kumar Mishra',
        designation: 'Senior Fellow in Applied Economics',
        department: 'School of Economics',
        institution: 'University of Hyderabad, Telangana, India',
        country: 'India',
        role: 'Associate Editor',
        order: 4,
      },
      {
        name: 'Dr. Elena Petrova',
        designation: 'Reader in International Business',
        department: 'Faculty of Economics & Social Sciences',
        institution: 'Prague University of Economics and Business, Czech Republic',
        country: 'Czech Republic',
        role: 'International Advisory Board',
        order: 5,
      },
      {
        name: 'Dr. Rajendra Prasad Sharma',
        designation: 'Associate Professor',
        department: 'Marketing Group',
        institution: 'Indian Institute of Foreign Trade (IIFT), New Delhi, India',
        country: 'India',
        role: 'Editorial Board Member',
        order: 6,
      },
    ],
  });

  // 8. Subscription Plans
  await prisma.subscriptionPlan.deleteMany({});
  await prisma.subscriptionPlan.createMany({
    data: [
      {
        title: 'Bi-Annual Individual Plan',
        planType: 'Individual',
        format: 'Online Access',
        duration: '6 Months (1 Issue)',
        priceInr: 2000,
        priceUsd: 75,
        featuresJson: JSON.stringify([
          'Full digital PDF downloads for 1 Issue',
          'Search & citation access',
          'Personal research use license',
          'Email publication alerts',
        ]),
        isPopular: false,
        order: 1,
      },
      {
        title: 'Bi-Annual Print + Online (Standard)',
        planType: 'Individual / Researcher',
        format: 'Print + Online',
        duration: '1 Year (2 Issues)',
        priceInr: 3500,
        priceUsd: 130,
        featuresJson: JSON.stringify([
          '2 Printed Journal Copies delivered by Post',
          'Full digital online archive access',
          'Official subscriber certificate',
          'Priority manuscript review voucher',
          'Free DOI indexing included',
        ]),
        isPopular: true,
        order: 2,
      },
      {
        title: 'Institutional & Library Annual',
        planType: 'Institutional / Library',
        format: 'Print + Multi-User Online',
        duration: '1 Year (2 Issues + Archives)',
        priceInr: 6500,
        priceUsd: 250,
        featuresJson: JSON.stringify([
          'Delivered directly to University/College Library',
          'Campus-wide IP authenticated online access',
          'Complete historical archive access',
          'Hardcover volume binder upon request',
          'Institutional GST invoice & receipt',
        ]),
        isPopular: false,
        order: 3,
      },
    ],
  });

  // 9. Announcements
  await prisma.announcement.deleteMany({});
  await prisma.announcement.createMany({
    data: [
      {
        title: 'CALL FOR PAPERS 2026 (July-December)',
        content: 'National Research Journal of Business Economics invites researchers to submit their original empirical manuscripts. Fast-track peer review and DOI assignment available.',
        linkUrl: '/submit-paper',
        badgeText: 'CALL FOR PAPERS',
        isTicker: true,
        priority: 1,
      },
      {
        title: 'Subscribe This Journal (Bi-Annual: ₹3500/-)',
        content: 'Protect intellectual property and support open research. Subscriptions open for educational institutions and researchers.',
        linkUrl: '/subscribe',
        badgeText: 'SUBSCRIPTION',
        isTicker: true,
        priority: 2,
      },
      {
        title: 'Publish Conference or Seminar Papers in Our Journal',
        content: 'Academic institutions seeking to publish peer-reviewed conference proceedings can contact our editorial office.',
        linkUrl: '/contact',
        badgeText: 'CONFERENCE',
        isTicker: true,
        priority: 3,
      },
    ],
  });

  // 10. Sister Journals from National Press Associates
  await prisma.sisterJournal.deleteMany({});
  await prisma.sisterJournal.createMany({
    data: [
      { name: 'NRJ of Sales and Marketing Management', url: 'https://nrjsmm.in/', category: 'Marketing', order: 1 },
      { name: 'NRJ of Human Resource Management', url: 'https://www.nrjhrm.in/', category: 'HR & Management', order: 2 },
      { name: 'NRJ of Banking and Finance Management', url: 'https://www.nrjbfm.in/', category: 'Banking & Finance', order: 3 },
      { name: 'Information Technology and Information Science', url: 'https://www.nrjitis.in/', category: 'Computer Science & IT', order: 4 },
      { name: 'Academe: Journal of Education and Psychology', url: 'https://academejournal.in/', category: 'Education & Psychology', order: 5 },
      { name: 'Research and Reviews in Biotechnology and Biosciences', url: 'https://www.biotechjournal.in/', category: 'Life Sciences', order: 6 },
      { name: 'Journal of Literary Aesthetics', url: 'https://literaryjournal.org/', category: 'Humanities & Literature', order: 7 },
      { name: 'National Research Journal of Social Science', url: 'https://nrjss.in/', category: 'Social Sciences', order: 8 },
      { name: 'Coherence Research Journal', url: 'https://coherencejournal.in/', category: 'Interdisciplinary', order: 9 },
      { name: 'Nehru School Management Journal (NSMJ)', url: 'https://nsmj.in/', category: 'Management Studies', order: 10 },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
