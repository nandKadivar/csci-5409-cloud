const mysql = require("mysql")

class db {
    constructor(host,user,password,database){
        this.host = host
        this.user = user
        this.password = password
        this.database = database
    }

    config() {
        const connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database
        })
        return connection
    }
}

module.exports = db