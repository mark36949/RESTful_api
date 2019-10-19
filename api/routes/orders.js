const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

//Handle incoming GET requests to /orders
router.get('/',checkAuth, function(req, res){OrdersController.order_get_all});
router.post('/',checkAuth, function(req, res){OrderController.orders_create_order});
router.get('/:orderId',checkAuth, function(req, res){OrderController.orders_get_order});
router.delete('/:orderId',checkAuth, function(req, res){OrderController.orders_delete_order});

module.exports = router;