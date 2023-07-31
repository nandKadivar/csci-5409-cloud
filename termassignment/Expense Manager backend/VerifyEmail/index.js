const JWT = require('jsonwebtoken')
const AWS = require('aws-sdk')

exports.handler = async(event) => {
    try{
        const token = event.queryStringParameters.token
        const email = JWT.verify(token,"XqeAwD2q4FKYTS+S5941ubV8wVxsqiYRdxHskzQtUK4=").email

        const db_connection = new AWS.DynamoDB.DocumentClient()
        const getUserWithEmail = {
            TableName: "users",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        }

        const results = await db_connection.scan(getUserWithEmail).promise()

        if(results.Items[0].isVerified == false) {
            results.Items[0].isVerified = true

            await db_connection.put({TableName: "users",Item: results.Items[0]}).promise()

            var response = {
                statusCode: 200,
                body: "Email Verified!"
            };
            return response
        }else {
            var response = {
                statusCode: 400,
                body: "Already Verified!"
            };
            return response
        }
    }catch(error){
        var response = {
            statusCode: 400,
            body: JSON.stringify(error)
        };
        return response
    }
};