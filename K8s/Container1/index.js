const expresss = require('express')
const cors = require('cors')
const fs = require('fs')
const axios = require('axios')
const path = require("path")

const app = expresss()
app.use(cors())
app.use(expresss.json())

const PORT = 6000

app.listen(PORT, console.log(`Server running on port ${PORT}`))

app.post("/startserver",(req,res)=>{
    var my_server_ip = req.body.ip
    axios.post("https://fmdyn90ov7.execute-api.us-east-1.amazonaws.com/default/start",{
        "banner": "B00929627",
        "ip": my_server_ip
    }).then((response)=>{
        console.log(response)
        res.send(response.data)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/test',(req,res)=>{
    res.send("Container is up with latest changes")
})

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

app.post('/store-file',(req,res)=>{
    try{

        var file = req.body.file
        var data = req.body.data
        if(file == null){
            res.json({
                "file": null,
                "error": "Invalid JSON input."
            })
        }
        fs.writeFile("./Nandkumar_PV_dir/"+file,data,(error)=>{
            if(error){
                res.json({
                    file,
                    "error": "Error while storing the file to the storage."
                })
            }else{
                res.json({
                    file,
                    "message": "Success."
                })
            }
        })
    }catch(error){
        res.json({
            file,
            "error": "Error while storing the file to the storage."
        })
    }
})

app.post('/calculate',(req,res)=>{
    try{
        var file_name = req.body.file
        var product = req.body.product
        
        if(file_name == null){
            res.json({
                "file": null,
                "error": "Invalid JSON input."
            })
        }else {
            var isExist = fs.existsSync("./Nandkumar_PV_dir/"+file_name)
            if(isExist){
            axios.post('http://localhost:7000/perform',{file_name,product}).then((response)=>{
                    res.json(response.data)
            })
            }else {
                res.json({
                    "file": file_name,
                    "error": "File not found."
                })
            }
        }

    }catch (error){
        res.json({
            "file": req.body.file,
            "error": "Invalid JSON input."
        })
    }
})