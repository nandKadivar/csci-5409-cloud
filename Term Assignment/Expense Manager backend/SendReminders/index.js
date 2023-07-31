const AWS = require('aws-sdk')
const MAILER = require('nodemailer')

exports.handler = async(event) => {
    try {
        const db_connection = new AWS.DynamoDB.DocumentClient()
        
        
        const getAllUsers = {
            TableName: "users",
            FilterExpression: "isVerified = :isVerified",
            ExpressionAttributeValues: {
                ":isVerified": true
            }
        }

        const users = await db_connection.scan(getAllUsers).promise()

        const mail = MAILER.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: 'expensemanager891@gmail.com',
                pass: 'odtrfkolbdhyglwc'
            }
        });

        var res = []
        for(let i=0; i<users.Items.length;i++){
            var email = users.Items[i].email
        
            var payload = {
                from: "expensemanager891@gmail.com",
                to: email,
                subject: "Reminder",
                text: "Did you record todays transactions?"
            };
        
            const status = await mail.sendMail(payload);
            if(status.accepted[0] == email){
                res.push(email)
            }
        }

        var response = {
            statusCode: 200,
            body: JSON.stringify(res)
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