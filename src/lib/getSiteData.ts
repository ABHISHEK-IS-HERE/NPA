import { db } from '@/lib/db';

export async function getGlobalSiteData() {
  try {
    const [settings, navItems, sisterJournals, announcements] = await Promise.all([
      db.siteSetting.findFirst({ where: { id: 1 } }),
      db.navItem.findMany({
        where: { parentId: null, isActive: true },
        orderBy: { order: 'asc' },
        include: {
          children: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
          },
        },
      }),
      db.sisterJournal.findMany({
        orderBy: { order: 'asc' },
      }),
      db.announcement.findMany({
        where: { isActive: true, isTicker: true },
        orderBy: { priority: 'asc' },
      }),
    ]);

    return {
      settings: settings || {
        journalName: 'National Research Journal of Business Economics',
        shortName: 'NRJBE',
        tagline: 'An International Reputed Peer Reviewed Refereed Research Journal',
        issn: '2349-2015',
        impactFactor: '6.74',
        contactEmail: 'editornrjbe@gmail.com',
        contactPhone: '+91-9888934889',
        whatsappNumber: '919888934889',
        publisherName: 'National Press Associates',
        publisherUrl: 'https://npajournals.org',
        bannerText: 'CALL FOR PAPERS 2026 - Fast-Track Review & DOI Assignment',
        bannerActive: true,
      },
      navItems: navItems || [],
      sisterJournals: sisterJournals || [],
      announcements: announcements || [],
    };
  } catch (error) {
    console.error('Error fetching global site data:', error);
    return {
      settings: {} as any,
      navItems: [],
      sisterJournals: [],
      announcements: [],
    };
  }
}
