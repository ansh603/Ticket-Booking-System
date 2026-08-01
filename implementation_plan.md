# 🎟️ MERN Ticket Booking System — Phased Implementation Plan

## Overview

A production-ready, full-stack Ticket Booking System built with the MERN stack. The project is structured into **7 phases** — from project scaffolding to deployment — ensuring each phase delivers a working, demonstrable milestone for your Final Year Project showcase and campus placement interviews.

---

> [!IMPORTANT]
> **Execution Strategy**: Each phase is self-contained and demo-able. Do NOT proceed to the next phase until the current phase is fully tested. This ensures you always have a working build at every stage.

---

## 📁 Final Folder Structure

```
ticket-booking-system/
├── backend/                        # Node.js + Express API
│   ├── src/
│   │   ├── config/                 # DB, Cloudinary, Socket, Mailer config
│   │   ├── constants/              # App-wide enums & constants
│   │   ├── controllers/            # Route handlers (thin layer)
│   │   ├── services/               # Business logic (fat layer)
│   │   ├── models/                 # Mongoose schemas
│   │   ├── routes/                 # Express routers (versioned: /api/v1)
│   │   ├── middleware/             # Auth, error, upload, rate-limit, roles
│   │   ├── validators/             # Joi/Zod request validators
│   │   ├── utils/                  # Helpers: JWT, email, QR, PDF, OTP
│   │   └── socket/                 # Socket.IO handlers
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── frontend/                       # React + Vite + Tailwind
│   ├── public/
│   ├── src/
│   │   ├── api/                    # Axios instances & API calls
│   │   ├── app/                    # Redux store setup
│   │   ├── assets/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── common/             # Button, Input, Modal, Loader, Toast
│   │   │   ├── layout/             # Navbar, Footer, Sidebar, Layout
│   │   │   ├── event/              # EventCard, EventList, SeatMap
│   │   │   ├── booking/            # BookingCard, BookingStepper
│   │   │   └── dashboard/          # Charts, StatsCard, DataTable
│   │   ├── features/               # Redux slices (RTK)
│   │   │   ├── auth/
│   │   │   ├── events/
│   │   │   ├── bookings/
│   │   │   ├── payments/
│   │   │   └── notifications/
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── pages/                  # Route-level page components
│   │   │   ├── auth/
│   │   │   ├── customer/
│   │   │   ├── organizer/
│   │   │   └── admin/
│   │   ├── routes/                 # Protected & role-based routing
│   │   ├── utils/                  # formatDate, formatPrice, validators
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/                           # Documentation & diagrams
│   ├── README.md
│   ├── API.md
│   ├── ER_DIAGRAM.md
│   └── INTERVIEW_PREP.md
│
└── docker-compose.yml              # Optional: for local dev
```

---

## 🗂️ Database Collections & Schema Overview

| Collection | Key Fields |
|---|---|
| **Users** | name, email, password, role, avatar, googleId, isVerified, isActive, refreshToken |
| **Events** | title, description, organizer, category, venue, date, time, seatLayout, prices, status, banner, tags, totalSeats, availableSeats |
| **Categories** | name, slug, icon, description |
| **Bookings** | user, event, seats, totalAmount, status, qrCode, paymentId, couponApplied |
| **Payments** | booking, user, amount, method, status, transactionId, invoice |
| **Coupons** | code, discount, type, maxUses, usedCount, expiresAt, isActive |
| **Reviews** | user, event, rating, comment, isApproved |
| **Notifications** | user, type, message, isRead, metadata |
| **RefreshTokens** | user, token, expiresAt, userAgent, ip |

---

## 🚀 Phase-by-Phase Breakdown

---

## PHASE 1 — Project Scaffold & Foundation
**Estimated Time: 2–3 Days**

### Goals
- Initialize monorepo structure
- Configure all tools and environments
- Set up CI-ready codebase from day one

