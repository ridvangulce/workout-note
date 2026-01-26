const app = require("./app");

const { PORT } = require("./config/env");

const checkAndCreateTables = require("./utils/db-init");

// Initialize DB tables then start server
checkAndCreateTables().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listenin on port: ${PORT}`);
    });
});
