const express = require('express')
const router = express.Router()
const authController = require('../controllers/AuthController')
const auth = require('../middleware/auth')
const { check } = require('express-validator')

router.post('/', authController.authenticate)
router.get('/', auth, authController.userAuthenticated)
module.exports = router
