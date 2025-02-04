const Transaction = require('../models/Transaction');
const axios = require('axios');


const getMonthTransactions = async (month) => {
  return await Transaction.find({
    $expr: {
      $eq: [{ $month: '$dateOfSale' }, month]
    }
  });
};

exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data);
    res.json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTransactions = async (req, res, next) => {
    try {
      const { search = '', page = 1, perPage = 10 } = req.query;
      const monthNumber = req.monthNumber;
  
      let query = {
        $expr: {
          $eq: [{ $month: '$dateOfSale' }, monthNumber]
        }
      };
  
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: isNaN(search) ? undefined : Number(search) }
        ].filter(Boolean);
      }
  
      // Validate pagination parameters
      const validatedPage = Math.max(1, parseInt(page));
      const validatedPerPage = Math.max(1, Math.min(100, parseInt(perPage)));
      const skip = (validatedPage - 1) * validatedPerPage;
  
      const transactions = await Transaction.find(query)
        .skip(skip)
        .limit(validatedPerPage);
  
      const total = await Transaction.countDocuments(query);
  
      res.json({
        transactions,
        total,
        page: validatedPage,
        perPage: validatedPerPage,
        totalPages: Math.ceil(total / validatedPerPage)
      });
    } catch (error) {
      next(error);
    }
  };

exports.getStatistics = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    const transactions = await getMonthTransactions(monthNumber);
    
    const totalSaleAmount = transactions.reduce((sum, t) => t.sold ? sum + t.price : sum, 0);
    const totalSoldItems = transactions.filter(t => t.sold).length;
    const totalNotSoldItems = transactions.filter(t => !t.sold).length;

    res.json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBarChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    const transactions = await getMonthTransactions(monthNumber);
    
    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0
    };

    transactions.forEach(t => {
      const price = t.price;
      if (price <= 100) priceRanges['0-100']++;
      else if (price <= 200) priceRanges['101-200']++;
      else if (price <= 300) priceRanges['201-300']++;
      else if (price <= 400) priceRanges['301-400']++;
      else if (price <= 500) priceRanges['401-500']++;
      else if (price <= 600) priceRanges['501-600']++;
      else if (price <= 700) priceRanges['601-700']++;
      else if (price <= 800) priceRanges['701-800']++;
      else if (price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;
    });

    res.json(priceRanges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPieChartData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    const transactions = await getMonthTransactions(monthNumber);
    
    const categories = {};
    transactions.forEach(t => {
      categories[t.category] = (categories[t.category] || 0) + 1;
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCombinedData = async (req, res) => {
  try {
    const { month } = req.query;
    const monthNumber = new Date(`${month} 1`).getMonth() + 1;
    
    const transactions = await getMonthTransactions(monthNumber);
    
    const statistics = {
      totalSaleAmount: transactions.reduce((sum, t) => t.sold ? sum + t.price : sum, 0),
      totalSoldItems: transactions.filter(t => t.sold).length,
      totalNotSoldItems: transactions.filter(t => !t.sold).length
    };

    const priceRanges = {
      '0-100': 0,
      '101-200': 0,
      '201-300': 0,
      '301-400': 0,
      '401-500': 0,
      '501-600': 0,
      '601-700': 0,
      '701-800': 0,
      '801-900': 0,
      '901-above': 0
    };

    const categories = {};

    transactions.forEach(t => {
      // Update price ranges
      const price = t.price;
      if (price <= 100) priceRanges['0-100']++;
      else if (price <= 200) priceRanges['101-200']++;
      else if (price <= 300) priceRanges['201-300']++;
      else if (price <= 400) priceRanges['301-400']++;
      else if (price <= 500) priceRanges['401-500']++;
      else if (price <= 600) priceRanges['501-600']++;
      else if (price <= 700) priceRanges['601-700']++;
      else if (price <= 800) priceRanges['701-800']++;
      else if (price <= 900) priceRanges['801-900']++;
      else priceRanges['901-above']++;

      // Update categories
      categories[t.category] = (categories[t.category] || 0) + 1;
    });

    res.json({
      statistics,
      barChart: priceRanges,
      pieChart: categories
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};