### Backend Tasks
- [ ] Initialize Node.js project with `npm init`
- [ ] Install core dependencies: `express mongoose dotenv cors helmet morgan cookie-parser`
- [ ] Install dev dependencies: `nodemon eslint prettier`
- [ ] Set up `server.js` with Express, CORS, Helmet, Morgan
- [ ] Connect MongoDB using Mongoose with error handling & reconnection
- [ ] Set up `.env.example` with all required keys documented
- [ ] Configure ESLint + Prettier
- [ ] Set up global error handler middleware
- [ ] Set up async error wrapper utility (`catchAsync`)
- [ ] Create `AppError` custom error class
- [ ] Set up API versioning: `/api/v1/`
- [ ] Create health-check route `GET /api/v1/health`

### Frontend Tasks
- [ ] Initialize React + Vite project: `npm create vite@latest frontend -- --template react`
- [ ] Install: `tailwindcss axios react-router-dom @reduxjs/toolkit react-redux react-hot-toast`
- [ ] Configure Tailwind CSS with custom design tokens (colors, fonts)
- [ ] Set up Google Fonts (Inter or Plus Jakarta Sans)
- [ ] Configure Axios base instance with interceptors
- [ ] Set up Redux store with RTK
- [ ] Set up React Router v6 with layout structure
- [ ] Create placeholder pages for all routes

### Deliverable
> A running Express server + React app with Tailwind configured, connected to MongoDB, with health check API working.

---

## PHASE 2 — Authentication System
**Estimated Time: 5–7 Days**

### Goals
- Complete auth flow: Register → Verify Email → Login → Refresh → Logout
- Google OAuth integration
- JWT with HTTP-only cookies + Refresh Token rotation

### Backend Tasks

#### Models
- [ ] **User Model**: name, email, password (bcrypt), role, avatar, googleId, isVerified, isActive, otpCode, otpExpiry, passwordResetToken, passwordResetExpiry
- [ ] **RefreshToken Model**: userId, token (hashed), userAgent, ip, expiresAt

#### Services (`authService.js`)
- [ ] `registerUser()` — create user, generate OTP, send verification email
- [ ] `verifyEmail()` — validate OTP, mark user as verified
- [ ] `loginUser()` — validate credentials, issue Access + Refresh tokens
- [ ] `googleOAuth()` — find/create user via Google profile, issue tokens
- [ ] `refreshAccessToken()` — rotate refresh token, issue new access token
- [ ] `forgotPassword()` — generate password reset token, send email
- [ ] `resetPassword()` — validate token, update password, invalidate all refresh tokens
- [ ] `changePassword()` — old password verify → update
- [ ] `logout()` — delete refresh token from DB + clear cookies

#### Utilities
- [ ] `generateTokens()` — sign access (15m) + refresh (7d) JWTs
- [ ] `generateOTP()` — 6-digit OTP with 10-min expiry
- [ ] `sendEmail()` — Nodemailer with HTML templates (registration, OTP, reset)
- [ ] `hashToken()` — SHA-256 hash for refresh token storage

#### Middleware
- [ ] `authenticate` — verify JWT from cookie, attach `req.user`
- [ ] `authorize(...roles)` — check `req.user.role`
- [ ] `rateLimiter` — express-rate-limit (auth routes: 5 req/15min)

#### Routes (`/api/v1/auth`)
- [ ] `POST /register`
- [ ] `POST /verify-email`
- [ ] `POST /resend-otp`
- [ ] `POST /login`
- [ ] `GET /google` (Passport.js Google strategy)
- [ ] `GET /google/callback`
- [ ] `POST /refresh-token`
- [ ] `POST /logout`
- [ ] `POST /forgot-password`
- [ ] `POST /reset-password/:token`
- [ ] `PATCH /change-password` (protected)
- [ ] `PATCH /update-profile` (protected)
- [ ] `POST /upload-avatar` (protected + Cloudinary)

### Frontend Tasks

