const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const validateMonth = require('../middleware/validateMonth');

router.get('/initialize-database', transactionController.initializeDatabase);
router.get('/transactions', validateMonth, transactionController.getTransactions);
router.get('/statistics', validateMonth, transactionController.getStatistics);
router.get('/bar-chart', validateMonth, transactionController.getBarChartData);
router.get('/pie-chart', validateMonth, transactionController.getPieChartData);
router.get('/combined-data', validateMonth, transactionController.getCombinedData);

module.exports = router;