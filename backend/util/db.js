require('dotenv').config({ path: './config/global.env' });
const path = require('path');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { logError, logInfo } = require('./logger');
const { version, options } = require('pdfkit');
const { strict } = require('assert');
const { HOST, USER, DATABSENAME, PASSWORD } = process.env;
const mongoose = require('mongoose');



//const MONGODB_URI = 'mongodb+srv://ajay8182831490:Ajay%4016052003@blogapi.dstwlyr.mongodb.net/?retryWrites=true&w=majority';
const mongooseOptions = {

  useNewUrlParser: true,
  useUnifiedTopology: true,
  MaxPoolSize: 10,
  serverSelectionTimeoutMS: 30000, // 30 seconds (adjust as needed)
};// Adjust the pool size as needed




const getPool = async () => {

  let pool = null;
  try {
    pool = await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);


  } catch (ex) {
    logError(ex, path.basename(__filename));
    throw new Error({ error: 'Internal Server Error', details: ex.message });
  }
  return pool;
}








// Create the MongoDB connection pool
// const getPool = mongoose.createConnection(MONGODB_URI, mongooseOptions);

// // Event listeners for handling connection events
// getPool.on('connected', () => {
//   console.log('Connected to MongoDB');
// });
module.exports = getPool;




/*const getPool = async () => {


  try {
    pool = pool || mysql.createPool({
      host: HOST,
      user: USER,
      password: PASSWORD,
      database: DATABSENAME,
      waitForConnections: true,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  } catch (ex) {
    logError(ex, path.basename(__filename));
    throw new Error({ error: 'Internal Server Error', details: ex.message });
  }
  return pool;
}

/*const beginTransaction = async () => {
  const connection = await getPool().getConnection();
  await connection.beginTransaction();

  const transaction = {
    connection,
    commit: async () => {
      await connection.commit();
      connection.release();
      logInfo('Transaction committed');
    },
    rollback: async () => {
      await connection.rollback();
      connection.release();
      logInfo('Transaction rolled back');
    }
  };

  return transaction;
}


// Helper function to execute a MySQL query
async function executeQuery(query, params) {
  try{
    logInfo(`Going to execute query ${query} with Params ${params}`, path.basename(__filename), executeQuery.name);
    const database = await getPool();
    if(params){
      const [ret, _] = await database.query(query, params);
      return ret;
    }else{
      const [ret, _] = await database.query(query);
      return ret;
    }
    return ret;
  }catch(ex){
    logError(ex, path.basename(__filename));
    throw new Error({error : 'Internal Server Error', details : ex.message});
  }
}


// Utility function for paginated and searchable data
async function getPaginatedData(tableName, searchColumnName, searchTerm, page, itemsPerPage, sortField, sortOrder, additionalWhereClause) {
  try {
    // Calculate offset based on the requested page number
    const offset = (page - 1) * itemsPerPage;
    let whereClause = '';
    // Construct the main WHERE clause with the main column
    if(searchTerm && searchTerm != '' && searchColumnName && searchColumnName.length > 0){
        searchColumnName.forEach((column) => {
        whereClause += ` OR ${column} LIKE '%${searchTerm}%'`;
      });
    }

    if(whereClause && whereClause.startsWith(' OR')){
      whereClause =  whereClause.slice(3).trim();
      if(additionalWhereClause){
        whereClause = "(" + whereClause + ")" + " AND " + additionalWhereClause;
      }else{
        whereClause = "(" + whereClause + ")";
      }
    }else if(additionalWhereClause){
      whereClause = additionalWhereClause;
    }

    let query, totalCountQuery;
    // Perform a database query with pagination and search
    if(whereClause && whereClause != ''){
      query = `SELECT * FROM ${tableName} WHERE ${whereClause} ORDER BY ${sortField} ${sortOrder} LIMIT ?, ?`;
      totalCountQuery = `SELECT COUNT(*) AS totalCount FROM ${tableName} WHERE ${whereClause}`;
    }else{
      query = `SELECT * FROM ${tableName} ORDER BY ${sortField} ${sortOrder} LIMIT ?, ?`;
      totalCountQuery = `SELECT COUNT(*) AS totalCount FROM ${tableName}`;
    }

    let params = [offset, itemsPerPage];

    const result = await executeQuery(query, params);
    let totalCountResult = await executeQuery(totalCountQuery);

    const totalItems = totalCountResult[0].totalCount;

    return {
      page,
      totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      items: result,
    };
  } catch (ex) {
    logError(ex, path.basename(__filename));
    throw new Error({ error: 'Internal Server Error', details: ex.message });
  }
}


async function getPaginatedDataWithJoin(table, and, columns, join, groupby, searchColumnName, searchTerm, page, itemsPerPage, sortField, sortOrder) {
  try {
    // Calculate offset based on the requested page number
    const offset = (page - 1) * itemsPerPage;
    let andClause = and ? `AND ${and}` : '';
    const groupbyClause = groupby ? `GROUP BY ${groupby}` : '';
    const orderbyClause = sortField ? `ORDER BY ${sortField} ${sortOrder}` : '';
    const limitClause = itemsPerPage ? `LIMIT ${offset}, ${itemsPerPage}` : '';
    const columnName = columns ? columns : '*';

    let whereClause = '';
    if(searchTerm && searchTerm != '' && searchColumnName && searchColumnName.length > 0){
      searchColumnName.forEach((column) => {
      whereClause += ` OR ${column} LIKE '%${searchTerm}%'`;
    });
  }

  if(whereClause && whereClause.startsWith(' OR')){
    whereClause =  whereClause.slice(3).trim();
    if(andClause && andClause != ''){
      andClause = andClause + " AND (" + whereClause + ")";
    }else{
      andClause = " AND (" + whereClause + ")";
    }
  }

  const sql = `SELECT ${columnName} FROM ${table} ${join} WHERE 1=1 ${andClause} ${groupbyClause} ${orderbyClause} ${limitClause}`;
  const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM ${table} ${join} WHERE 1=1 ${andClause}`;
  const result = await executeQuery(sql);
  let totalCountResult = await executeQuery(totalCountQuery);

  const totalItems = totalCountResult[0].totalCount;

    return {
      page,
      totalItems,
      totalPages: Math.ceil(totalItems / itemsPerPage),
      items: result,
    };
  } catch (ex) {
    logError(ex, path.basename(__filename));
    throw new Error({ error: 'Internal Server Error', details: ex.message });
  }
}


async function getDataWithJoin(table, and, columns, join, groupby, sortField, sortOrder) {
  try {

    let andClause = and ? `AND ${and}` : '';
    const groupbyClause = groupby ? `GROUP BY ${groupby}` : '';
    const orderbyClause = sortField ? `ORDER BY ${sortField} ${sortOrder}` : '';
    const columnName = columns ? columns : '*';
    const sql = `SELECT ${columnName} FROM ${table} ${join} WHERE 1=1 ${andClause} ${groupbyClause} ${orderbyClause}`;

    return await executeQuery(sql);

  } catch (ex) {
    logError(ex, path.basename(__filename));
    throw new Error({ error: 'Internal Server Error', details: ex.message });
  }
}*/

//module.exports = getPool;
// module.exports.getPaginatedData = getPaginatedData;
// module.exports.getPaginatedDataWithJoin = getPaginatedDataWithJoin;
// module.exports.getDataWithJoin = getDataWithJoin;
// module.exports.beginTransaction = beginTransaction;