const { getnews } = require('../controllers/news')
const { protect } = require('../middleware/authMiddleware')

const router = require('express').Router()

router.route("/").get(protect,getnews)

module.exports = router 