#### Redux Slice (`authSlice.js`)
- [ ] State: `user`, `isAuthenticated`, `isLoading`, `error`
- [ ] Async thunks: `loginUser`, `registerUser`, `logoutUser`, `refreshToken`, `googleLogin`

#### Pages
- [ ] **Register Page** — email, password, name fields + validation
- [ ] **OTP Verification Page** — 6-box OTP input with resend timer
- [ ] **Login Page** — email/password + Remember Me + Google OAuth button
- [ ] **Forgot Password Page** — email input → success state
- [ ] **Reset Password Page** — new password + confirm password
- [ ] **Profile Page** — avatar upload (Cloudinary), name, email, change password section

#### Components
- [ ] `ProtectedRoute` — redirect to login if not authenticated
- [ ] `RoleRoute` — redirect if wrong role
- [ ] `GoogleLoginButton` — OAuth button with Google branding
- [ ] `OTPInput` — 6-box auto-advance input component

#### Hooks
- [ ] `useAuth()` — access auth state + actions
- [ ] `useAxiosPrivate()` — Axios with auto token refresh

### Deliverable
> Complete auth system: register → OTP verify → login → dashboard. Google OAuth working. JWT + HTTP-only cookie. Password reset via email.

---

## PHASE 3 — Event Management System
**Estimated Time: 5–7 Days**

### Goals
- Organizers can create/update/delete events with images
- Categories management
- Full CRUD with Cloudinary image uploads
- Seat layout management

### Backend Tasks

#### Models
- [ ] **Category Model**: name, slug, icon, description, isActive
- [ ] **Event Model**: title, description, organizer (ref: User), category (ref: Category), venue `{name, city, address, coordinates}`, date, time, duration, status (`draft/published/cancelled/completed`), banner, images[], ticketPrices `{vip, regular, general}`, seatLayout `{rows, cols, totalSeats}`, availableSeats, tags[], isFeatured, viewCount

#### Services (`eventService.js`)
- [ ] `createEvent()` — organizer creates, status defaults to `draft`
- [ ] `updateEvent()` — validate ownership, update fields
- [ ] `deleteEvent()` — soft delete (`isDeleted: true`)
- [ ] `publishEvent()` — change status to `published`
- [ ] `getEvents()` — search, filter, sort, paginate (aggregation pipeline)
- [ ] `getEventById()` — populate organizer, category, reviews avg
- [ ] `uploadEventImages()` — Cloudinary multi-upload
- [ ] `getOrganizerEvents()` — events by organizer with stats

#### Utilities
- [ ] `uploadToCloudinary()` — multer + cloudinary stream upload
- [ ] `paginate()` — reusable pagination helper
- [ ] `buildQueryFilter()` — reusable search/filter builder

#### Routes (`/api/v1/events`)
- [ ] `GET /` — public, with search/filter/sort/pagination
- [ ] `GET /featured` — featured events
- [ ] `GET /categories` — all categories
- [ ] `GET /:id` — event details
- [ ] `POST /` — organizer only
- [ ] `PATCH /:id` — organizer/admin
- [ ] `DELETE /:id` — organizer/admin (soft delete)
- [ ] `PATCH /:id/publish` — organizer
- [ ] `POST /:id/images` — upload images (Cloudinary)
- [ ] `GET /organizer/my-events` — organizer's events

### Frontend Tasks

#### Pages
- [ ] **Events Listing Page** — responsive grid, search bar, filters sidebar, sort dropdown
- [ ] **Event Detail Page** — banner, image gallery, seat map, book now CTA, reviews, similar events, countdown timer
- [ ] **Create Event Page** — multi-step form (organizer): Basic Info → Venue → Tickets & Seats → Preview
- [ ] **Edit Event Page** — pre-filled form
- [ ] **Organizer Events Page** — table view with status badges, quick actions

