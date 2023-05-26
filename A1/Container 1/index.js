const expresss = require('express')
const cors = require('cors')
const fs = require('fs')
const axios = require('axios')

const app = expresss()
app.use(cors())
app.use(expresss.json())

const PORT = 6000

app.listen(PORT, console.log(`Server running on port ${PORT}`))

app.post('/calculate',(req,res)=>{
    try{
        var file_name = req.body.file
        var product = req.body.product
        
        if(file_name == null || file_name == ""){
            res.json({
                "file": null,
                "error": "Invalid JSON input."
            })
        }else {
            var isExist = fs.existsSync("./storage/"+file_name)
            if(isExist){
            axios.post('http://kadivar_container2:7000/perform',{file_name,product}).then((response)=>{
                    res.send(response.data)
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
            "file": req.body.file_name,
            "error": "Invalid JSON input."
        })
    }
})