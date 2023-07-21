const bcrypt = require("bcryptjs")
const axios = require("axios")

exports.handler = async (event) => {

  const uri = event.course_uri
  const data = event.value

  const hashed_data = await bcrypt.hash(data,10)

  const payload = {
    "banner": "B00929627",
    "result": hashed_data,
    "arn": "arn:aws:lambda:us-east-1:140877317433:function:bcrypt-lambda",
    "action": "bcrypt",
    "value": data
  }

  await axios.post(uri,payload).then((res)=>{
    
  })

  const response = {
    statusCode: 200,
    body: hashed_data,
  }

  return response
};