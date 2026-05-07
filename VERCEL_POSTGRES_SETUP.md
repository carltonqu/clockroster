# Vercel Postgres Setup Guide

## Step 1: Add Vercel Postgres to Your Project

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Storage** tab
3. Click **Connect Database** → **Vercel Postgres**
4. Choose your region (pick one closest to your users)
5. Click **Create**

## Step 2: Environment Variables (Auto-Configured)

Vercel will automatically add these environment variables to your project:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Pooled connection string (for app queries) |
| `DATABASE_URL_UNPOOLED` | Direct connection string (for migrations) |
| `POSTGRES_URL` | Alternative pooled connection |
| `POSTGRES_PRISMA_URL` | Prisma-specific pooled connection |
| `POSTGRES_URL_NON_POOLING` | Non-pooled connection |
| `POSTGRES_USER` | Database username |
| `POSTGRES_HOST` | Database host |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_DATABASE` | Database name |

## Step 3: Set Required Secrets

In your Vercel Dashboard, go to **Settings** → **Environment Variables** and add:

```
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-generated-secret
AUTH_SECRET=your-generated-secret
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Step 4: Deploy

Push your code to GitHub and Vercel will automatically:
1. Install dependencies
2. Run `prisma generate`
3. Run `prisma migrate deploy` (apply database migrations)
4. Build the Next.js app

## Step 5: Create Initial Admin User

After deployment, you need to create your first admin user. You can do this by:

### Option A: Using Prisma Studio (Local)
```bash
# Connect to your Vercel Postgres locally
vercel env pull .env.local
npx prisma studio
```

### Option B: Using a Seed Script
Create `scripts/create-admin.ts`:
```typescript
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

async function main() {
  const hashedPassword = await hash("your-admin-password", 10);
  
  await prisma.user.create({
    data: {
      email: "admin@yourcompany.com",
      name: "Admin User",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  
  console.log("Admin user created!");
}

main();
```

Run it:
```bash
npx tsx scripts/create-admin.ts
```

## Troubleshooting

### Migration Failures
If migrations fail during build, check:
1. DATABASE_URL_UNPOOLED is set correctly
2. Your Prisma schema uses `directUrl = env("DATABASE_URL_UNPOOLED")`

### Connection Issues
- Use `DATABASE_URL` (pooled) for application queries
- Use `DATABASE_URL_UNPOOLED` (direct) for migrations only

### Build Timeouts
If builds timeout during migration:
1. Run migrations locally first: `npx prisma migrate deploy`
2. Or use Vercel CLI: `vercel --prod`

## Local Development with Vercel Postgres

To use your Vercel Postgres database locally:

```bash
# Pull environment variables
vercel env pull .env.local

# Run dev server
npm run dev
```

Or keep using local PostgreSQL for development and only use Vercel Postgres for production.