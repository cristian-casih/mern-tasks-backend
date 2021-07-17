const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.authenticate = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: 'El usuario no ya existe' })

    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword) return res.status(400).json({ msg: 'El password es incorrecto' })
    //el salt se encarga de generar hash distintos
    const salt = await bcryptjs.genSalt(10)
    user.password = await bcryptjs.hash(password, salt)
    //crear y firmar el JWT
    const payload = {
      user: user.id
    }
    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600
      },
      (err, token) => {
        if (err) throw err
        res.status(200).send({ token })
      }
    )
  } catch (error) {
    console.log(error)
    res.status(400).send({ msg: 'Hubo un error' })
  }
}
exports.userAuthenticated = async (req, res) => {
  try {
    let id = req.user
    const user = await User.findById(id).select('-password')
    res.json({ user })
  } catch (error) {
    console.log(error)
    res.status(500).send({ msg: 'Hubo un error' })
  }
}
