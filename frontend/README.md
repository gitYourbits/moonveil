# Finagen Frontend

Setup

- Copy .env.example to .env and set VITE_API_BASE_URL (e.g., http://localhost:8000)
- Install: npm install
- Dev: npm run dev
- Build: npm run build; Preview: npm run preview

Notes

- JWT auth via /api/auth/token and /api/auth/token/refresh
- Axios interceptors auto-attach Bearer and refresh on 401
- API keys page shows token once on creation; copy it
# Finagen Portal

A modern, production-ready web UI for Finagen - an AI-powered financial analytics and automation platform. Built with React, TypeScript, and Tailwind CSS, featuring comprehensive integration with Django REST API backend.

## 🚀 Features

- **Modern UI/UX**: Clean, professional interface with dark/light mode support
- **Authentication**: Complete JWT-based auth system with automatic token refresh
- **Dashboard**: Real-time metrics and analytics visualization
- **API Integration**: Full integration with Django REST API backend
- **Responsive Design**: Mobile-first responsive design with modern components
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **State Management**: TanStack Query for efficient server state management
- **Form Handling**: React Hook Form with Zod validation
- **Component Library**: shadcn/ui components with custom design system

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query, React Context
- **Forms**: React Hook Form, Zod validation
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **Charts**: Recharts (ready for integration)
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd finagen-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── layout/         # Layout components (Header, Footer)
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Utilities and configurations
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## 🔐 Authentication

The app uses JWT-based authentication with automatic token refresh:

- **Access tokens**: Stored in localStorage
- **Refresh tokens**: Stored in cookies (with fallback to memory)
- **Auto-refresh**: Automatic token refresh on 401 responses
- **Protected routes**: Automatic redirect to login for unauthenticated users

### Demo Credentials
- Username: `demo`
- Password: `demo123`

## 🌐 API Integration

The frontend integrates with the following API endpoints:

### Authentication
- `POST /api/auth/token/` - Login
- `POST /api/auth/token/refresh/` - Refresh token

### Public Content
- `GET /api/core/pages/*` - Static pages
- `GET /api/core/guides/` - Guides listing
- `GET /api/products/items/` - Products catalog

### Protected Endpoints (require authentication)
- `GET /api/accounts/me/*` - User profile and dashboard
- `GET/POST /api/keys/mine/` - API key management
- `GET /api/usage/events/` - Usage analytics
- `GET /api/billing/*` - Billing and subscriptions
- `GET /api/support/tickets/` - Support tickets

## 🎨 Design System

The app uses a comprehensive design system built on top of Tailwind CSS:

- **Colors**: Semantic color tokens with dark/light mode support
- **Typography**: Inter font family with consistent sizing
- **Components**: Custom variants for shadcn/ui components
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first responsive design

### Theme Customization

Colors and design tokens are defined in:
- `src/index.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind configuration

## 📱 Pages & Features

### Public Pages
- **Home** (`/`) - Landing page with hero section and product highlights
- **Login** (`/login`) - Authentication page

### Protected Pages
- **Dashboard** (`/dashboard`) - Main dashboard with key metrics
- **Usage** (`/usage`) - API usage analytics and charts
- **Billing** (`/billing`) - Subscription and payment management
- **API Keys** (`/keys`) - API key management with secure token display
- **Settings** (`/settings`) - User profile and preferences
- **Support** (`/support`) - Support ticket management

## 🔧 Configuration

### Environment Variables

All client-side environment variables must be prefixed with `VITE_`:

```env
# Required
VITE_API_BASE_URL=http://localhost:8000

# Optional
VITE_ENABLE_DEVTOOLS=true
```

### API Client Configuration

The API client (`src/lib/api.ts`) is configured with:
- Base URL from environment variables
- Automatic JWT token attachment
- Token refresh on 401 responses
- Request/response interceptors
- Proper error handling

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

3. **Deploy to your hosting platform**
   - The `dist/` folder contains the production build
   - Configure your server to serve `index.html` for all routes (SPA routing)

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:
- `VITE_API_BASE_URL` - Your production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact the development team
- Check the API documentation at `/api/docs`

---

Built with ❤️ using modern web technologies