#### Components
- [ ] `EventCard` — image (Unsplash), title, date, venue, price, rating badge
- [ ] `EventFilters` — category chips, date range picker, price slider, city select
- [ ] `SeatLayoutEditor` — visual grid editor for organizer to define layout
- [ ] `ImageUploader` — drag-and-drop with preview, progress bar
- [ ] `EventCountdown` — live countdown to event date
- [ ] `CategoryBadge` — icon + label pill

#### Redux Slice (`eventsSlice.js`)
- [ ] State: `events`, `currentEvent`, `filters`, `pagination`, `isLoading`
- [ ] Async thunks: `fetchEvents`, `fetchEventById`, `createEvent`, `updateEvent`, `deleteEvent`

### Deliverable
> Organizer can create, publish, and manage events. Public event listing with search/filter works. Event detail page renders beautifully.

---

## PHASE 4 — Booking System & Real-Time Seats
**Estimated Time: 6–8 Days**

### Goals
- Customers can select seats and book tickets
- Real-time seat lock/unlock using Socket.IO
- Booking lifecycle management

### Backend Tasks

#### Models
- [ ] **Booking Model**: user, event, seats[] `{seatId, type, price}`, totalAmount, couponApplied, discountAmount, status (`pending/confirmed/cancelled/refunded`), qrCodeData, paymentId, cancelledAt, refundedAt
- [ ] **Coupon Model**: code, discountType (`percentage/fixed`), discountValue, minOrderAmount, maxDiscountAmount, maxUses, usedCount, usedBy[], validFrom, validTo, isActive

#### Services (`bookingService.js`)
- [ ] `lockSeats()` — temporarily lock seats in Redis/Map for 10 min via Socket.IO
- [ ] `createBooking()` — validate seat availability, create booking with `pending` status
- [ ] `confirmBooking()` — after payment success, confirm booking, generate QR
- [ ] `cancelBooking()` — cancel if allowed, trigger refund flow
- [ ] `getBookingById()` — with full population
- [ ] `getUserBookings()` — paginated booking history
- [ ] `applyCoupon()` — validate coupon, return discount details

#### QR & Ticket Utilities
- [ ] `generateQRCode()` — `qrcode` package, encode bookingId + userId
- [ ] `generateTicketPDF()` — `pdfkit` or `jspdf`, ticket with QR code, booking details
- [ ] `generateInvoice()` — payment invoice PDF

#### Socket.IO Handlers
- [ ] `seatLocked` — broadcast to room `event:{eventId}` when seat selected
- [ ] `seatUnlocked` — broadcast when seat released (timeout/cancel)
- [ ] `seatBooked` — broadcast when booking confirmed
- [ ] `userConnected/Disconnected` — manage seat locks on disconnect

#### Routes (`/api/v1/bookings`)
- [ ] `POST /` — create booking (authenticated customer)
- [ ] `GET /my-bookings` — user's booking history
- [ ] `GET /:id` — booking details
- [ ] `POST /apply-coupon` — validate coupon
- [ ] `PATCH /:id/cancel` — cancel booking
- [ ] `GET /:id/ticket` — download ticket PDF
- [ ] `GET /:id/invoice` — download invoice PDF

### Frontend Tasks

#### Pages
- [ ] **Seat Selection Page** — interactive visual seat map, real-time updates via Socket.IO, seat type legend, selected seats summary
- [ ] **Booking Checkout Page** — booking summary, coupon input, final price, proceed to payment
- [ ] **Booking Confirmation Page** — success animation, QR code display, download ticket button
- [ ] **Booking History Page** — paginated list with status badges, download/cancel actions

#### Components
- [ ] `SeatMap` — SVG/CSS grid of seats, color-coded: available/selected/locked/booked
- [ ] `BookingStepper` — steps: Select Seats → Payment → Confirmation
- [ ] `BookingCard` — compact booking summary with status
- [ ] `CouponInput` — input + apply button with validation feedback
- [ ] `TicketPreview` — digital ticket card with QR code
- [ ] `DownloadTicket` — PDF download button

