'use strict';

var obj = {
    //返回状态码 
    statusCode: {
        OK: 200,
        BadRequest: 400,
        Unauthorized: 401,
        NotFound: 404,
        Conflict: 409,
        InternalServerError: 500,
        InternalConnectError: 502
    },
    apiRoot: '/api',
    api: {
        user: {}
    }
};


export default obj;