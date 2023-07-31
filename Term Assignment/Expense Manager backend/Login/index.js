const JWT = require('jsonwebtoken')
const AWS = require('aws-sdk')
const bcrypt = require('bcryptjs')

exports.handler = async(event) => {
    try{
        const db_connection = new AWS.DynamoDB.DocumentClient()
        const req = JSON.parse(event.body)
        const email = req.email
        const password = req.password

        const getUserWithEmail = {
            TableName: "users",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        }

        const results = await db_connection.scan(getUserWithEmail).promise()
        
        if(results.Items.length != 0){
            const user = results.Items[0]

            if(user.isVerified == true) {
                const password_match = await bcrypt.compare(password,user.password)
                if(password_match){
                    const jwt_token = await JWT.sign({email: email},"XqeAwD2q4FKYTS+S5941ubV8wVxsqiYRdxHskzQtUK4=",{expiresIn: '24h'})
            
                    await db_connection.put({TableName: "jwt_tokens",Item: {user_id: user.id,token: jwt_token}}).promise()

                    var response = {
                        statusCode: 200,
                        body: jwt_token
                    }
                    return response
                }else {
                    var response = {
                        statusCode: 400,
                        body: "Bad credentials!"
                    }
                    return response
                }
            }else {
                var response = {
                    statusCode: 400,
                    body: "Email is not verified!"
                }
                return response
            }
        }else {
            var response = {
                statusCode: 400,
                body: "User not found!"
            }
            return response
        }
    }catch(error){
        var response = {
            statusCode: 400,
            body: JSON.stringify(error)
        }
        return response
    }
};