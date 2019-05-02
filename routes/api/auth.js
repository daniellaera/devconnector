const express = require('express');
const router = express.Router();

//@route    GET api/auth/test
//@desc     Tests auth route
//@access   Public
router.get('/test', (req, res) => res.send('Auth route works!'));

module.exports = router;