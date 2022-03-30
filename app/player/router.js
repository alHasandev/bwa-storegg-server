const express = require('express');
const multer = require('multer');
const os = require('os');
const { isLoginPlayer } = require('../middleware/auth');
const {
  landingPage,
  detailPage,
  getCategories,
  checkout,
  history,
  historyDetail,
  dashboard,
  getProfile,
  updateProfile,
} = require('./controller');
const router = express.Router();

/* METHOD url listining */
router.get('/landing', landingPage);
router.get('/detail/:id', detailPage);
router.get('/categories', getCategories);
router.post('/checkout', isLoginPlayer, checkout);
router.get('/history', isLoginPlayer, history);
router.get('/history/:id/detail', isLoginPlayer, historyDetail);
router.get('/dashboard', isLoginPlayer, dashboard);
router.get('/profile', isLoginPlayer, getProfile);
router.patch(
  '/profile',
  isLoginPlayer,
  multer({ dest: os.tmpdir() }).single('avatar'),
  updateProfile
);

module.exports = router;
