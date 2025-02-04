const validateMonth = (req, res, next) => {
    const { month } = req.query;
    const months = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    if (!month) {
      return res.status(400).json({ error: 'Month parameter is required' });
    }
  
    const normalizedMonth = month.toLowerCase();
    if (!months.includes(normalizedMonth)) {
      return res.status(400).json({ error: 'Invalid month. Please provide a month between January to December' });
    }
  
    req.monthNumber = months.indexOf(normalizedMonth) + 1;
    next();
  };
  
  module.exports = validateMonth;