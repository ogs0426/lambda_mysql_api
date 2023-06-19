// const DB = require('./util/mysql');
const service_mcash = require('./service/mcash');
const neterror = require('./model/neterror');

const { replaceAll } = require('./util/property');

// For Standard Queue
exports.handler = async (event, context, callback) => {

    // wait for event 
    context.callbackWaitsForEmptyEventLoop = false;

    
    let connection = null;
    
    let body = JSON.stringify(event);
    let statusCode = 200;
    let headers = {
            // 'Content-Type' : 'application/json'
    };
    
    console.log(body);
    
    if(originhost != undefined) {
        headers['Access-Control-Allow-Origin'] = originhost;
        headers['Access-Control-Allow-Credentials'] = true;
    }
    
    if(originhost == undefined) {
        originhost = "";
        headers['Access-Control-Allow-Origin'] = "*";
    }
    
    try {
        
        // Api Parser "Path Routing Check"
        if (event.path.indexOf("/api/v3/identity/thirdparty/") != 0) {
            throw new neterror(404, "Not Found", "Path Not Routing Parser");
        }

        let paths = event.path.replace("/api/v3/identity/thirdparty/", "").split("/");
        
        switch (paths[0]) {
            case "version":
                headers['Content-Type'] = 'application/json';
                body = `{"version" : "23.04.06"}`;
                break;
            
            case "kg": 
                switch (event.httpMethod) {
                    case 'GET': {
                        headers['Content-Type'] = 'text/html; charset=utf-8';
                        body = await service_mcash.register(deviceId, sRedirectUrl, fRedirectUrl);
                        }
                        break;
                    
                    default:
                        throw new neterror(404, "Not Found", "httpMethod not found");
                }
                break;
            
            default:
                throw new neterror(404, "Not Found", "resource not found");
        }
    } catch (err) {
        
        if (connection != null) {
            // DB Roll Back
            connection.rollback();
        }
        
        // console.error(err);

        if (err instanceof neterror) {
            statusCode = err.status_code;
            body = JSON.stringify(err);
            
            /*
            	status_code;
            	error;
            	error_description;
            */
            
            if(statusCode == 302) {
                headers['Location'] = fRedirectUrl + `?status_code=429&error=${err.error}&error_description=${err.error_description}`
            }
            
        } else {
            
            //console.error(err);
        
            statusCode = 500;
            body = JSON.stringify(new neterror(500, "Internal Server Error", err));
        }
    } finally {
        if (connection != null) {
            DB.releaseConnection(connection);
        }
    }

    return {
        statusCode : statusCode, //res.statusCode,
        headers : headers,
        body : body
    }
    
};

