const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ msg: 'El usuario ya existe' })

    user = new User(req.body)
    //el salt se encarga de generar hash distintos
    const salt = await bcryptjs.genSalt(10)
    user.password = await bcryptjs.hash(password, salt)

    await user.save()
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
