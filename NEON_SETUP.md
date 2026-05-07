# Neon Postgres Setup Guide

## ✅ You've Connected Neon!

Neon has automatically added these environment variables to your Vercel project:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Your Neon database connection string |
| `DATABASE_URL_UNPOOLED` | Direct connection (for migrations) |
| `PGHOST` | Database host |
| `PGUSER` | Database username |
| `PGPASSWORD` | Database password |
| `PGDATABASE` | Database name |

## Next Steps

### 1. Set Your NextAuth Secrets

Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**

Add these variables:

```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here
AUTH_SECRET=your-generated-secret-here
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 2. Deploy Your Project

```bash
git push origin main
```

Vercel will automatically:
1. Install dependencies
2. Run `prisma generate`
3. Run `prisma migrate deploy` (apply migrations to Neon)
4. Build and deploy your app

### 3. Create Your First Admin User

After deployment, you need to create an admin user. You have two options:

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Pull environment variables
vercel env pull .env.local

# Run Prisma Studio
npx prisma studio
```

Then manually create a user in the UI.

#### Option B: Create a Script

Create `scripts/seed-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('admin123', 10)
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@clockroster.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })
  
  console.log('Admin created:', admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run it:
```bash
npx tsx scripts/seed-admin.ts
```

## Troubleshooting

### Migration Fails
If migrations fail during build:
```bash
# Run manually with unpooled connection
DATABASE_URL="your-unpooled-url" npx prisma migrate deploy
```

### Connection Issues
Neon uses connection pooling by default. Your `DATABASE_URL` already includes pooling parameters.

### Build Timeouts
If the build times out during migration:
1. Run migrations locally first
2. Then push your code

## Local Development

To use your Neon database locally:

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Run dev server
npm run dev
```

Or keep using local PostgreSQL for development:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/clockroster"
```