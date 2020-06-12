## Development

To develop on the local machine with dependencies (like the database) in docker you need to install node.

Transpile the source code with

```
npm run watch
```

Start the dependencies with:

```
docker-compose --file docker-compose.local.yml up --build
```

Run the server with:

```
node dist/index.js
```

which can be done from Visual Studio code with F5, starting a debug session.
