const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader');
const aws_sdk = require('aws-sdk');
const axios = require('axios');
const express = require('express');

// References: https://blog.logrocket.com/communicating-between-node-js-microservices-with-grpc/

const app = express()

const PORT = 6000

app.listen(PORT, console.log(`Server running on port ${PORT}`))


const computeandstorage = protoLoader.loadSync('./computeandstorage.proto',{})
const computeandstorageProto = grpc.loadPackageDefinition(computeandstorage)

const credentials = {
    "accessKeyId": "ASIASBTHRIU43NDIJWWL",
    "secretAccessKey": "Zc/geSYbhHEgMGClqHWAXn5lNiwXBX25GTy7I7uF",
    "token": "FwoGZXIvYXdzEFkaDCAFDIoNYZf8+DLcIiLAAaIhTwkn8mctlLS8mwfwRUbc5KFF5U2BBs43IxkVbuoJLfl1xqBIpIPCFXNpgNJgs7P6+wV6sqD8DAAuqaIs8Ba87rLytYfm60cYxVUhz53trGxcPeDkeo4Lc0QGwsPi5SuVVGgkLFzx7+L/Ts7UbObHDgMncnUboTWx/863zgLRjAzf6ppHFG5zA0aCFl4a5cfUs0CiiwPrC/hiOa889DerFw017URIqLB3eDXlMQ/L7mKxuBsbJVkWK4PcMpyxQiiWko2kBjItzeA2uuUdxZHiN/G4v+pIzpOtGK03u1meLUaNiLKEjGP0JghthrTMmaKL2yzk"
}

const bucket_name = "a2-nandkumar-kadivar"
const file_name = "temp"+Math.floor(Math.random() * (1000))

const aws_s3_client = new aws_sdk.S3({
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.token
});

const bucket_policy = {
    Bucket: bucket_name,
      Policy: JSON.stringify({
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucket_name}/*`]
          }
        ]
    })
}

var params =  {
    Bucket: bucket_name,
    PublicAccessBlockConfiguration: {
        BlockPublicAcls: false,
        BlockPublicPolicy: false,
        IgnorePublicAcls: false,
        RestrictPublicBuckets: false
    }
}

app.get("/startserver",(req,res)=>{
    axios.post("http://54.173.209.76:9000/start",{
        "banner": "B00929627",
        "ip": "52.91.229.73:50051"
    }).then((response)=>{
        console.log(response)
        res.send(response.data)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get("/test",(req,res)=>{
    res.send("Server is running ....")
})

const storeData = async (call,callback) => {
    console.log("Data storing process started!")
    try{
        await aws_s3_client.createBucket({Bucket: bucket_name},(error,data)=>{
            if(error){
                console.log(error)
            }else{
                aws_s3_client.putPublicAccessBlock(params,(error,data)=>{
                    if(error){
                        console.log(error)
                    }else{
                        aws_s3_client.putBucketPolicy(bucket_policy,(error,data)=>{
                            if(error){
                                console.log(error)
                            }else {
                                aws_s3_client.upload({
                                    Bucket: bucket_name,
                                    Key: file_name,
                                    Body: call.request.data
                                },(error,data)=>{
                                    if(error){
                                        console.log(error)
                                    }else{
                                        callback(null,{
                                            s3uri: data.Location
                                        })
                                    }
                                })
                            }
                        })
                    }
                });        
            }
        })
    }catch(error){
        console.log(error)
    }
    console.log("Data stored successfully!")
}

const appendData = async (call,callback) => {
    console.log("Data appending process started!")
    var new_data = call.request.data

    aws_s3_client.getObject({Bucket: "a2-nandkumar-kadivar",Key: file_name},(error,data)=>{
        if(error){
            console.log(error)
        }else{
            var current_data = data.Body.toString()
            var new_content = current_data+new_data

            aws_s3_client.deleteObject({Bucket: bucket_name, Key: file_name},(error,data)=>{
                if(error){
                    console.log(error)
                    callback(null,{})
                }else {
                    aws_s3_client.upload({
                        Bucket: bucket_name,
                        Key: file_name,
                        Body: new_content
                    },(error,data)=>{
                        if(error){
                            console.log(error)
                        }else{
                            console.log("Data appended successfullly!")
                        }
                        callback(null,{})
                    })     
                }
            })
        }
    })
}

const deleteFile = async (call,callback) => {
    console.log("Data deleting process started!")
    var file_uri = call.request.s3uri
    var file_name = file_uri.split("/")[3]
    
    aws_s3_client.deleteObject({Bucket: bucket_name, Key: file_name},(error,data) => {
        if(error){
            console.log(error)
        }else {
            console.log(data)
        }
        callback(null,{})
    })
    console.log("Data deleted successfully!")
    
}

const grpc_server = new grpc.Server()
grpc_server.addService(computeandstorageProto.computeandstorage.EC2Operations.service,{storeData:storeData,appendData: appendData,deleteFile:deleteFile})

grpc_server.bindAsync('0.0.0.0:50051',grpc.ServerCredentials.createInsecure(),()=>{
    grpc_server.start()
})

