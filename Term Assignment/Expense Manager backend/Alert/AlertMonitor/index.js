const AWS = require('aws-sdk')
const db_connection = new AWS.DynamoDB.DocumentClient()
const MAILER = require('nodemailer')

const getMonhlyTransactionsByCategory = async (month, category) => {
    const getAllTransactions = {
        TableName: "transactions"
    }

    const transactions = await db_connection.scan(getAllTransactions).promise()
    var transactions_by_category = []
    transactions.Items.forEach(transaction => {
        if(transaction.type === "expense" && transaction.category.name === category && transaction.month === month){
            transactions_by_category.push(transaction)
        }
    });

    return transactions_by_category
}

const calculateMonthlyExpenseByCategory = async (month, category) => {
    const transactions = await getMonhlyTransactionsByCategory(month,category)
    var sum = 0.0
    transactions.forEach(transaction => {
        sum += parseFloat(transaction.amount)
    })

    return sum
}

exports.handler = async(event,context) => {
    try {
        const req = event
        const getAllAlerts = {
            TableName: "alerts"
        }
        const all_alerts = await db_connection.scan(getAllAlerts).promise()
        var message= ""
        if(all_alerts.Items.length >= 1){
            for(var i=0;i<all_alerts.Items.length;i++){
                for(var j=0;j<all_alerts.Items[i].fields.length;j++){
                    if(all_alerts.Items[i].fields[j].category == req.category){
                        const sum = await calculateMonthlyExpenseByCategory(req.month,req.category)
                        if(sum >= all_alerts.Items[i].fields[j].amount){
                            message = "Send Alert"
                        }else {
                            message = "No Alert"
                        }
                    }
                }
            }
        }else {
            message = "No Alert"
        }

        
        if(message == "Send Alert"){
            const mail = MAILER.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                user: 'expensemanager891@gmail.com',
                pass: 'odtrfkolbdhyglwc'
                }
            });
        
            const payload = {
                from: "expensemanager891@gmail.com",
                to: req.email,
                subject: "Budget Alert",
                text: "Your budget triggered"
            };
        
            await mail.sendMail(payload);
            
            var response = {
                statusCode: 200,
                body: message
            }
            
            return message
        }else {
            var response = {
                statusCode: 200,
                body: message
            }
            
            return message
        }
        
    }catch(error){
        var response = {
            statusCode: 400,
            body: JSON.stringify(error)
        }
        return response
    }
};