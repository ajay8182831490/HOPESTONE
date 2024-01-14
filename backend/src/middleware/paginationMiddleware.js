const paginate = () => (req, res, next) => {
    const page = parseInt(req.body.page) || 1;
    const perPage = parseInt(req.body.perPage) || 10;
      
    req.pagination = {
      page,      
      perPage,
    };
  
    next();
  };
  
  module.exports = paginate;
  