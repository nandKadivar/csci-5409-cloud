const JWT = require('jsonwebtoken')
const AWS = require('aws-sdk')
const bcrypt = require('bcryptjs')
const MAILER = require('nodemailer')

const generateId = () => {
    const lower = 1000
    const upper = 9999
    
    return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

exports.handler = async(event) => {
    try {
        const db_connection = new AWS.DynamoDB.DocumentClient()
        
        const req = JSON.parse(event.body)
        const id = generateId()
        const fname = req.fname
        const lname = req.lname
        const email = req.email
        const password = await bcrypt.hash(req.password,10)
        
        const getUserWithEmail = {
            TableName: "users",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        }

        const results = await db_connection.scan(getUserWithEmail).promise()
        
        if(results.Items.length == 0) {
        
            const jwt_token = await JWT.sign({email: email},"XqeAwD2q4FKYTS+S5941ubV8wVxsqiYRdxHskzQtUK4=",{expiresIn: '24h'})
            
            const mail = MAILER.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                user: 'expensemanager891@gmail.com',
                pass: 'odtrfkolbdhyglwc'
                }
            });
        
            const link = "https://"+process.env.API_GATEWAY_ID+".execute-api."+process.env.API_GATEWAY_REGION+".amazonaws.com/default/verifyemail?token="+jwt_token
    
            const payload = {
                from: "expensemanager891@gmail.com",
                to: email,
                subject: "Verify Account",
                text: "Verification link: "+link
            };
        
            const status = await mail.sendMail(payload);

            if(status.accepted[0] == email){
                await db_connection.put({TableName: "users",Item: {id,fname,lname,email,password,isVerified: false}}).promise()
                
                var response = {
                    statusCode: 200,
                    body: "Success"
                }
            }else {
                var response = {
                    statusCode: 400,
                    body: JSON.stringify(status.rejected)
                }    
            }
        }else {
            var response = {
                statusCode: 400,
                body: "User alerady exist"
            }
        }
        return response
    }catch(error){
        var response = {
            statusCode: 400,
            body: JSON.stringify(error)
        }
        return response
    }
};