#### Hooks
- [ ] `useSocket()` — manage Socket.IO connection + event listeners
- [ ] `useSeatMap()` — seat selection state logic

### Deliverable
> Customer can select seats (locked in real-time for others), proceed to checkout, apply coupon, confirm booking, and download PDF ticket.

---

## PHASE 5 — Payment System (Demo) & Notifications
**Estimated Time: 4–5 Days**

### Goals
- Demo payment flow (simulated payment gateway)
- Email notifications for all booking events
- In-app notification system

### Backend Tasks

#### Models
- [ ] **Payment Model**: bookingId, userId, amount, currency (`INR`), method (`card/upi/wallet`), status (`pending/success/failed/refunded`), transactionId, gateway (`demo`), metadata `{cardLast4, upiId}`, paidAt

#### Services (`paymentService.js`)
- [ ] `initiatePayment()` — create payment record with `pending` status
- [ ] `simulatePayment()` — demo: random success/fail after 2s delay, update status
- [ ] `verifyPayment()` — verify payment and confirm booking
- [ ] `processRefund()` — update payment to `refunded`, update booking
- [ ] `getPaymentHistory()` — user's payment list

#### Notification Service (`notificationService.js`)
- [ ] `sendBookingConfirmation()` — email with ticket details
- [ ] `sendPaymentSuccess()` — payment receipt email
- [ ] `sendCancellationEmail()` — cancellation + refund info
- [ ] `sendEventReminder()` — 24h before event (cron job)
- [ ] `createInAppNotification()` — save to Notifications collection
- [ ] `markNotificationRead()` — update read status

#### Cron Jobs (`node-cron`)
- [ ] Event reminder: daily at 9 AM — find events tomorrow, send emails
- [ ] Expire pending bookings: every 15 min — cancel pending > 30 min

#### Routes
- [ ] `POST /api/v1/payments/initiate`
- [ ] `POST /api/v1/payments/simulate` (demo gateway)
- [ ] `POST /api/v1/payments/verify`
- [ ] `GET /api/v1/payments/history`
- [ ] `POST /api/v1/payments/refund/:paymentId`
- [ ] `GET /api/v1/notifications` (authenticated)
- [ ] `PATCH /api/v1/notifications/:id/read`
- [ ] `PATCH /api/v1/notifications/mark-all-read`

### Frontend Tasks
- [ ] **Payment Page** — demo card form UI (card number, expiry, CVV), UPI option, wallet option, animated processing state
- [ ] **Payment Success Page** — confetti animation, summary, go to ticket
- [ ] **Payment Failed Page** — retry button, support contact
- [ ] **Notification Bell** — dropdown with unread count badge, list of notifications
- [ ] **Payment History Page** — table with transaction IDs, status badges

### Deliverable
> Complete demo payment flow. Email sent on booking. In-app notifications working. Cron jobs active.

---

## PHASE 6 — Dashboards, Analytics & Admin Panel
**Estimated Time: 5–7 Days**

### Goals
- 3 role-based dashboards (Customer, Organizer, Admin)
- Charts, analytics, data tables
- Admin CRUD for users/organizers/events
- Organizer revenue and report export

### Backend Tasks

#### Admin Routes (`/api/v1/admin`)
- [ ] `GET /dashboard` — aggregate: total users, events, revenue, bookings (30-day)
- [ ] `GET /users` — paginated user list with search
- [ ] `PATCH /users/:id/suspend` — toggle user active status
- [ ] `PATCH /users/:id/role` — change user role
- [ ] `GET /organizers` — organizer list with verification status
- [ ] `PATCH /organizers/:id/verify` — verify/unverify organizer
- [ ] `GET /events` — all events with organizer info
- [ ] `GET /analytics` — monthly revenue, top events, category breakdown (aggregation)
- [ ] `GET /reports/export` — CSV export (json2csv)

