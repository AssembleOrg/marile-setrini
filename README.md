# Marile Setrini Inmobiliaria

A production-ready real estate web application built with Next.js 16, Mantine UI, Supabase, and Prisma 7.

## Features

- 🏠 **Public Property Listings** - Browse properties with filters and pagination
- 🔍 **Smart Location Search** - Typeahead search with 4000+ Argentine localities
- 🎨 **Premium UI** - Modern design with smooth animations (Framer Motion)
- 🔐 **Admin Panel** - Protected CRUD for property management
- 📱 **Responsive** - Mobile-first design
- 🚀 **SEO Optimized** - Metadata, sitemap, robots.txt, JSON-LD
- 📧 **Contact Form** - Email notifications + WhatsApp integration

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: Mantine v8
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma 7
- **Auth**: Supabase Auth
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Supabase account

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Supabase Postgres)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Email (optional - for contact form)
EMAIL_PROVIDER=resend
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

```bash
# Install dependencies
pnpm install

# Allow Prisma build scripts (first time only)
pnpm approve-builds

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run development server
pnpm dev
```

### Database Setup

1. Create a Supabase project
2. Copy the connection string to `DATABASE_URL`
3. Run `npx prisma db push` to create tables
4. Enable RLS policies - see [docs/security.md](./docs/security.md)

### Create Admin User

1. Create a user in Supabase Auth (Dashboard > Authentication > Users)
2. Add them to the `AdminUser` table:

```sql
INSERT INTO "AdminUser" ("userId", "email")
VALUES ('auth-user-uuid', 'admin@example.com');
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin panel pages
│   ├── propiedades/       # Property pages
│   └── layout.tsx         # Root layout
├── src/
│   ├── domain/            # Entities, types
│   ├── application/       # Services
│   ├── infrastructure/    # DB, Auth, Email
│   └── presentation/      # Components, hooks, stores
├── prisma/
│   └── schema.prisma      # Database schema
└── docs/
    └── security.md        # RLS policies
```

## Scripts

```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Contact Info

- **Phone**: 011 4287-0216
- **WhatsApp**: +54 9 11 6397-5246
- **Facebook**: [@inmobiliaria.marile](https://www.facebook.com/inmobiliaria.marile/)
- **Instagram**: [@marile_setrini_inmobiliaria](https://www.instagram.com/marile_setrini_inmobiliaria)
- **Linktree**: [linktr.ee/marileSetrini](https://linktr.ee/marileSetrini)

## License

Private - Marile Setrini Inmobiliaria
