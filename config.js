const config = {
    db: {
        /* don't expose password or any sensitive info, done only for demo */
        host: "auto-crawler-database-1.czonffh8gwj8.eu-central-1.rds.amazonaws.com",
        user: "admin",
        password: "asddsa123",
        port: "3306",
        database: "auto_crawler",
    },
    listPerPage: 12,
};
module.exports = config;
