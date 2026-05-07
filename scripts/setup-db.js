#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('Setting up database...');

try {
  // Generate Prisma client
  console.log('1. Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema
  console.log('2. Pushing database schema...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  
  // Seed database
  console.log('3. Seeding database...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup complete!');
  console.log('\nDefault login:');
  console.log('Email: admin@clockroster.com');
  console.log('Password: admin123');
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  process.exit(1);
}
