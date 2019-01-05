const express = require('express');
const router = express.Router();

/**
 * @route GET api/profile/test
 * @desc Test post route
 * @access Public
 */

router.get('/test/', (req,res) => {
    res.json({ msg: "Profile works"});
});

module.exports = router;