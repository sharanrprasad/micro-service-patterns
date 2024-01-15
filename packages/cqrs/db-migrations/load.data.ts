import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocumentClient, BatchWriteCommand} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({endpoint: 'http://localhost:8000'});


async function batchWriteItems() {
    const ddbDocClient = DynamoDBDocumentClient.from(client);
    try {
        return await ddbDocClient.send(
            new BatchWriteCommand({
                RequestItems: {
                    TasksApp: [
                        {
                            PutRequest: {
                                Item: {
                                    PK: "user#1234",
                                    SK: "user#1234",
                                    Email: "billy@gmail.com",
                                    Name: "Billy Johnson",
                                    Status: 'Employed'
                                },
                            },
                        },
                        {
                            PutRequest: {
                                Item: {
                                    PK: "user#1234",
                                    SK: "task#1234",
                                    Task_Status: "Started",
                                },
                            },
                        },
                        {
                            PutRequest: {
                                Item: {
                                    PK: "task#1234",
                                    SK: "task#1234",
                                    Task_Name: "Produce one more season of Seinfeld",
                                },
                            },
                        },

                    ],
                },
                //This line returns in the response how much capacity the batch get uses
                ReturnConsumedCapacity: "TOTAL",
            })
        );
    } catch (err) {
        console.error(err);
        return null;
    }
}

batchWriteItems()
    .then((data) =>
        console.log("BatchWriteCommand succeeded:", JSON.stringify(data, null, 2)))
    .catch((error) => console.error(JSON.stringify(error, null, 2)));


