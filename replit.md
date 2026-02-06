# WE:VE - Couple Lifecycle Super App

## Overview

WE:VE is a Korean couple-focused super app that accompanies users through their entire relationship lifecycle - from dating, through wedding preparation, to family life. The application provides mode-specific features including calendars, photo galleries, budget tracking, checklists, and digital wedding invitations.

The app is built as a mobile-first Next.js application with a WE:VE-inspired design system featuring clean typography, subtle shadows, and rounded cards. It supports three distinct modes: Dating (pink theme), Wedding (blue/gold theme), and Family (green theme).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **Next.js 16** with App Router and React Server Components enabled
- **TypeScript** for type safety throughout the codebase
- Pages use `"use client"` directive for interactive components

### UI Component System
- **shadcn/ui** components with New York style variant
- **Radix UI** primitives for accessible, unstyled components
- **Tailwind CSS** with custom CSS variables for theming
- **Lucide React** for consistent iconography
- Custom brutalist-inspired shadow system (`shadow-brutalist`, `shadow-brutalist-sm`)

### Styling Architecture
- CSS variables defined in `app/globals.css` for theme colors
- WE:VE-inspired design tokens (--weve-blue, --weve-bg, etc.)
- Mode-specific color schemes:
  - Dating: Pink accent (#FF6B9D, pink-500)
  - Wedding: Blue/Gold accent (#3182F6, #D4AF37)
  - Family: Green accent (#2D8B57, green-600)
- Pretendard font loaded via CDN for Korean typography

### Database Architecture
- **PostgreSQL** database with Drizzle ORM for type-safe database operations
- **Tables**: todos, events, photos, albums, notifications, expenses, checklist_items, travels, travel_schedules, widgets, profiles, wedding_info, guests
- **API Routes**: `/app/api/{resource}/route.ts` with GET/POST/PATCH/DELETE methods
- **User identification**: Currently uses `userId="default"` for demo mode

### State Management
- React Context API for cross-component state (BudgetContext, ChecklistContext)
- All data fetched from PostgreSQL via API endpoints (no mock data)
- useState/useEffect for component-level state

### Routing Structure
```
/                    - Root page (redirects to splash)
/splash              - Splash screen with auto-navigation
/login               - Social login page
/survey/step1-5      - Initial survey flow (step4 = mode selection)
/survey/wedding-step1-3 - Wedding-specific survey (date/venue/guests/meal)
/survey/wedding-complete - Wedding congratulations screen
/dating/*            - Dating mode pages
/wedding/*           - Wedding mode pages
/wedding/guests      - Guest Manager (하객매니저) page
/wedding/editor      - Invitation editor (청첩장 에디터)
/invitation/preview  - Public invitation preview + RSVP form
/family/*            - Family mode pages
/travel              - Shared travel list (all modes)
/travel/[id]         - Travel detail with schedule, checklist, budget
```

### App Lifecycle & Login Persistence
- **Splash Screen Logic** (`/splash`):
  - Checks `survey_myName` (login indicator) and `selected_mode`
  - If logged in + has selected_mode → redirect to that mode
  - If logged in + no mode → redirect to `/dating` (default)
  - If not logged in → redirect to `/login`
- **Mode Selection**: Integrated into survey step4 (no separate onboarding screen)
  - Three badge buttons: 연애중이에요 (dating), 결혼준비중이에요 (wedding), 결혼했어요 (family)
  - Selection saved to `selected_mode` localStorage key
- **Mode Selection Persistence**: `selected_mode` localStorage key stores user's last mode
- **Wedding Mode Transition**:
  - First time switching to wedding: Shows "결혼을 축하합니다!" congratulations modal
  - `wedding_onboarding_complete` localStorage key tracks onboarding completion
  - After completing wedding onboarding: Free switching between dating/wedding modes
- **LocalStorage Keys**:
  - `survey_myName`, `survey_partnerName`, `survey_firstMeetDate`: Survey data (login indicator)
  - `survey_myBirthday`, `survey_partnerBirthday`: Birthday data (YYYY-MM-DD format)
  - `selected_mode`: "dating" | "wedding" | "family"
  - `wedding_onboarding_complete`: "true" after wedding onboarding
- **Birthday Celebration Feature**:
  - Dating dashboard checks if today is someone's birthday
  - Shows celebration banner with gift shopping button
  - "선물하기" button opens Naver Shopping with "생일선물" search query
- **Upcoming Birthday Reminder**:
  - Shows reminder banner 7 days before birthday
  - Displays "D-X" countdown badge
  - Includes gift shopping button
- **Milestone Anniversary Reminder**:
  - Tracks relationship milestones: 100일, 200일, 300일, 365일, 400일, 500일, 600일, 700일, 730일, 800일, 900일, 1000일, 1095일, etc.
  - Shows reminder banner 7 days before milestone
  - Displays "D-X" countdown badge with gift shopping button
- **Profile Birthday Display & Edit**:
  - CoupleProfile component shows birthdays from localStorage
  - Edit mode allows changing names, birthdays, and start date
  - Cancel reverts all changes; Save persists to localStorage

### Component Organization
- `/components/ui/` - Reusable shadcn/ui components
- `/components/dating/` - Dating mode specific components
- `/components/wedding/` - Wedding mode specific components
- `/components/family/` - Family mode specific components
- `/components/travel/` - Travel module components (TravelEntryCard)
- `/components/shared/` - Cross-mode shared components
- `/contexts/` - React Context providers
- `/hooks/` - Custom React hooks

### Key Features by Mode
- **Dating**: Couple calendar, photo gallery, todo lists with comments, D-day tracking
- **Wedding**: Budget tracking, checklist management, digital invitation editor with RSVP, vendor management, guest manager (하객매니저) with report/list tabs and batch operations (invitation management, attendance check)
- **Family**: Memory archive, history book, shared calendar, photo organization
- **Travel** (Shared): Trip planning with schedule timeline, checklist, budget tracker; accessible from all modes via TravelEntryCard widget

## External Dependencies

### Analytics & Monitoring
- **Vercel Analytics** (@vercel/analytics) - Usage tracking and performance monitoring

### UI Libraries
- **Radix UI** - Full suite of accessible primitives (dialog, dropdown, tabs, etc.)
- **Embla Carousel** - Touch-friendly carousel component
- **cmdk** - Command palette interface
- **react-day-picker** - Calendar date picking
- **Vaul** - Drawer component

### Form & Validation
- **React Hook Form** with @hookform/resolvers
- **Zod** - Schema validation (referenced in build script)

### Utilities
- **date-fns** - Date manipulation
- **class-variance-authority** - Component variant management
- **clsx/tailwind-merge** - Conditional class handling
- **next-themes** - Theme switching support

### Build Tools
- **esbuild** - Server bundling (referenced in script/build.ts)
- **Vite** - Client bundling

### Fonts
- **Pretendard** - Korean web font (loaded via CDN)
- **Playfair Display** - Serif accent font (Google Fonts)

### Planned/Referenced (in build script)
- Drizzle ORM for database operations
- PostgreSQL connectivity (pg)
- Express.js server capabilities
- Authentication (passport, passport-local)
- File uploads (multer)
- Email (nodemailer)
- Payments (stripe)
- AI integrations (openai, @google/generative-ai)