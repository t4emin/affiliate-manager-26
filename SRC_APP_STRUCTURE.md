# src/app Structure

```text
src/app
├── (app)
│   ├── campaigns
│   │   ├── [id]
│   │   │   └── page.tsx
│   │   ├── new
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── dashboard
│   │   └── page.tsx
│   ├── links
│   │   └── page.tsx
│   ├── products
│   │   ├── [id]
│   │   │   └── page.tsx
│   │   ├── new
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── settings
│   │   └── page.tsx
│   └── layout.tsx
├── (auth)
│   ├── login
│   │   └── page.tsx
│   └── register
│       └── page.tsx
├── actions
│   ├── auth.ts
│   ├── campaigns.ts
│   ├── links.ts
│   └── products.ts
├── globals.css
├── layout.tsx
└── page.tsx
```

## Route Groups

- `(auth)` contains public authentication pages.
- `(app)` contains protected application pages.
- `actions` contains Server Actions for auth and CRUD flows.

## Public Routes

- `/login`
- `/register`

## Protected Routes

- `/dashboard`
- `/campaigns`
- `/campaigns/new`
- `/campaigns/[id]`
- `/products`
- `/products/new`
- `/products/[id]`
- `/links`
- `/settings`
