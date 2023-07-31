const AWS = require('aws-sdk')

exports.handler = async(event) => {
    try {
        const req = JSON.parse(event.body)
        const db_connection = new AWS.DynamoDB.DocumentClient()
        const deleteTransactionById = {
            TableName: "transactions",
            Key: {id: req.id}
        }

        await db_connection.delete(deleteTransactionById).promise()
        
        var response = {
            statusCode: 200,
            body: "Success"
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
