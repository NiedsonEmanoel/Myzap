const express = require('express');
const router = express.Router();
router.use(express.urlencoded());
router.use(express.json());

router.post('/', (req, res)=>{
    res.json('OK');
});

module.exports = router;