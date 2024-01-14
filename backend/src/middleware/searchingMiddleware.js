const search = (searchFields) => (req, res, next) => {
    const searchTerm = req.body.searchValue || '';
  
    req.searching = {
      searchTerm,
      searchFields,
    };
  
    next();
  };
  
  module.exports = search;
  