#### Organizer Routes (`/api/v1/organizer`)
- [ ] `GET /dashboard` — revenue, total bookings, active events for this organizer
- [ ] `GET /bookings` — all bookings for organizer's events (with seat details)
- [ ] `GET /revenue` — monthly revenue breakdown (aggregation)
- [ ] `GET /reports/export` — CSV of bookings

### Frontend Tasks
- [ ] **Customer Dashboard** — upcoming bookings cards, booking history, wishlist, quick actions
- [ ] **Organizer Dashboard** — stats cards (total revenue, bookings, events), bar chart (monthly revenue), pie chart (ticket type distribution), recent bookings table, event list with quick actions
- [ ] **Admin Dashboard** — KPI cards (users, events, revenue, bookings), line chart (growth), data tables (users, events), organizer verification queue, system alerts
- [ ] **Admin Users Page** — searchable/sortable table, suspend/activate/role-change actions
- [ ] **Admin Events Page** — all events table, status management
- [ ] **Organizer Reports Page** — export CSV button, revenue charts, booking details

#### Components
- [ ] `StatsCard` — icon, label, value, trend indicator
- [ ] `RevenueChart` — Recharts bar/line chart
- [ ] `DataTable` — sortable, searchable table with pagination
- [ ] `OrganizerVerificationCard` — approve/reject UI

### Deliverable
> All 3 dashboards functional. Admin can manage users/organizers. Organizer sees revenue analytics. CSV export works.

---

## PHASE 7 — Bonus Features, Polish & Documentation
**Estimated Time: 5–7 Days**

### Goals
- Add bonus features (reviews, wishlist, recommendations)
- UI polish: Dark mode, animations, responsive design
- Full documentation
- PWA setup

### Bonus Features

#### Backend
- [ ] **Reviews & Ratings** — `POST /events/:id/reviews`, average rating aggregation, pagination
- [ ] **Wishlist** — `POST/DELETE /users/wishlist/:eventId`, `GET /users/wishlist`
- [ ] **Recommendations** — based on user's booked categories (aggregation pipeline)
- [ ] **Recently Viewed** — array in User model, `PATCH /users/recently-viewed/:eventId`
- [ ] **QR Scanner API** — `POST /bookings/scan` — decode QR, return booking status (for organizer scanning)
- [ ] **Share Event** — generate shareable link with Open Graph meta tags

#### Frontend
- [ ] **Dark Mode** — Tailwind `dark:` classes, theme toggle stored in Redux + localStorage
- [ ] **Wishlist Page** — saved events grid with remove option
- [ ] **Reviews Section** — star rating input, comment, list of reviews on event detail page
- [ ] **Similar Events** — horizontal scroll section on event detail page
- [ ] **QR Scanner** — `react-qr-scanner` for organizer to scan tickets at venue
- [ ] **Live Countdown** — real-time countdown on event detail page
- [ ] **PWA** — `vite-plugin-pwa`, manifest.json, service worker, offline page
- [ ] **Share Button** — Web Share API + copy link fallback

### Documentation Tasks
- [ ] `README.md` — project overview, tech stack, setup instructions, features list, screenshots
- [ ] `API.md` — all endpoints documented (method, URL, auth, body, response)
- [ ] `ER_DIAGRAM.md` — Mermaid ER diagram of all collections and relationships
- [ ] `INTERVIEW_PREP.md` — why each tech was chosen, trade-offs, interview Q&A per feature
- [ ] Folder structure documentation
- [ ] Authentication flow diagram (Mermaid sequence diagram)
- [ ] Booking flow diagram
- [ ] Payment flow diagram

### Final Polish
- [ ] Add loading skeletons for all data-fetching states
- [ ] Toast notifications for all actions
- [ ] Form validation feedback (inline errors)
- [ ] 404 and error boundary pages
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] SEO meta tags for all pages
- [ ] Favicon and PWA icons

### Deliverable
> Complete, polished, documented application ready for FYP submission and placement demos.

---

## 📦 Key NPM Packages

