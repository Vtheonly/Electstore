# ElectroMaison

Welcome to ElectroMaison, your go-to e-commerce platform for high-quality home appliances.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Supabase](https://supabase.io/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

### 1. Setup Environment Variables

Create a `.env.local` file in the root of the project and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 2. Install Dependencies

Install all the project dependencies using npm:

```bash
npm install
```

### 3. Generate Supabase Types

Generate TypeScript types from your Supabase schema. Make sure to replace `YOUR_PROJECT_ID` in the `package.json` script first.

```bash
npm run supabase:types
```

### 4. Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Runs the linter.
