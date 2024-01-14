const sort = (defaultSortField, defaultSortOrder) => (req, res, next) => {
    const sortField = req.body.sortField || defaultSortField;
    const sortOrder = req.body.sortOrder || defaultSortOrder;
  
    req.sorting = {
      sortField,
      sortOrder,
    };
  
    next();
  };
  
  module.exports = sort;
  