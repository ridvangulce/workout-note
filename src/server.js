const app = require("./app");

const { PORT } = require("./config/env");

app.listen(PORT, () => {
    console.log(`Server listenin on port: ${PORT}`);
})