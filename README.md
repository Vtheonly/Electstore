# ElectroMaison - E-Commerce Platform

A modern e-commerce platform for home appliances built with Next.js, Supabase, and TypeScript.

## 🚀 Features Implemented

### ✅ Core Functionality

- [x] **Currency System**: All prices displayed in DZD (Algerian Dinar) with proper formatting
- [x] **Shopping Cart**: Full cart functionality with localStorage persistence
  - Add/remove items
  - Update quantities
  - Real-time cart total
  - Cart drawer with item count badge
- [x] **Product Pages**:
  - Product listing with category filtering
  - Individual product detail pages
  - Stock management
  - Dynamic pricing with discounts
- [x] **Contact Form**: Email integration with Resend API
- [x] **Admin Panel**: Full admin dashboard with authentication
  - Protected routes
  - Product management (CRUD operations)
  - Dashboard with stats

### ✅ Supabase Integration

- [x] **Database**: PostgreSQL with Row Level Security (RLS)
  - Products table with full schema
  - Tags system (ready for implementation)
  - User profiles with role management
- [x] **Authentication**: Supabase Auth for admin access
- [x] **Storage**: Configured for product images (bucket setup required)

### 🔨 In Progress / To Do

- [ ] Tags implementation on products
- [ ] Google Maps / OpenStreetMap integration on contact page
- [ ] Image migration from public/images to Supabase Storage
- [ ] Product edit functionality
- [ ] Image upload component for admin panel

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account (free tier works)
- Resend API key (for emails)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd /home/mersel/Documents/Projects/Elect
npm install
```

### 2. Environment Variables

Your environment variables are already configured in:

- `.env.development`
- `.env.local`
- `.env.production`

Current configuration:

- ✅ Supabase URL and Keys
- ✅ Resend API Key

### 3. Database Setup

**Important**: You must run the database migration before the app will work properly:

1. Go to your Supabase Dashboard: https://jaadytgfzeptzrvykptv.supabase.co
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run in the SQL Editor

This will create:

- Products table with sample DZD data
- Tags table
- User profiles table
- Row Level Security policies
- Sample products (6 items with DZD pricing)

### 4. Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Create a new bucket named `product-images`
3. Make it **public**
4. Set upload policies (see `supabase/DATABASE_SETUP.md`)

### 5. Create Admin User

After running the migration:

1. Sign up through the app or Supabase Auth dashboard
2. Get your user UUID from Authentication > Users
3. Run this SQL to make yourself admin:

```sql
INSERT INTO user_profiles (id, role)
VALUES ('YOUR_USER_UUID_HERE', 'admin');
```

### 6. Run Development Server

```bash
npm run dev
```

Visit:

- **Main Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Products**: http://localhost:3000/produits
- **Contact**: http://localhost:3000/contact

## 📁 Project Structure

```
├── app/
│   ├── (site)/           # Public-facing pages
│   │   ├── page.tsx      # Home page (✅ Supabase integrated)
│   │   ├── produits/     # Products listing & detail
│   │   ├── contact/      # Contact form (✅ Email working)
│   │   └── a-propos/     # About page
│   ├── admin/            # Admin panel
│   │   ├── login/        # Admin authentication
│   │   ├── dashboard/    # Admin dashboard
│   │   └── products/     # Product management
│   └── api/              # API routes
│       ├── send-email/   # Contact form handler
│       └── auth/         # Authentication endpoints
├── components/
│   ├── cart/             # Cart drawer & items
│   ├── shared/           # Navbar, Footer, ProductCard
│   └── ui/               # Reusable UI components
├── lib/
│   ├── supabase/         # Supabase client & queries
│   ├── auth/             # Auth helpers
│   ├── currency.ts       # DZD formatting
│   └── constants.ts      # App constants
├── contexts/
│   └── CartContext.tsx   # Global cart state
├── types/                # TypeScript definitions
└── supabase/
    ├── migrations/       # Database migrations
    └── DATABASE_SETUP.md # Setup guide
```

## 💰 Currency System

All prices are in **DZD (Algerian Dinar)**:

- Format: `12,500 DZD`
- Sample conversion used: 1 EUR ≈ 131.5 DZD
- Utility function: `formatCurrency(number)` in `lib/currency.ts`

## 🛒 Using the Cart

1. Browse products on `/produits`
2. Click "Ajouter au panier" on any product
3. Cart drawer opens automatically
4. View cart count in navbar
5. Adjust quantities or remove items
6. Cart persists across page refreshes

## 👨‍💼 Admin Features

### Access Admin Panel

1. Go to `/admin/login`
2. Login with your admin credentials
3. You'll be redirected to the dashboard

### Manage Products

- **View All**: `/admin/products` - See all products with edit/delete options
- **Create New**: `/admin/products/new` - Add new products
- **Edit**: Click edit icon on any product (to be implemented)
- **Delete**: Click delete icon with confirmation

### Product Fields

- Name, Description
- Price (DZD) and Original Price
- Category selection
- Stock quantity
- Featured flag (shows on home page)
- Image URL (Supabase Storage or external)

## 📧 Email Configuration

The contact form uses **Resend API**:

- API Key is configured
- Sends to: `contact@electromaison.fr`
- Template includes customer info and message

**Note**: Change the `from` address in `/app/api/send-email/route.ts` to your verified domain.

## 🗄️ Database Schema

### Products Table

```sql
- id: UUID (primary key)
- name: TEXT
- description: TEXT
- price: DECIMAL(10,2) in DZD
- original_price: DECIMAL(10,2) (optional)
- category: TEXT
- image_url: TEXT
- stock: INTEGER
- featured: BOOLEAN
- created_at, updated_at: TIMESTAMP
```

### Sample Products Included

- Réfrigérateur LG 450L - 91,875 DZD
- Réfrigérateur Samsung 380L - 71,000 DZD
- Lave-linge Bosch 8kg - 58,500 DZD
- TV Samsung 55" 4K - 105,000 DZD
- TV LG 65" OLED - 171,000 DZD
- Lave-linge Whirlpool 10kg - 78,750 DZD

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- **Public read access** for products
- **Admin-only write access** for products
- **Protected admin routes** via middleware
- **Authentication** via Supabase Auth

## 🐛 Troubleshooting

### Products not showing?

- Ensure database migration is run
- Check Supabase connection in browser console

### Can't login as admin?

- Verify user profile exists with role='admin'
- Check Supabase Auth dashboard

### Images not loading?

- Verify domain is added to `next.config.mjs`
- Check image URLs are valid

### Email not sending?

- Verify Resend API key in .env
- Check from/to addresses
- View logs in terminal

## 🚧 Next Steps

1. **Run the database migration** (critical!)
2. **Create your admin user**
3. **Add products via admin panel**
4. **Test the cart and checkout flow**
5. **Configure email "from" address**
6. **Upload product images to Supabase Storage**
7. **Implement tags system**
8. **Add map to contact page**

## 📝 Notes

- Dev server already running on port 3000
- Hot reload enabled for fast development
- TypeScript for type safety
- Tailwind CSS for styling

## 🆘 Support

For issues:

1. Check `supabase/DATABASE_SETUP.md`
2. Review terminal logs
3. Check browser console
4. Verify .env variables

---

**Built with**: Next.js 15, Supabase, TypeScript, Tailwind CSS, Resend
**Deployed on**: Vercel-ready
