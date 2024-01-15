import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({endpoint: 'http://localhost:8000'});

export const main = async () => {
    const command = new CreateTableCommand({
        TableName: "TasksApp",
        AttributeDefinitions: [
            {
                AttributeName: "PK",
                AttributeType: "S",
            },
            {
                AttributeName: "SK",
                AttributeType: "S",
            },
        ],
        KeySchema: [
            {
                AttributeName: "PK",
                KeyType: "HASH",
            },
            {
                AttributeName: "SK",
                KeyType: "RANGE",
            },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
        },
    });

    const response = await client.send(command);
    console.log(response);
    return response;
};


main().then(() => {
    console.log('completed')
})