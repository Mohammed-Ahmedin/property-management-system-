// swagger.ts
const swaggerAutogen = require("swagger-autogen")();
const doc = {
    info: {
        title: "Property API",
        description: "API documentation for Property Backend",
    },
    host: "localhost:3000",
    schemes: ["http"],
};
const outputFile = "../swagger-output.json";
const endpointsFiles = ["./src/app.ts"]; // 👈 your main route file
swaggerAutogen(outputFile, endpointsFiles, doc);
