const expresss = require('express')
const cors = require('cors')
const fs = require('fs')
const parser = require('@fast-csv/parse')
// Reference: Fast CSV Docs https://c2fo.github.io/fast-csv/docs/introduction/getting-started

const app = expresss()
app.use(cors())
app.use(expresss.json())

const PORT = 7000

app.listen(PORT, console.log(`Server running on port ${PORT}`))

app.post('/perform',(req,res)=>{
    try{
        var file = req.body.file_name
        var product = req.body.product
        var products = []
        var count = 0

        var readrer = fs.createReadStream("./storage/"+file).pipe(parser.parse({headers:true}))
        .on('headers',(header)=>{
            if(header.length != 2 || header[0] !='product' || header[1] !='amount'){
                res.json({
                    file,
                    "error": "Input file not in CSV format."
                })
                readrer.destroy()
            }
        })
        .on('data', (data)=>{
            products.push(data)
            if(data.product == "" || data.amount == ""){
                res.json({
                    file,
                    "error": "Input file not in CSV format."
                })
                readrer.destroy()
            }
        })
        .on('error',(error)=>{
            res.json({
                file,
                "error": "Input file not in CSV format."
            })
            readrer.destroy()
        })
        .on('end',()=>{
            products.forEach(element => {
                if(element.product == product){
                    count+=parseInt(element.amount)
                }
            });
            res.json({
                file,
                "sum": count
            })
            readrer.destroy()
        })
    }catch(error){
        res.json({
            "file": req.body.file_name,
            "error": "Invalid JSON input."
        })
    }
})