# 👋 Hey Guys!

**Update:** Backend is complete. Supabase is fully integrated and the system is production-ready. Here's an architectural overview so we can all defend this during presentations.

## 🏗️ System Architecture Overview

### **High-Level Design**
CampusStream is a **3-tier progressive web application** with:
- **Client Layer:** React 18 SPA with PWA capabilities
- **API Layer:** Supabase (PostgreSQL + REST + Real-time subscriptions)
- **Deployment:** Vercel edge network + CDN

### **Data Flow**
```


User → React App → React Query Cache → Supabase Client SDK → 
PostgreSQL (RLS) → Real-time Subscriptions → Live Updates
```

### **Current Status**
- Backend: Supabase PostgreSQL (6 tables, RLS enabled)
- Frontend: React + TypeScript (12 pages, 855 lines service layer)
- PWA: Installable, offline-ready
- Deployed: [campus-stream.vercel.app](https://campus-stream.vercel.app/)
- Mobile: 92/100 (WCAG AA compliant)

Last updated: Oct 18, 2025

## 🛠️ Technical Stack & Architecture

### **Frontend**
| Technology | Purpose | Why We Chose It |
|------------|---------|-----------------|
| **React 18** | UI framework | Virtual DOM, hooks, component reusability |
| **TypeScript** | Type safety | Catch errors at compile-time, better DX |
| **Vite 5.4** | Build tool | 10x faster than Webpack, HMR in <100ms |
| **Tailwind CSS** | Styling | Utility-first, tree-shaking, 95% smaller CSS |
| **shadcn/ui** | Component library | Copy-paste, customizable, accessible |
| **React Router v6** | Client-side routing | SPA navigation, protected routes |
| **React Query** | Data fetching | Caching, optimistic updates, auto-refetch |

### **Backend (Supabase)**
| Technology | Purpose | Why We Chose It |
|------------|---------|-----------------|
| **PostgreSQL** | Database | ACID compliance, relational integrity |
| **Row Level Security** | Authorization | Database-level security, prevents data leaks |
| **PostgREST** | Auto-generated API | Type-safe REST endpoints from schema |
| **Realtime** | Live updates | WebSocket subscriptions, sub-100ms latency |
| **Supabase Auth** | Authentication | JWT tokens, refresh mechanism, role-based |

### **Infrastructure**
- **Vercel:** Edge deployment, automatic HTTPS, CDN
- **PWA:** Service Worker (Workbox), offline caching, installable
- **Git:** Version control with atomic commits

## 🔐 Authentication & Authorization Flow

```
1. User signs up → Supabase Auth creates user
2. Profile created in users table (trigger)
3. JWT token returned with role claim
4. Frontend stores token in localStorage
5. Every request includes JWT in Authorization header
6. Supabase validates token + applies RLS policies
7. Returns only authorized data
```

**Session Management:**
- Access token (1 hour expiry)
- Refresh token (auto-refresh before expiry)
- AuthContext provides: `user`, `profile`, `signOut`, `isAdmin`, `isLecturerOrAdmin`

## ⚡ Performance Optimizations

### **React Query Caching Strategy**
```typescript
// Announcements cached for 5 minutes
queryKey: ['announcements', { filters }]
staleTime: 5 * 60 * 1000
cacheTime: 10 * 60 * 1000

// Notifications refetch every 30 seconds
refetchInterval: 30000
```

### **Code Splitting & Lazy Loading**
- Route-based splitting (React.lazy)
- Image lazy loading (loading="lazy")
- Component-level code splitting

### **PWA Offline Strategy (Workbox)**
```javascript
// Cache-first: Static assets (HTML/CSS/JS)
// Network-first: API calls (Supabase)
// Fallback: Offline page for failed requests
```

### **Performance Metrics**
- First Contentful Paint: <1.5s
- Time to Interactive: <3s
- Lighthouse Score: 95+ (Performance)
- Mobile Responsiveness: 92/100 (A-)

**Project Structure:**
```
src/
├── components/         # Reusable UI
│   └── ui/            # shadcn components
├── pages/             # Route pages (12 total)
├── hooks/             # Custom hooks
├── lib/               # Utils & Supabase services
│   ├── mockData.ts    # Type definitions
│   └── supabase/      # API layer (855 lines)
│       ├── announcements.ts
│       ├── bookmarks.ts
│       ├── notifications.ts
│       └── profile.ts
├── contexts/          # Global state (Auth, PWA)
└── public/            # PWA assets & manifest
```

## 🏃 Quick Start

```bash
npm install
npm run dev
```

Runs at `http://localhost:8080`

## � Database Schema (PostgreSQL)

### **Tables & Relationships**
```sql
users (Supabase Auth)
├── id (uuid, PK)
├── email, role (student/lecturer/admin)
├── first_name, last_name, department, level
└── created_at

announcements
├── id (uuid, PK)
├── title, content, excerpt
├── category (Academic/Event/Sport/etc.)
├── department, priority (urgent/high/medium/low)
├── author_id (FK → users.id)
├── view_count, created_at, updated_at
└── RLS: Users can read all, Lecturers/Admins can write

bookmarks
├── id (uuid, PK)
├── user_id (FK → users.id)
├── announcement_id (FK → announcements.id)
└── RLS: Users see only their own bookmarks

notifications
├── id (uuid, PK)
├── user_id (FK → users.id)
├── title, message, type, is_read
└── RLS: Users see only their own notifications

categories (lookup table)
departments (lookup table)
```

### **Security Model (Row Level Security)**
- **Enable RLS on all tables** - Enforced at database level
- **Policies per role:**
  - Students: Read announcements, manage own bookmarks
  - Lecturers: All student permissions + create announcements
  - Admins: Full CRUD on all tables
- **Why?** Even if frontend is compromised, database stays secure

### **Service Layer Architecture** (855 lines)
```
src/lib/supabase/
├── announcements.ts  # CRUD + filtering + search
├── bookmarks.ts      # Toggle, list, check existence
├── notifications.ts  # Mark read, unread count, fetch
└── profile.ts        # User profile fetch/update
```

**Pattern:** Each service exports typed functions that:
1. Accept typed parameters (TypeScript interfaces)
2. Call Supabase client with proper error handling
3. Return structured responses with error states
4. Used by React Query for caching/optimistic updates

## 🚀 Deployment & DevOps

### **CI/CD Pipeline**
```
Git Push → GitHub → Vercel Auto-Deploy → 
Build (Vite) → Type Check (TSC) → Deploy to Edge → CDN Cache
```

### **Environment Configuration**
```bash
# Required environment variables
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Monitoring & Logging**
- Vercel Analytics for performance metrics
- Supabase Dashboard for database queries
- React Query DevTools for cache inspection
- Browser DevTools for PWA debugging

---

## 📱 System Features (User Perspective)

### **For Students**
- View announcements filtered by department/category
- Bookmark important announcements
- Real-time notifications
- Search functionality
- Mobile-optimized cards

### **For Lecturers**
- All student features +
- Create announcements
- Set priority levels (urgent/high/medium/low)
- Target specific departments

### **For Admins**
- Full system access
- Admin panel with analytics
- Manage all announcements (edit/delete)
- View system statistics
- Desktop table view + mobile card view

---


## 🤝 Contributing

If you want to contribute to this project, reach out and I'll get you set you up 

— BISHOP-X
