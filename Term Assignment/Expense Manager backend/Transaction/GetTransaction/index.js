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
                const getTransactionById = {
                    TableName: "transactions"
                }
    
                const transactions = await db_connection.scan(getTransactionById).promise()
                var specific_transaction = {}
                transactions.Items.forEach((item)=>{
                    if(item.id == id){
                        specific_transaction = item
                    }
                })
                return {
                    statusCode: 200,
                    body: JSON.stringify(specific_transaction)
                }
            }else {
                const getAllTransactions = {
                    TableName: "transactions"
                }
    
                const all_transactions = await db_connection.scan(getAllTransactions).promise()
                var user_transactions = []
                
                all_transactions.Items.forEach(transaction => {
                    if(transaction.user && transaction.user.id == results.Items[0].id){
                        user_transactions.push(transaction)
                    }
                });

                return {
                    statusCode: 200,
                    body: JSON.stringify(user_transactions)
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
