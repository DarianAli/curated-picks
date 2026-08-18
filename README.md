# Curated Picks

### ROLE & SYSTEM INSTRUCTION

Act as a Principal Full-Stack Developer and Lead UI/UX Designer. Build a production-ready, ultra-fast, and accessible Amazon Affiliate product platform. Focus on an editorial e-commerce aesthetic (like Wirecutter or Kinfolk), modular React architecture, Tailwind CSS styling, and seamless Supabase integration for data and authentication.

---

### 1. TECH STACK & ARCHITECTURE

- **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons, Shadcn UI / Radix primitives.

- **Backend & Auth:** Supabase PostgreSQL, Supabase Auth (Email/Password for Admin).

- **Validation:** Zod schemas for form inputs and external affiliate URLs.

- **Performance:** Minimal JavaScript, lazy-loaded images, strict semantic HTML.

---

### 2. DESIGN SYSTEM & UI/UX SPECIFICATIONS

- **Visual Style:** Clean editorial e-commerce layout. Neutral canvas with high contrast, crisp typography, generous whitespace, and zero clutter.

- **Color Palette:**

  - Background: Neutral/Slate (`bg-slate-50` or `bg-white`)

  - Text: Dark Charcoal (`text-slate-900`) and Muted Gray (`text-slate-500`)

  - Accents: Deep Amber/Emerald for CTAs (`bg-amber-600` or `bg-emerald-600`)

- **Typography:** Inter or Sans-serif clean typeface with strict scale hierarchy.

- **Key Components:**

  - `ProductCard`: Displays product image, category badge, title, key pros/cons summary, price indicator, and affiliate CTA button.

  - `AffiliateButton`: Distinct primary CTA button labeled *"Check Price on Amazon"* or *"View Recommendation"* with external icon and mandatory security attributes (`rel="nofollow noopener noreferrer"`).

  - `AffiliateDisclaimer`: Floating banner or sticky footer element declaring Amazon Associates participation.

---

### 3. DATABASE SCHEMA & SUPABASE SETUP (SQL)

Execute this schema in Supabase with Row Level Security (RLS) pre-configured:

```sql

-- Categories Table

CREATE TABLE categories (

  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  name TEXT NOT NULL,

  slug TEXT UNIQUE NOT NULL,

  description TEXT,

  created_at TIMESTAMPTZ DEFAULT now()

);

-- Products Table

CREATE TABLE products (

  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  title TEXT NOT NULL,

  slug TEXT UNIQUE NOT NULL,

  short_description TEXT NOT NULL,

  description TEXT NOT NULL,

  image_url TEXT NOT NULL,

  affiliate_url TEXT NOT NULL,

  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  pros TEXT[] DEFAULT '{}',

  cons TEXT[] DEFAULT '{}',

  is_featured BOOLEAN DEFAULT false,

  is_published BOOLEAN DEFAULT true,

  seo_title TEXT,

  seo_description TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),

  updated_at TIMESTAMPTZ DEFAULT now()

);

-- Indexes for Speed

CREATE INDEX idx_products_slug ON products(slug);

CREATE INDEX idx_products_category ON products(category_id);

CREATE INDEX idx_products_published ON products(is_published);

-- Row Level Security (RLS)

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public READ policy

CREATE POLICY "Allow public read access to published products" 

ON products FOR SELECT USING (is_published = true);

CREATE POLICY "Allow public read access to categories" 

ON categories FOR SELECT USING (true);

-- Admin WRITE policy (Authenticated users)

CREATE POLICY "Allow authenticated full access to products" 

ON products FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated full access to categories" 

ON categories FOR ALL USING (auth.role() = 'authenticated');

4. CORE PAGE & FEATURE BREAKDOWN

A. Public Pages

Homepage (/)

Hero Section: Clear value proposition ("Expertly Tested & Recommended Gear") + Search bar.

Featured Pick Section: Highlighted product card with visual badge ("Editor's Choice").

Category Grid: Visual category cards linking to filtered lists.

Trust Section: "Why Trust Our Reviews" horizontal grid.

FAQ Accordion: Answers regarding affiliate disclosure and review methodology.

Footer: Amazon Associate disclosure statement + privacy policy links.

Product Catalog Page (/products)

Live search input + category dropdown filter + sorting options (Newest, Featured).

Responsive product grid with state handling (Loading skeleton, Empty result state).

Client-side or dynamic pagination.

Product Detail Page (/products/:slug)

Breadcrumb navigation (Home > Category > Product Name).

Split layout: Product image preview (left) vs. Product details & primary CTA (right).

Structured Pros & Cons comparison block.

Detailed review content section.

"Related Products" recommendation carousel/grid at the bottom.

B. Admin Dashboard (Protected Route: /admin)

Admin Login Page (/admin/login): Email/Password authentication using Supabase Auth.

Dashboard Overview (/admin): Quick stats (Total products, Active categories, Featured count).

Product Management (/admin/products):

Data table displaying image thumbnail, title, category, published status toggle, and actions (Edit/Delete).

Product Add/Edit Form using Zod validation:

Inputs: Title, Slug (auto-generated), Short Description, Full Description, Image URL, Affiliate URL (validated for HTTPS/Amazon domain), Category selector, Pros (array), Cons (array), Is Featured toggle, Is Published toggle.

Category Management (/admin/categories): Simple CRUD list for managing product categories.

5. SECURITY & COMPLIANCE RULES

Affiliate Link Sanitization: Force all outbound affiliate links to open in a new tab with target="_blank" rel="nofollow noopener noreferrer".

Amazon Compliance: Display the mandatory statement across all pages: "As an Amazon Associate, I earn from qualifying purchases."

URL Validation: Validate all input URLs in admin forms using Zod to prevent protocol injection (javascript:, data:).

6. EXECUTION STEPS FOR LOVABLE

Please build this application step-by-step:

Step 1: Set up the basic layout, navigation header, footer with Amazon disclosure, and design tokens/Tailwind theme.

Step 2: Build the public components (ProductCard, Hero, CategoryFilter, AffiliateButton).

Step 3: Implement the Homepage and Product Listing page with mock data first.

Step 4: Integrate Supabase Database client for fetching products and categories dynamically.

Step 5: Create the /admin protected dashboard, including Auth flow and Product CRUD form with validation.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b5b954a3-58b2-46ee-acc7-c16b197ca7cf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
