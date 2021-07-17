const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const { check } = require('express-validator')
router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').not().notEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('password', 'El password debe ser minimo de 6 caracteres').isLength({
      min: 6
    })
  ],
  UserController.createUser
)
module.exports = router
