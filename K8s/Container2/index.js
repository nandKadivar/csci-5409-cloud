const expresss = require('express')
const cors = require('cors')
const fs = require('fs')
const parser = require('@fast-csv/parse')

const app = expresss()
app.use(cors())
app.use(expresss.json())

const PORT = 7000

app.listen(PORT, console.log(`Server running on port ${PORT}`))

app.post('/get-file',(req,res)=>{
    var file_name = req.body.file
    if(file_name == null){
        res.json({
            "file": null,
            "error": "Invalid JSON input."
        })
    }
    
    var isExist = fs.existsSync("./Nandkumar_PV_dir/"+file_name)
    
    if(isExist){
        fs.readFile("./Nandkumar_PV_dir/"+file_name, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.send(err)
            }
            res.send(data)
        });
    }else {
        res.send("File not found!")
    }
})

app.post('/perform',(req,res)=>{
    try{
        var file = req.body.file_name
        var product = req.body.product
        var products = []
        var count = 0

        var readrer = fs.createReadStream("./Nandkumar_PV_dir/"+file).pipe(parser.parse({headers:true}))
        .on('headers',(header)=>{
            if(header.length != 2 || header[0].trim() !='product' || header[1].trim() !='amount'){
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
                if(element.product.trim() == product){
                    count+=parseInt(element[' amount '].trim())
                }
            });
            res.json({
                file,
                "sum": count.toString()
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