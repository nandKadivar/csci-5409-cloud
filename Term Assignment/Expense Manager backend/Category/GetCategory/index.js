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
            
            if(event.queryStringParameters && event.queryStringParameters.id) {
                const id = event.queryStringParameters.id
                const getCategoryById = {
                    TableName: "categories"
                }
    
                const categories = await db_connection.scan(getCategoryById).promise()
                var specific_category = {}
                categories.Items.forEach((item)=>{
                    if(item.id == id){
                        specific_category = item
                    }
                })
                return {
                    statusCode: 200,
                    body: JSON.stringify(specific_category)
                }
            }else {
                const getAllCategories = {
                    TableName: "categories"
                }
    
                const all_categories = await db_connection.scan(getAllCategories).promise()
                var user_categories = []
                
                all_categories.Items.forEach(category => {
                    if(category.user && category.user.id == results.Items[0].id){
                        user_categories.push(category)
                    }
                });

                return {
                    statusCode: 200,
                    body: JSON.stringify(user_categories)
                }
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