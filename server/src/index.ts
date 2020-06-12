import { Connection, ConnectionConfig, Request, TYPES } from 'tedious';

const config: ConnectionConfig = {  
    server: process.env.DATABASE_HOST || 'localhost',
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DATABASE_USERNAME || "SA",
            password: process.env.DATABASE_PASSWORD || "abYCy4CFFKfaEQNL",
        },
    },
    options: {
        port: (() => {
            const port = process.env.DATABASE_PORT;
            return port ? parseInt(port) : 1434;
        })(),
        encrypt: true,
        trustServerCertificate: true,
        // database: 'DockerNodeLab',
    },
};

startup(config);

const DATABASE_RECONNECT_TIMEOUT = 3000;

function startup(config: ConnectionConfig) {
    console.log("Creating connection with config...", config);
    const connection = new Connection(config);

    connection.on('connect', async function(err) {
        if (err) {
            console.error(err);
            setTimeout(() => startup(config), DATABASE_RECONNECT_TIMEOUT);
        } else {
            try {
                console.log("Seeding...");
                await seed(connection);
            } catch (error) {
                console.error(error);
            } finally {
                console.log("Closing connection...");
                connection.close();
            }
        }
    });

    connection.on('error', function(err) {
        console.error('error', err);
        setTimeout(() => startup(config), DATABASE_RECONNECT_TIMEOUT);
    });

    connection.on('end', function() {
    });

    console.log("Connecting...");
    // NOTE(mickvangelderen): The type definitions aren't up-to-date as of 2020/06/12...
    (connection as any).connect();
}

type PromiseResolveFn = (value?: any[] | PromiseLike<any[]> | undefined) => void;
type PromiseRejectFn = (reason: any) => void;
type RequestCallbackFn = (error: Error, rowCount: number, rows: any[]) => void;

function createRequestCallback(resolve: PromiseResolveFn, reject: PromiseRejectFn): RequestCallbackFn {
    return (error: Error, rowCount: number, rows: any[]) => {
        if (error) return reject(error);

        // NOTE(mickvangelderen): Why have two parameters which should have the same value?
        // Ensure rowCount matches rows.length and just use rows.
        if (rowCount !== rows.length) return reject(new Error("Expected rowCount to equal rows.length"));

        resolve(rows);
    };
}

function createRequest(query: string, callback: (request: Request) => void): Promise<any[]> {
    return new Promise((resolve, reject) => {
        const request = new Request(query, createRequestCallback(resolve, reject));

        // NOTE(mickvangelderen): This may be called instead of the callback, see tedious/src/request.ts:53
        request.on('error', reject); 

        callback(request);
    });
}

function ignoreRequestError<T>(promise: Promise<T>): Promise<void | T> {
    return promise.catch(error => {
        if (error && error.code === 'EREQUEST') {
            return;
        } else {
            throw error;
        }
    })
}

async function seed(connection: Connection) {
    const DATABASE_NAME = 'Ukam';

    await ignoreRequestError(createRequest(`
    CREATE DATABASE ${DATABASE_NAME}
    `, request => connection.execSqlBatch(request)));

    await createRequest(`
    USE ${DATABASE_NAME}
    `, request => connection.execSqlBatch(request));

    await createRequest(`
    DROP TABLE IF EXISTS People
    `, request => connection.execSqlBatch(request));
    
    await createRequest(`
    CREATE TABLE People (
        id int,
        last_name varchar(255),
        first_name varchar(255),
    )
    `, request => connection.execSqlBatch(request));
    
    await createRequest(`
    DROP TABLE IF EXISTS PeopleT
    `, request => connection.execSqlBatch(request));
    
    await createRequest(`
    CREATE TABLE PeopleT (
        id int,
        last_name varchar(255),
        first_name varchar(255),
    )
    `, request => connection.execSqlBatch(request));
}
