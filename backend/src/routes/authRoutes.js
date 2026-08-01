const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');
const { authRateLimiter } = require('../middleware/rateLimiter');
const {
  validate,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} = require('../validators/authValidator');

const router = express.Router();

// Apply rate limiter to all auth routes
router.use(authRateLimiter);

// ─── Public Routes ────────────────────────────────────────────────────────────

// Email / Password Auth
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Password Reset (EmailJS handles email sending from frontend)
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);

// ─── Google OAuth Routes ──────────────────────────────────────────────────────
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/auth/login?error=google_failed` }),
  authController.googleCallback
);

// Success redirect page (frontend reads user from cookie)
router.get('/google/success', (req, res) => {
  res.redirect(`${process.env.CLIENT_URL}/customer/dashboard`);
});

// ─── Protected Routes (require valid JWT cookie) ──────────────────────────────
router.use(authenticate); // All routes below are protected

router.get('/me', authController.getMe);
router.patch('/update-profile', validate(updateProfileSchema), authController.updateProfile);
router.patch('/change-password', validate(changePasswordSchema), authController.changePassword);

module.exports = router;
