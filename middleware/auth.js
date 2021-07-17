const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token')

  if (!token){
    return res.status(401).json({ msg: 'No hay Token, permiso no valido' })
  }
  try {
    const verified = jwt.verify(token, process.env.SECRET)
    req.user =verified.user
    next()
  } catch (error) {
    console.log(error,"error");
    res.status(401).json({ msg: 'Token no valido' })
  }
}
