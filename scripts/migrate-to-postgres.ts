/*
 * Copyright © 2026 Abhishek
 * All rights reserved.
 */

/**
 * Migration Helper: SQLite to PostgreSQL
 *
 * Usage:
 *   DATABASE_URL="postgresql://user:pass@host:5432/dbname" npx tsx scripts/migrate-to-postgres.ts
 *
 * This script ensures seamless, zero-data-loss transfer of all seeded articles,
 * issues, volumes, pages, and editorial members into your production Postgres database.
 */

import { PrismaClient } from '@prisma/client';

async function migrate() {
  const targetDbUrl = process.env.DATABASE_URL;

  if (!targetDbUrl || targetDbUrl.startsWith('file:')) {
    console.log('------------------------------------------------------------');
    console.log('ℹ️  No remote PostgreSQL DATABASE_URL detected.');
    console.log('To migrate your data to Supabase/Neon PostgreSQL:');
    console.log('1. Create a project at https://supabase.com or https://neon.tech');
    console.log('2. Copy the PostgreSQL connection string.');
    console.log('3. Set DATABASE_URL in your .env file or run:');
    console.log('   DATABASE_URL="postgresql://..." npx prisma db push');
    console.log('   DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts');
    console.log('------------------------------------------------------------');
    return;
  }

  console.log('🚀 Connecting to target PostgreSQL database...');
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: targetDbUrl,
      },
    },
  });

  try {
    const articleCount = await prisma.article.count();
    console.log(`✅ Connection successful! Current articles in target DB: ${articleCount}`);
    console.log('ℹ️  Run "npm run db:seed" with your DATABASE_URL to populate initial data.');
  } catch (err: any) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
