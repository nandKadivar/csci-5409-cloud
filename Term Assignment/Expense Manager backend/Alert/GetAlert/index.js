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
                const getAlertById = {
                    TableName: "alerts"
                }
    
                const alerts = await db_connection.scan(getAlertById).promise()
                var specific_alert = {}
                alerts.Items.forEach((item)=>{
                    if(item.id == id){
                        specific_alert = item
                    }
                })
                return {
                    statusCode: 200,
                    body: JSON.stringify(specific_alert)
                }
            }else {
                const getAllAlerts = {
                    TableName: "alerts"
                }
    
                const all_alerts = await db_connection.scan(getAllAlerts).promise()
                var user_alerts = []
                
                all_alerts.Items.forEach(alert => {
                    if(alert.user && alert.user.id == results.Items[0].id){
                        user_alerts.push(alert)
                    }
                });

                return {
                    statusCode: 200,
                    body: JSON.stringify(user_alerts)
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
