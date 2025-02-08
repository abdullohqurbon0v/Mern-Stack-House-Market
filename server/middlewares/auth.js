const jwt = require('jsonwebtoken')

function tokenValidation(req, res, next) {
  const header = req.headers['authorization']
  console.log(header)
  const token = header && header.split(' ')[1]
  console.log(token)

  if (!token) {
    return res.status(400).json({
      message: "Authorization filed"
    })
  }


  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(400).json({ message: "Invalid or expired token" })
    }
    req.user = user
    next()
  })
}


module.exports = tokenValidation