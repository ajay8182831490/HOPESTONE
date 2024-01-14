/* eslint-disable max-len */
const path = require('path');

const { logError } = require('./logger');
const { httpRequestDurationMicrosecondsInbound } = require('./prom');

const fileName = path.basename(__filename);

const RESPONSES_JSON = () => ({
  CONDITIONS: {
    SUCCESS: (ret) => ret && ret.success,
    NO_ERRORS: (ret) => ret && !ret.errors,
    STATUS: (ret) => ret && ret.status,
    NOT_EMPTY: (ret) => ret,
    ERROR: (ret) => ret && ret.errors && ret.errors.length >= 1,
    NULL: (ret) => ret === null,
    DEFAULT: () => true,
    EXCEPTION: () => false,
  },
  HANDLERS: {
    SUCCESS: (ret, res) => res.status(process.env.RESPONSE_CODES_SUCCESS).type(process.env.RESPONSE_TYPES_JSON).send(ret),
    PARTIAL_SUCCESS: (ret, res) => res.status(process.env.RESPONSE_CODES_PARTIAL_CONTENT).type(process.env.RESPONSE_TYPES_JSON).send(ret),
    SERVER_ERROR_EMPTY: (ret, res) => res.status(process.env.RESPONSE_CODES_SERVER_ERROR).type(process.env.RESPONSE_TYPES_JSON).send(),
    SERVER_ERROR_NON_EMPTY: (ret, res) => res.status(process.env.RESPONSE_CODES_SERVER_ERROR).type(process.env.RESPONSE_TYPES_JSON).send(ret),
  },
});

const RESPONSES_HTML = () => ({
  CONDITIONS: {
    SUCCESS: (ret) => ret && ret.success,
    NO_ERRORS: (ret) => ret && !ret.errors,
    STATUS: (ret) => ret && ret.status,
    NOT_EMPTY: (ret) => ret,
    ERROR: (ret) => ret && ret.errors && ret.errors.length >= 1,
    NULL: (ret) => ret === null,
    DEFAULT: () => true,
    EXCEPTION: () => false,
  },
  HANDLERS: {
    SUCCESS: (ret, res) => res.status(process.env.RESPONSE_CODES_SUCCESS).type(process.env.RESPONSE_TYPES_HTML).send(ret),
    PARTIAL_SUCCESS: (ret, res) => res.status(process.env.RESPONSE_CODES_PARTIAL_CONTENT).type(process.env.RESPONSE_TYPES_HTML).send(ret),
    SERVER_ERROR_EMPTY: (ret, res) => res.status(process.env.RESPONSE_CODES_SERVER_ERROR).type(process.env.RESPONSE_TYPES_HTML).send(),
    SERVER_ERROR_NON_EMPTY: (ret, res) => res.status(process.env.RESPONSE_CODES_SERVER_ERROR).type(process.env.RESPONSE_TYPES_HTML).send(ret),
  },
});

const genericHandler = (...responseCases) => (opt) => responseCases.find((c) => c[0](opt))[1];

const handle = (ret, res, responseCases) => {
  try {
    genericHandler(...responseCases)(ret)(ret, res);
  } catch (ex) {
    logError(ex, fileName);
    responseCases[responseCases.length - 1][1](ret, res);
  }
};

const generalResponseConditionsJSON = [
  [RESPONSES_JSON().CONDITIONS.NULL, RESPONSES_JSON().HANDLERS.SERVER_ERROR_EMPTY],
  [RESPONSES_JSON().CONDITIONS.ERROR, RESPONSES_JSON().HANDLERS.PARTIAL_SUCCESS],
  [RESPONSES_JSON().CONDITIONS.NOT_EMPTY, RESPONSES_JSON().HANDLERS.SUCCESS],
  [RESPONSES_JSON().CONDITIONS.DEFAULT, RESPONSES_JSON().HANDLERS.SERVER_ERROR_EMPTY],
  [RESPONSES_JSON().CONDITIONS.EXCEPTION, RESPONSES_JSON().HANDLERS.SERVER_ERROR_EMPTY],
];

const generalResponseConditionsHTML = [
  [RESPONSES_HTML().CONDITIONS.NULL, RESPONSES_HTML().HANDLERS.SERVER_ERROR_EMPTY],
  [RESPONSES_HTML().CONDITIONS.ERROR, RESPONSES_HTML().HANDLERS.PARTIAL_SUCCESS],
  [RESPONSES_HTML().CONDITIONS.NOT_EMPTY, RESPONSES_HTML().HANDLERS.SUCCESS],
  [RESPONSES_HTML().CONDITIONS.DEFAULT, RESPONSES_HTML().HANDLERS.SERVER_ERROR_EMPTY],
  [RESPONSES_HTML().CONDITIONS.EXCEPTION, RESPONSES_HTML().HANDLERS.SERVER_ERROR_EMPTY],
];

const handleForFrontend = (ret, res, req) => {
  handle(ret, res, generalResponseConditionsJSON);
  if (req) { httpRequestDurationMicrosecondsInbound(req, res); }
};

const handleForFrontendForHTML = (ret, res, req) => {
  handle(ret, res, generalResponseConditionsHTML);

  if (req) { httpRequestDurationMicrosecondsInbound(req, res); }
};

module.exports.handleForFrontend = handleForFrontend;
module.exports.handleForFrontendForHTML = handleForFrontendForHTML;
