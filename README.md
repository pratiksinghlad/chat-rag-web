# SSO App

A secure Single Sign-On (SSO) application built with React, TypeScript, Vite, and Supabase Auth. Supports authentication via **Microsoft (Azure AD)**, **Google**, and **GitHub** OAuth providers.

![SSO App](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue) ![Vite](https://img.shields.io/badge/Vite-5.4-purple) ![Supabase](https://img.shields.io/badge/Supabase-Auth-green)

## Features

- 🔐 **OAuth Authentication** - Sign in with Google, Microsoft, or GitHub
- 👤 **User Profile Display** - Shows name, email, and avatar after login
- 🎨 **Modern UI** - Dark theme with glassmorphism and smooth animations
- 📱 **Responsive Design** - Mobile-first, works on all devices
- ♿ **Accessible** - Keyboard navigable, screen reader friendly
- 🔒 **Secure** - Environment variables, no secrets in client bundles
- ⚡ **Fast** - Vite-powered development and optimized production builds

## Table of Contents

- [Quick Start](#quick-start)
- [Supabase Setup (Step-by-Step)](#supabase-setup-step-by-step)
- [OAuth Provider Configuration](#oauth-provider-configuration)
- [Environment Variables](#environment-variables)
- [GitHub Actions & Secrets](#github-actions--secrets)
- [Running Locally](#running-locally)
- [Testing Checklist](#testing-checklist)
- [Security Notes](#security-notes)
- [Project Structure](#project-structure)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/sso-app.git
cd sso-app

# 2. Install dependencies
npm install

# 3. Copy environment example
cp .env.local.example .env.local

# 4. Edit .env.local with your Supabase credentials (see below)

# 5. Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Supabase Setup (Step-by-Step)

### Step 1: Create a Supabase Account & Project

1. Go to [supabase.com](https://supabase.com) and click **Start your project**
2. Sign in with GitHub (recommended) or email
3. Click **New Project**
4. Fill in:
   - **Name**: `sso-app` (or your preferred name)
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose the closest to your users
5. Click **Create new project** and wait 2-3 minutes for provisioning

### Step 2: Get Your API Keys

1. Once your project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:

   | Setting         | Where to find            | Copy to                  |
   | --------------- | ------------------------ | ------------------------ |
   | **Project URL** | Under "Project URL"      | `VITE_SUPABASE_URL`      |
   | **anon public** | Under "Project API Keys" | `VITE_SUPABASE_ANON_KEY` |

4. Paste these into your `.env.local` file:

   ```env
   VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Step 3: Configure Redirect URLs

1. Go to **Authentication** > **URL Configuration** in your Supabase dashboard
2. Set the following:

   | Setting           | Value                            |
   | ----------------- | -------------------------------- |
   | **Site URL**      | `http://localhost:5173`          |
   | **Redirect URLs** | Add all of these (one per line): |

   ```
   http://localhost:5173
   http://localhost:5173/
   http://localhost:5173/home
   https://yourdomain.com
   https://yourdomain.com/
   https://yourdomain.com/home
   ```

   > ⚠️ **Important**: Add your production domain when you deploy!

---

## OAuth Provider Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application**
6. Add **Authorized redirect URIs**:

   ```
   https://abcdefghijk.supabase.co/auth/v1/callback
   ```

   (Replace `abcdefghijk` with your Supabase project reference)

7. Copy **Client ID** and **Client Secret**
8. In Supabase: **Authentication** > **Providers** > **Google**
   - Toggle **Enable Google provider**
   - Paste Client ID and Client Secret
   - Click **Save**

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** > **New OAuth App**
3. Fill in:
   - **Application name**: `SSO App`
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**:
     ```
     https://abcdefghijk.supabase.co/auth/v1/callback
     ```
4. Click **Register application**
5. Copy **Client ID** and generate a **Client Secret**
6. In Supabase: **Authentication** > **Providers** > **GitHub**
   - Toggle **Enable GitHub provider**
   - Paste Client ID and Client Secret
   - Click **Save**

### Microsoft (Azure AD) OAuth Setup

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Fill in:
   - **Name**: `SSO App`
   - **Supported account types**: **IMPORTANT - Choose carefully!**

     | Option                                                                     | Description                                  | Tenant URL to use |
     | -------------------------------------------------------------------------- | -------------------------------------------- | ----------------- |
     | "Accounts in any organizational directory and personal Microsoft accounts" | Work/School + Personal accounts              | `common`          |
     | "Accounts in any organizational directory"                                 | Work/School accounts only                    | `organizations`   |
     | "Personal Microsoft accounts only"                                         | Personal accounts only (Outlook, Xbox, etc.) | `consumers`       |
     | "Accounts in this organizational directory only"                           | Single tenant (your org)                     | Your Tenant ID    |

   - **Redirect URI**: Select **Web** and enter:
     ```
     https://abcdefghijk.supabase.co/auth/v1/callback
     ```

5. Click **Register**
6. Copy the **Application (client) ID**
7. Go to **Certificates & secrets** > **New client secret**
   - Add a description and expiration
   - Copy the **Value** (not the ID!)
8. In Supabase: **Authentication** > **Providers** > **Azure**
   - Toggle **Enable Azure provider**
   - Paste Application ID as Client ID
   - Paste Client Secret Value as Client Secret
   - **Azure Tenant URL**: Must match your app registration's "Supported account types":
     - `https://login.microsoftonline.com/common` → For "any organizational directory AND personal"
     - `https://login.microsoftonline.com/organizations` → For "any organizational directory" only
     - `https://login.microsoftonline.com/consumers` → For "Personal Microsoft accounts only"
     - `https://login.microsoftonline.com/YOUR_TENANT_ID` → For single tenant
   - Click **Save**

#### ⚠️ Common Azure Error: "userAudience configuration"

If you see this error:

```
The request is not valid for the application's 'userAudience' configuration.
In order to use /common/ endpoint, the application must not be configured with 'Consumer'.
```

**This means your Azure app and Supabase tenant URL don't match!**

**Fix Option 1** (Recommended): Update Azure App Registration

1. Azure Portal → App registrations → Your app → **Authentication**
2. Change "Supported account types" to **"Accounts in any organizational directory and personal Microsoft accounts"**
3. Save

**Fix Option 2**: Update Supabase Tenant URL

1. Supabase Dashboard → Authentication → Providers → Azure
2. Change Azure Tenant URL to `https://login.microsoftonline.com/consumers`
3. Save

---

## Environment Variables

### Local Development (`.env.local`)

Create a `.env.local` file in the project root:

```env
# Required - Public Supabase keys (safe for client)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key

# Optional - Server only (NEVER prefix with VITE_)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Security Rules

| Variable                    | Prefix  | Client Bundle   | Safe to Expose         |
| --------------------------- | ------- | --------------- | ---------------------- |
| `VITE_SUPABASE_URL`         | `VITE_` | ✅ Included     | ✅ Yes                 |
| `VITE_SUPABASE_ANON_KEY`    | `VITE_` | ✅ Included     | ✅ Yes (relies on RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | None    | ❌ Not included | ❌ NO! Server only     |

---

## GitHub Actions & Secrets

### Setting Up Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add these secrets:

   | Secret Name              | Value                         |
   | ------------------------ | ----------------------------- |
   | `VITE_SUPABASE_URL`      | Your Supabase project URL     |
   | `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

### How Secrets Are Used

The GitHub Actions workflow (`.github/workflows/ci.yml`) injects secrets during build:

```yaml
- name: Build application
  run: npm run build
  env:
    VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
```

Vite replaces `import.meta.env.VITE_*` references with actual values at build time.

### Alternative: File-Based Env (for complex setups)

If you need to create an env file during CI:

```yaml
- name: Create .env.production
  run: |
    cat << EOF > .env.production
    VITE_SUPABASE_URL=${{ secrets.VITE_SUPABASE_URL }}
    VITE_SUPABASE_ANON_KEY=${{ secrets.VITE_SUPABASE_ANON_KEY }}
    EOF
  # Note: Use 'cat' instead of 'echo' to avoid logging secrets
```

---

## Running Locally

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) with hot reload.

### Production Build

```bash
npm run build
npm run preview
```

### Available Scripts

| Script            | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start development server         |
| `npm run build`   | Build for production             |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint                       |

---

## Testing Checklist

### Manual E2E Test Plan

#### Prerequisites

- [ ] `.env.local` configured with valid Supabase credentials
- [ ] At least one OAuth provider configured in Supabase dashboard
- [ ] Redirect URLs configured in Supabase

#### Landing Page Tests

- [ ] App loads at `http://localhost:5173`
- [ ] Three OAuth buttons visible (Google, GitHub, Microsoft)
- [ ] Buttons are keyboard-focusable (Tab navigation)
- [ ] Loading states work when clicking sign-in buttons

#### Google Sign-In Flow

- [ ] Click "Continue with Google"
- [ ] Redirects to Google OAuth page
- [ ] After consent, redirects back to app
- [ ] User lands on `/home` page
- [ ] User's **name** is displayed prominently
- [ ] User's **email** is displayed prominently
- [ ] User's **avatar** is shown (or fallback initials)

#### GitHub Sign-In Flow

- [ ] Click "Continue with GitHub"
- [ ] Redirects to GitHub OAuth page
- [ ] After authorization, redirects back to app
- [ ] User info displayed correctly on home page

#### Microsoft Sign-In Flow

- [ ] Click "Continue with Microsoft"
- [ ] Redirects to Microsoft login page
- [ ] After sign-in, redirects back to app
- [ ] User info displayed correctly on home page

#### Sign-Out Flow

- [ ] Click "Sign Out" button in header
- [ ] Redirects to landing page
- [ ] Session is cleared (refresh stays on landing)

#### Responsive Design

- [ ] Test on mobile viewport (375px width)
- [ ] Test on tablet viewport (768px width)
- [ ] Test on desktop viewport (1280px width)
- [ ] All elements readable and accessible

#### Accessibility

- [ ] All buttons have visible focus states
- [ ] Tab order is logical
- [ ] Screen reader can announce button labels
- [ ] Color contrast meets WCAG AA

---

## Security Notes

### What's Safe in Client Bundles

1. **`VITE_SUPABASE_URL`**: Public project URL, known to anyone using your app
2. **`VITE_SUPABASE_ANON_KEY`**: Designed for client-side use with Row Level Security (RLS)

### What Must Stay Server-Side

1. **`SUPABASE_SERVICE_ROLE_KEY`**: Bypasses RLS, full database access
   - Only use in serverless functions (Vercel, Netlify Functions)
   - Backend services
   - Never prefix with `VITE_`

### Best Practices

- ✅ Enable Row Level Security (RLS) on all tables
- ✅ Use the anon key for all client operations
- ✅ Validate user sessions server-side for sensitive operations
- ✅ Regularly rotate keys if compromised
- ❌ Never commit `.env.local` to git
- ❌ Never put `SUPABASE_SERVICE_ROLE_KEY` in client code

---

## Project Structure

```
sso-app/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI workflow
├── public/
│   └── vite.svg                # App favicon
├── src/
│   ├── components/
│   │   ├── LoadingSpinner.tsx  # Loading indicator
│   │   ├── OAuthButton.tsx     # OAuth sign-in buttons
│   │   └── UserCard.tsx        # User profile display
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state management
│   ├── lib/
│   │   └── supabase.ts         # Supabase client initialization
│   ├── pages/
│   │   ├── Home.tsx            # Authenticated user home
│   │   └── Landing.tsx         # Login page
│   ├── styles/
│   │   ├── index.css           # Global styles
│   │   ├── Home.css            # Home page styles
│   │   ├── Landing.css         # Landing page styles
│   │   ├── LoadingSpinner.css  # Spinner styles
│   │   ├── OAuthButton.css     # Button styles
│   │   └── UserCard.css        # Card styles
│   ├── types/
│   │   ├── auth.ts             # Auth type definitions
│   │   └── database.ts         # Database type definitions
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── vite-env.d.ts           # Vite types
├── .env.local.example          # Environment template
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point
├── package.json                # Dependencies
├── README.md                   # This file
├── tsconfig.json               # TypeScript config
├── tsconfig.node.json          # Node TypeScript config
└── vite.config.ts              # Vite configuration
```

---

## Troubleshooting

### "Missing VITE_SUPABASE_URL" Error

Ensure you have created `.env.local` with valid credentials. Restart the dev server after changes.

### OAuth Redirect Not Working

1. Check redirect URLs in Supabase dashboard match your app URL exactly
2. Include trailing slashes if your app uses them
3. For production, add your deployed domain

### "Invalid API Key" Error

1. Verify you copied the `anon` key, not the `service_role` key
2. Check for extra whitespace in your `.env.local`
3. Ensure the key starts with `eyJ` (JWT format)

### User Data Not Showing

Different OAuth providers return different metadata fields. The app handles common variations:

- Google: `full_name`, `picture`
- GitHub: `name`, `avatar_url`
- Microsoft: `name`, `picture`

---

## License

MIT License - feel free to use this for any project!

---

Built with ❤️ using [React](https://react.dev), [Vite](https://vitejs.dev), and [Supabase](https://supabase.com)
