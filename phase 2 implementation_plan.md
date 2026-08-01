# 🔐 Phase 2 — Authentication System

## Scope (Updated per Your Feedback)

| Decision | Choice |
|---|---|
| Email Verification | ❌ **No OTP** — users can log in immediately after register |
| Auth Methods | ✅ Email/Password (JWT) + ✅ Google OAuth |
| Email Service | ✅ **EmailJS** (for Forgot Password emails only) |
| Color Theme | ✅ **Fixed solid colors** — no gradients |
| Tokens | ✅ Access token (15m) + Refresh token (7d) in HTTP-only cookies |

---

## 🔑 Credentials You Need to Provide

> [!IMPORTANT]
> You need **2 external services** for Phase 2. Here's exactly how to get each one:

### 1. Google OAuth (Required for "Sign in with Google")

**Steps:**
1. Go to → [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Add Authorized redirect URI: `http://localhost:5000/api/v1/auth/google/callback`
7. Copy your **Client ID** and **Client Secret**

**You'll give me:**
```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxx
```

---

### 2. EmailJS (Required for Forgot Password emails)

**Steps:**
1. Go to → [emailjs.com](https://www.emailjs.com) → Create free account
2. **Add Email Service** → Gmail → Connect your Gmail account
3. **Create Email Template** → Use this template body:
   ```
   Subject: Reset Your TicketHub Password
   
   Hi {{to_name}},
   Click this link to reset your password:
   {{reset_link}}
   
   This link expires in 1 hour.
   ```
4. Go to **Account → API Keys** → copy your Public Key

**You'll give me:**
```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

> [!NOTE]
> EmailJS is **frontend-only** — no backend SMTP config needed. Password reset token is generated on backend, email is sent from frontend.

---

## 🎨 Fixed Solid Theme (No Gradients)

The new design system will use a **clean, professional solid-color palette**:

| Token | Color | Usage |
|---|---|---|
| Primary | `#4f46e5` (Indigo-600) | Buttons, links, active states |
| Primary Dark | `#3730a3` (Indigo-800) | Hover states |
| Primary Tint | `#eef2ff` (Indigo-50) | Backgrounds, badges |
| Surface | `#ffffff` | Cards, panels |
| Surface Dark | `#0f172a` (Slate-900) | Dark navbar, hero, footer |
| Border | `#e2e8f0` | All borders |
| Text | `#0f172a` | Headings |
| Text Secondary | `#475569` | Body text |
| Success | `#059669` | Confirmations |
| Error | `#dc2626` | Errors |

> Solid buttons, solid backgrounds, clean card borders — **no gradients anywhere**.

---

## Proposed Changes

---

### Backend

#### [NEW] `backend/src/models/User.js`
Fields: `name`, `email`, `password` (bcrypt, nullable for OAuth), `role` (default: `customer`), `avatar`, `googleId`, `isActive`, `passwordResetToken` (SHA-256 hashed), `passwordResetExpiry`, `createdAt`

#### [NEW] `backend/src/models/RefreshToken.js`
Fields: `userId` (ref: User), `token` (SHA-256 hashed), `userAgent`, `ip`, `expiresAt` — TTL index for auto-delete

#### [NEW] `backend/src/utils/generateTokens.js`
- `generateAccessToken(userId, role)` — signs 15m JWT
- `generateRefreshToken(userId)` — signs 7d JWT, hashes + saves to DB
- `setTokenCookies(res, accessToken, refreshToken)` — sets HTTP-only cookies

#### [NEW] `backend/src/utils/hashToken.js`
- `hashToken(token)` — SHA-256 via Node's built-in `crypto`

#### [NEW] `backend/src/services/authService.js`
- `registerUser(name, email, password)` — hash password, create user, generate tokens, set cookies
- `loginUser(email, password)` — validate credentials, generate tokens
- `googleOAuth(profile)` — find or create user by googleId/email, generate tokens
- `refreshAccessToken(refreshToken)` — validate, rotate refresh token, issue new access token
- `forgotPassword(email)` — generate reset token, return it (frontend sends email via EmailJS)
- `resetPassword(token, newPassword)` — validate token, update password, invalidate all refresh tokens
- `changePassword(userId, oldPassword, newPassword)` — validate old → update
- `logout(refreshToken, res)` — delete token from DB, clear cookies

#### [NEW] `backend/src/controllers/authController.js`
Thin controller layer — delegates to `authService`, uses `catchAsync`

#### [NEW] `backend/src/middleware/authenticate.js`
Verify access token from cookie → attach `req.user = { id, role }`

#### [NEW] `backend/src/middleware/authorize.js`
`authorize('admin', 'organizer')` — role-based guard

#### [NEW] `backend/src/middleware/rateLimiter.js`
Auth-specific rate limiter: 10 requests per 15 minutes per IP

#### [NEW] `backend/src/validators/authValidator.js`
Joi schemas: `registerSchema`, `loginSchema`, `forgotPasswordSchema`, `resetPasswordSchema`, `changePasswordSchema`

#### [NEW] `backend/src/config/passport.js`
Passport.js Google OAuth 2.0 strategy configuration

#### [NEW] `backend/src/routes/authRoutes.js`
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/google
GET    /api/v1/auth/google/callback
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/:token
PATCH  /api/v1/auth/change-password    (protected)
PATCH  /api/v1/auth/update-profile     (protected)
GET    /api/v1/auth/me                 (protected)
```

#### [MODIFY] `backend/src/routes/index.js`
Uncomment and mount `authRoutes`

#### [MODIFY] `backend/server.js`
Initialize Passport middleware

---

### Frontend

#### [MODIFY] `frontend/src/index.css`
Replace all gradient tokens with solid colors. Update `.btn-primary`, `.card`, `.badge` to use flat solid colors.

#### [MODIFY] `frontend/src/features/auth/authSlice.js`
Add async thunks:
- `loginUser`, `registerUser`, `logoutUser`, `googleCallback`, `refreshToken`, `forgotPassword`, `resetPassword`, `changePassword`, `fetchMe`

#### [NEW] `frontend/src/api/authAPI.js`
All auth API call functions using `axiosPublic` / `axiosPrivate`

#### [NEW] `frontend/src/hooks/useAuth.js`
Access auth state + actions from Redux in one hook

#### [NEW] `frontend/src/routes/ProtectedRoute.jsx`
Redirects unauthenticated users to `/auth/login`

#### [NEW] `frontend/src/routes/RoleRoute.jsx`
Redirects to home if user role doesn't match required roles

#### [NEW] `frontend/src/pages/auth/LoginPage.jsx`
- Email + password fields
- "Remember me" checkbox
- Google OAuth button (redirects to backend `/api/v1/auth/google`)
- Link to register + forgot password
- Solid indigo theme, no gradients

#### [NEW] `frontend/src/pages/auth/RegisterPage.jsx`
- Name, email, password, confirm password
- Google OAuth button
- Instant login after register (no OTP)
- Password strength indicator

#### [NEW] `frontend/src/pages/auth/ForgotPasswordPage.jsx`
- Email input
- On submit: backend generates reset token → frontend sends email via **EmailJS**
- Success state shown after email sent

#### [NEW] `frontend/src/pages/auth/ResetPasswordPage.jsx`
- New password + confirm password
- Token read from URL params

#### [NEW] `frontend/src/pages/customer/ProfilePage.jsx`
- Display name, email, role badge
- Edit name form
- Change password section
- Avatar placeholder (Cloudinary upload in Phase 3)

#### [MODIFY] `frontend/src/App.jsx`
- Wrap customer/organizer/admin routes with `<ProtectedRoute>`
- Wrap admin routes with `<RoleRoute roles={['admin']}>`
- Replace auth placeholder pages with real pages

#### [MODIFY] `frontend/src/components/layout/Navbar.jsx`
- Working logout button (calls Redux `logoutUser`)
- User avatar initials bubble → dropdown with Profile + Logout

---

## Auth Flow Diagrams

### Register Flow
```
User fills form → POST /auth/register → Hash password → Create User
→ Generate Access + Refresh tokens → Set HTTP-only cookies
→ Return user data → Frontend stores in Redux → Redirect to dashboard
```

### Google OAuth Flow
```
Click "Sign in with Google" → GET /auth/google (Passport redirects)
→ Google Consent Screen → GET /auth/google/callback
→ Find/Create user in DB → Generate tokens → Set cookies
→ Redirect to /auth/google/success → Frontend reads user → Dashboard
```

### Forgot Password Flow (EmailJS)
```
User enters email → POST /auth/forgot-password
→ Backend generates reset token (hashed in DB) → Returns plain token
→ Frontend calls EmailJS.send() with reset link containing token
→ User clicks link → ResetPasswordPage reads token from URL
→ POST /auth/reset-password/:token → Validate → Update password
```

---

## Verification Plan

### Automated
- `POST /api/v1/auth/register` → returns 201 with tokens in cookies
- `POST /api/v1/auth/login` → valid credentials return 200; wrong password returns 401
- `GET /api/v1/auth/me` (with cookie) → returns user data
- `POST /api/v1/auth/logout` → clears cookies, returns 200
- `POST /api/v1/auth/refresh-token` → returns new access token

### Manual
- Register → lands on customer dashboard
- Google OAuth button → Google consent → lands on dashboard
- Logout → redirects to login
- Login with wrong password → shows error toast
- Forgot password → EmailJS sends email with reset link
- Reset password via link → success, redirect to login

---

## Open Questions

> [!NOTE]
> Once you provide the Google OAuth credentials and EmailJS keys, I'll start building immediately. No other keys needed for Phase 2.
