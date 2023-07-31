const AWS = require('aws-sdk')
const JWT = require('jsonwebtoken')

const generateId = () => {
    const lower = 1000
    const upper = 9999
    
    return Math.floor(Math.random() * (upper - lower + 1)) + lower
}

exports.handler = async(event) => {
    try {
        const db_connection = new AWS.DynamoDB.DocumentClient()
        const jwt_token_header = event.headers.authorization
        const jwt_token = jwt_token_header.substring(7)
        const jwt_token_data = JWT.verify(jwt_token,"XqeAwD2q4FKYTS+S5941ubV8wVxsqiYRdxHskzQtUK4=")

        const getUserWithEmail = {
            TableName: "users",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": jwt_token_data.email
            }
        }

        const results = await db_connection.scan(getUserWithEmail).promise()
        
        if(results.Items.length != 0 && results.Items[0].isVerified){
            const user = {
                id: results.Items[0].id,
                fname: results.Items[0].fname,
                lname: results.Items[0].lname,
                email: results.Items[0].email
            }
            
            const req = JSON.parse(event.body)
            await db_connection.put({TableName: "alerts",Item: {id: generateId(),user: user, ...req}}).promise()
            
            return {
                statusCode: 200,
                body: "Success"
            }
           
        }else {
            return {
                statusCode: 400,
                body: "User not found"
            }
        }
       
    }catch(error){
        var response = {
            statusCode: 400,
            body: JSON.stringify(error)
        }
        return response
    }
};
