module.exports ={
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "workhelp1@",
    DB: "system",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000, // 30 seconds
        idle: 10000 // 10 seconds
    }
};