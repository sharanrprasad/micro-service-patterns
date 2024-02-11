import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ endpoint: "http://localhost:8000" });

export const main = async () => {
  const command = new CreateTableCommand({
    TableName: "TodoApp",
    AttributeDefinitions: [
      {
        AttributeName: "pk",
        AttributeType: "S",
      },
      {
        AttributeName: "sk",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "pk",
        KeyType: "HASH",
      },
      {
        AttributeName: "sk",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });
  return await client.send(command);
};

main().then(() => {
  console.log("completed");
});
