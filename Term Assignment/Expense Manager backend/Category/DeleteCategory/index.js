const AWS = require('aws-sdk')
const JWT = require('jsonwebtoken')

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
            const req = JSON.parse(event.body)
            const deleteCategoryById = {
                TableName: "categories",
                Key: {id: req.id}
            }
    
            await db_connection.delete(deleteCategoryById).promise()
            
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
            statusCode: 401,
            body: "Unauthorized"
        }
        return response
    }
};
