const express = require('express');
const router = express.Router();
const controller = require('./controllers');


//Pricing
router.get('/price', controller.viewPrice);
router.post('/price', controller.createPrice);

router.get('/editprice/:id', controller.editPriceView);
router.post('/editprice', controller.editPrice);


//customer
router.get('/', controller.home);
router.post('/', controller.homeDate);
router.get('/:m/:o/:d',controller.allToggle);
router.get('/:id/:m/:o/:d', controller.homeToggle);

router.get('/addcustomer', controller.createCustomerForm);
router.post('/addcustomer', controller.createCustomer);

router.get('/editcustomer/:id',controller.editCustomerForm);
router.post('/editcustomer',controller.editCustomer);
router.get('/deletecustomer/:id',controller.deleteCustomer);

// bill

router.get('/bill', controller.bill);
router.post('/bill', controller.bill);
router.get('/bill/:id', controller.genrateBill);
router.get('/deletebill/:id', controller.deleteBill);
router.get('/genrateBill/:id', controller.instantBill);







module.exports = router;