const {createLog} = require("./winston");

const _errorFormat = (code, name, message, details, requestId) => ({
    code,
    name,
    message,
    timestamp: new Date(),
    details,
    requestId
});

function _getDetails(err) {
    const details = [];
    const keys = Object.keys(err.errors);
    keys.forEach(key => {
        const singleError = err.errors[key]; 
        details.push({
            kind: singleError.kind,
            field: singleError.path,
            value: singleError.path === 'password'? '' : singleError.value,
            issue: singleError.message
        });
    })

    return details;
}

function parseMongooseError(error, req){
    const name = error.name;
    let message;
    let code;
    let details = [];
    const requestId = req === undefined ? undefined : req.id === undefined ? undefined : req.id;

    switch (name) {
        case 'ValidationError': {
            details = _getDetails(error);
            message = error.message;
            code = 400;
        }; break;
        case 'MongooseError': {
            code = 500;
            message = error.message;
        }; break;
        case 'NotFound': {
            code = 404;
            message = 'Item not found.';
        }; break;
        case 'NotModified': {
            message = 'No element has been modified.';
            code = 200;
        }; break;
        default: {
            code = 500
            message = error.message;
        };
    }

    createLog('error', message, req);
    
    return _errorFormat(code, name, message, details, requestId)
}

function parseJWTError(error, req){
    const name = error.name;
    const message = error.message;
    const code = 500;
    const requestId = req.id === undefined ? undefined : req.id;

    createLog('error', message, req);

    return _errorFormat(code, name, message, undefined, requestId);
}

function parseNodemailError(error, req){
    const name = error.code;
    const message = error.message;
    const requestId = req.id === undefined ? undefined : req.id;
    const code = 500;

    createLog('error', message, req);
    
    return _errorFormat(code, name, message, undefined, requestId);
}

function parseUnauthorizedError(data, req){
    const name = 'Unauthorized';
    const message = 'You are not allowed to perform this action.';
    const code = 401;
    const requestId = req.id === undefined ? undefined : req.id;
    const details = {
        method: data.method,
        url: data.url,
        user: data.user,
        user: data.email
    };

    createLog('warn', message, req);

    return _errorFormat(code, name, message, details, requestId);
}

function parseLoginError(data){
    const name = data.name;
    const code = 403;
    let message = '';
    switch (name) {
        case 'NotFound':
            message = 'Incorrect email or password.';
            break;
        case 'NotActive':
            message = 'User not active.';
            break;
        default:
            message = 'Email and password fields are required'
            break;
    }

    createLog('warn', message, undefined);

    return _errorFormat(code, name, message, undefined, undefined);
}

function parseFSError(error, req){
    const message = error.message? error.message : 'Server error';
    const name = error.name? error.name : error.code? error.code: 'Server error';
    const code = 500;
    const requestId = req.id === undefined ? undefined : req.id;
 
    createLog('error', message, req);
    
    return _errorFormat(code, name, message, undefined, requestId);
}

function parseCloudinaryError(error, req){
    const message = error.message;
    const code = error.http_code;
    const name = error.name;
    const requestId = req.id === undefined ? undefined : req.id;

    createLog('error', message, req);
    
    return _errorFormat(code, name, message, undefined, requestId);
}

function parseMulterError(req){
    const message = 'Forbidden extension.';
    const code = 400;
    const name = req.fileValidationError;
    const requestId = req.id === undefined ? undefined : req.id;

    createLog('error', message, req);
    
    return _errorFormat(code, name, message, undefined, requestId);
}

module.exports = {
    parseMongooseError,
    parseJWTError,
    parseNodemailError,
    parseUnauthorizedError,
    parseLoginError,
    parseFSError,
    parseCloudinaryError,
    parseMulterError
}