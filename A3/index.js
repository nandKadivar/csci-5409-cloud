// Reference: https://www.w3schools.com/nodejs/nodejs_mysql.asp

const express = require("express")
const cors = require("cors")
const app = express()
const DB = require("./db.js")
app.use(cors())
app.use(express.json())

const PORT = 6000

const db = new DB("database-1.cycxyap0jfns.us-east-1.rds.amazonaws.com","admin","admin#123","my_db")
const con = db.config()

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})

app.get("/test",(req,res)=>{
    res.send("Server is running")
})

app.post("/run-query",(req,res)=>{
    try{
        var sql_query = req.body.query
        
        con.query(sql_query,(error, result)=>{
            if(error){
                res.json({
                    "Error": error
                })
            }else {
                res.status(200)
                res.json({
                    "Result": result
                })
            }
        })
    }catch(error){
        res.json({
            "Error": error
        })
    }
})

app.get("/list-products",(req,res)=>{
    try{
        var sql_query = "SELECT * FROM products"
        
        con.query(sql_query,(error, result)=>{
            if(error){
                res.json({
                    "Error": error
                })
            }else {
                res.status(200)
                res.json({
                    "products": result
                })
            }
        })
    }catch(error){
        res.json({
            "Error": error
        })
    }
})

app.post("/store-products",(req,res)=>{
    try{
        const products = req.body.products
        if(products.length >= 1){
            products.forEach(product => {
                if(product.name && product.price && product.availability != null){
                    var name = product.name
                    var price = product.price
                    var availability = product.availability
                    
                    var sql_query = `INSERT INTO products VALUES("${name}","${price}",${availability})`
                    
                    con.query(sql_query,(error, result)=>{
                        if(error){
                            res.json({
                                "Error": error
                            })
                        }else {
                            res.status(200)
                            res.json({
                                "message": "Success."
                            })
                        }
                    })
                }
            });
        }else {
            res.json({
                "Error": "No products provided"
            })    
        }
    }catch(error){
        res.json({
            "Error": error
        })
    }
})