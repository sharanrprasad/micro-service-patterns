import {AppServer} from "./app";

const port = process.env.PORT || 3000;

(async function () {
    const appServer = new AppServer();
    await appServer.init();
    const server = appServer.app.listen(port, () =>
        console.log(`CQRS app listening at http://localhost:${port}`)
    );

    server.on('close', () => {
        appServer.close();
    })

    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received: closing HTTP server')
        server.close(() => {
            console.log('HTTP server closed')
        })
    })
})();

