const crypt = require("crypto")
const axios = require("axios")

exports.handler = async (event) => {

  const uri = event.course_uri
  const data = event.value

  const hashed_data = crypt.createHash("md5").update(data).digest("hex")

  const payload = {
    "banner": "B00929627",
    "result": hashed_data,
    "arn": "arn:aws:lambda:us-east-1:140877317433:function:md5-lambda",
    "action": "md5",
    "value": data
  }

  await axios.post(uri,payload).then((res)=>{
    
  })

  const response = {
    statusCode: 200,
    body: JSON.stringify(hashed_data),
  };
  return response;
};
  