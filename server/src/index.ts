import { Connection, ConnectionConfig } from 'tedious';

const config: ConnectionConfig = {  
    server: 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DATABASE_USERNAME || "SA",
            password: process.env.DATABASE_PASSWORD || "abYCy4CFFKfaEQNL",
        },
    },
    options: {
        port: 32768,
        encrypt: true,
        trustServerCertificate: true,
        database: 'DockerNodeLab',
    },
};

const connection = new Connection(config);

function assertNoError(error: Error) {
    if (error) {
        throw error;
    }
}

connection.on('connect', function(err) {  
    assertNoError(err);

    console.log("Connected");  
    // executeStatement();  
});

// var Request = require('tedious').Request;  
// var TYPES = require('tedious').TYPES;  

// function executeStatement() {  
//     request = new Request("SELECT c.CustomerID, c.CompanyName,COUNT(soh.SalesOrderID) AS OrderCount FROM SalesLT.Customer AS c LEFT OUTER JOIN SalesLT.SalesOrderHeader AS soh ON c.CustomerID = soh.CustomerID GROUP BY c.CustomerID, c.CompanyName ORDER BY OrderCount DESC;", function(err) {  
//     if (err) {  
//         console.log(err);}  
//     });  
//     var result = "";  
//     request.on('row', function(columns) {  
//         columns.forEach(function(column) {  
//           if (column.value === null) {  
//             console.log('NULL');  
//           } else {  
//             result+= column.value + " ";  
//           }  
//         });  
//         console.log(result);  
//         result ="";  
//     });  

//     request.on('done', function(rowCount, more) {  
//     console.log(rowCount + ' rows returned');  
//     });  
//     connection.execSql(request);  
// }  