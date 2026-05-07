# Database Setup Instructions

## For Vercel Deployment

### Step 1: Set Environment Variables
In your Vercel project settings, add these environment variables:

- `DATABASE_URL` - Your PostgreSQL connection string
- `NEXTAUTH_SECRET` - A random secret (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

### Step 2: Deploy the App
Push to GitHub and Vercel will auto-deploy.

### Step 3: Setup Database Schema
After first deployment, run this command locally with your production database URL:

```bash
# Set your production database URL
export DATABASE_URL="your-production-database-url"

# Push schema and seed
npx prisma db push --accept-data-loss
npx tsx prisma/seed.ts
```

Or use the setup script:
```bash
node scripts/setup-db.js
```

### Step 4: Seed via API (Alternative)
You can also seed by calling the API endpoint:

```bash
curl -X POST https://your-app.vercel.app/api/seed
```

### Step 5: Login
Use these default credentials:
- Email: `admin@clockroster.com`
- Password: `admin123`

## Local Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL

# Setup database
npm run db:push
npm run db:seed

# Run dev server
npm run dev
```