### Backend
| Package | Purpose |
|---|---|
| `express` | Web framework |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT tokens |
| `passport` + `passport-google-oauth20` | Google OAuth |
| `nodemailer` | Email sending |
| `cloudinary` + `multer` | File uploads |
| `socket.io` | Real-time communication |
| `helmet` | HTTP security headers |
| `express-rate-limit` | Rate limiting |
| `express-mongo-sanitize` | NoSQL injection prevention |
| `xss-clean` | XSS attack prevention |
| `cors` | Cross-origin resource sharing |
| `cookie-parser` | HTTP cookie parsing |
| `qrcode` | QR code generation |
| `pdfkit` | PDF ticket generation |
| `node-cron` | Scheduled jobs |
| `joi` | Request validation |
| `json2csv` | CSV export |
| `morgan` | HTTP request logging |
| `dotenv` | Environment variables |

### Frontend
| Package | Purpose |
|---|---|
| `react` + `vite` | UI framework |
| `react-router-dom` v6 | Client-side routing |
| `@reduxjs/toolkit` + `react-redux` | State management |
| `axios` | HTTP client |
| `tailwindcss` | Utility-first CSS |
| `socket.io-client` | Real-time client |
| `recharts` | Charts and analytics |
| `react-hot-toast` | Toast notifications |
| `react-hook-form` + `zod` | Forms + validation |
| `@tanstack/react-query` | Server state management |
| `date-fns` | Date formatting |
| `react-qr-scanner` | QR code scanning |
| `vite-plugin-pwa` | PWA support |
| `framer-motion` | Animations |

---

## 🔐 Security Checklist

- [ ] All passwords hashed with bcrypt (salt rounds: 12)
- [ ] JWT access tokens expire in 15 minutes
- [ ] Refresh tokens stored hashed in DB, rotated on each use
- [ ] HTTP-only, Secure, SameSite cookies
- [ ] Helmet middleware on all routes
- [ ] Rate limiting on auth routes (5 req/15min)
- [ ] express-mongo-sanitize to prevent NoSQL injection
- [ ] XSS-clean middleware
- [ ] Input validation with Joi on all POST/PATCH routes
- [ ] CORS configured with whitelist
- [ ] All secrets in environment variables (never hardcoded)

---

## 📐 API Design Conventions

```
Base URL: /api/v1/
Auth:     Bearer token OR HTTP-only cookie

Response format:
{
  "success": true,
  "message": "Events fetched successfully",
  "data": { ... },
  "pagination": { "page": 1, "limit": 10, "total": 100 }
}

Error format:
{
  "success": false,
  "message": "Validation failed",
  "errors": [ ... ],
  "statusCode": 400
}
```

---

## ⚠️ Open Questions for You

> [!IMPORTANT]
> Please clarify the following before we start coding:

1. **Deployment Target**: Are you deploying to Render/Railway (backend) + Vercel (frontend), or fully on a VPS?
2. **Payment Gateway**: Confirmed as **Demo/Simulated** (no real Razorpay/Stripe keys)? Or do you want to integrate the Razorpay test mode?
3. **Database**: MongoDB Atlas (cloud) or local MongoDB instance for development?
4. **Email Service**: Nodemailer with Gmail SMTP (free, requires App Password) or a service like Mailtrap for dev?
5. **Phase Priority**: Do you want to start with Phase 1 immediately, or review and adjust the plan first?

---

## 🗓️ Estimated Timeline

| Phase | Focus | Est. Days |
|---|---|---|
| Phase 1 | Scaffold & Foundation | 2–3 |
| Phase 2 | Authentication System | 5–7 |
| Phase 3 | Event Management | 5–7 |
| Phase 4 | Booking + Real-Time Seats | 6–8 |
| Phase 5 | Payment + Notifications | 4–5 |
| Phase 6 | Dashboards + Admin Panel | 5–7 |
| Phase 7 | Bonus Features + Docs + Polish | 5–7 |
| **Total** | | **~32–44 Days** |
