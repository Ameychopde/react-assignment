// Creating routes 

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer');


router.post('/create-cust', customerController.createCustomer);
router.get('/get-cust', customerController.getCustomers);
router.put('/update-cust/:id', customerController.updateCustomer);
router.delete('/delete-cust/:id', customerController.deleteCustomer);


module.exports = router;
