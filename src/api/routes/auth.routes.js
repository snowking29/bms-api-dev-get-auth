const { Router } = require('express');
const router = Router();
const authController = require('../controllers/auth.controller');

router.post('/signup', authController.postSignup);
router.post('/login', authController.postLogin);
router.delete('/logout', authController.deleteLogout);

module.exports = router;