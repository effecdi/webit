# WE:VE - Couple Lifecycle Super App

## Overview

WE:VE is a Korean mobile-first super app designed to support couples through their entire relationship journey: dating, wedding planning, and family life. It offers mode-specific features such as shared calendars, photo galleries, budget tracking, checklists, and digital wedding invitations. The app aims to provide a comprehensive, integrated platform for couples, adapting its theme and functionalities to each stage of their relationship.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
The application is built with **Next.js 16** using the App Router and React Server Components, leveraging **TypeScript** for type safety. The UI is constructed using **shadcn/ui** components with the New York style variant and **Radix UI** primitives for accessibility. Styling is managed with **Tailwind CSS**, custom CSS variables for theming, and **Lucide React** for iconography, incorporating a unique brutalist-inspired shadow system. Three distinct mode-specific color schemes are implemented: pink for Dating, blue for Wedding, and green for Family. Korean typography is handled via the Pretendard font.

### Dark Mode
The app supports **system-level dark/light mode** via `next-themes` with `defaultTheme="system"`. The ThemeProvider is configured in the root layout with `attribute="class"` so the `.dark` class is applied to `<html>` when the device is in dark mode. Dark mode is implemented via:
- CSS custom variables in `.dark` selector (in `globals.css`)
- Global CSS overrides that target Tailwind arbitrary value classes (e.g., `.dark .bg-white`, `.dark .bg-\[\#F2F4F6\]`, `.dark .text-\[\#191F28\]`)
- Bottom nav components use `useTheme()` hook for inline style dark mode adaptation
- No manual toggle is provided — the app follows the device's system setting automatically

### Backend and Database
**PostgreSQL** is used as the database, accessed through **Drizzle ORM** for type-safe operations. API routes follow a RESTful pattern (`/app/api/{resource}/route.ts`) supporting standard CRUD operations. User authentication is handled via **Replit Auth OIDC**, supporting Google, Apple, and GitHub logins, with PostgreSQL-backed sessions.

### Key Features
- **Mode Lifecycle Progression**: Dating → Wedding → Family. Dating mode shows [연애, 결혼] switches. Clicking 결혼 triggers wedding survey + congratulations modal (first time only). Wedding mode shows [결혼, 가족] switches. When wedding D-day+1 arrives, auto-transitions to Family mode with congratulations modal. Family mode shows only [가족]. All historical data (todos, events, photos) from dating and wedding modes is preserved and accessible in family mode.
- **Dating Mode**: Includes couple calendars, photo galleries, todo lists, and D-day tracking.
- **Wedding Mode**: Features budget tracking, checklist management, a digital invitation editor with RSVP functionality, vendor management, and a guest manager. It offers a range of invitation templates, some requiring a premium subscription. AI recommendations (via OpenAI) assist in generating invitation content. Wedding Goods page includes a "제작 가이드" tab with information about creating wedding posters, mirrors, and frames (professional ordering and DIY).
- **Family Mode**: Provides a memory archive with animated photo displays, a shared calendar, photo organization, and todo lists (inheriting all dating/wedding todos). Family congratulations modal shows on first entry after D-day transition.
- **Community Feature**: Each mode (Dating, Wedding, Family) has a dedicated community section where users can share concerns, exchange information, and interact. Features include categorized posts, comments, likes, and post creation. Community is accessible via the bottom navigation bar in each mode.
- **Travel Module**: A shared feature across all modes for trip planning, including schedules, checklists, and budget tracking.
- **Subscription System**: A two-tier membership model (Advanced and Premium) offers enhanced features like ad-free experience, unlimited storage, and AI recommendations for Dating and Family modes. Wedding mode features are not tied to this subscription.
- **Anniversary & Birthday Reminders**: The app tracks relationship milestones and birthdays, providing timely reminders and gift shopping suggestions.

### Invitation Layout Architecture
The invitation editor utilizes a `LayoutRenderer` pattern, allowing the dynamic rendering of nine unique invitation layout sub-components (e.g., Cinematic, Modern, Classic, Magazine, Polaroid, Chat, Traditional, Garden, Gallery). Each layout provides a complete JSX structure for all invitation sections, with shared state and logic extracted into a `usePreviewState` hook.

### Invitation Sharing System
- Each invitation has a unique `shareId` (hex string) stored in the `invitations` table
- Shared invitations are accessible at `/s/{shareId}` without authentication
- Public API: `GET /api/shared/invitation?id={shareId}` returns invitation data without auth
- Kakao SDK (v2.7.4) loaded in root layout for KakaoTalk sharing via `Kakao.Share.sendDefault`
- Shared invitation page includes share buttons: KakaoTalk, link copy, native share
- OG meta tags generated dynamically via `generateMetadata` in the shared page layout

## External Dependencies

- **Analytics**: Vercel Analytics
- **UI Libraries**: Radix UI, Framer Motion, Embla Carousel, cmdk, react-day-picker, Vaul
- **Form & Validation**: React Hook Form, Zod
- **Utilities**: date-fns, class-variance-authority, clsx/tailwind-merge, next-themes
- **Fonts**: Pretendard (Korean), Caveat (Handwriting)
- **Database**: PostgreSQL (via Drizzle ORM)
- **Authentication**: Replit Auth OIDC
- **Payments**: Stripe (via `stripe-replit-sync`)
- **AI Integration**: OpenAI (gpt-4o-mini via Replit AI Integrations)