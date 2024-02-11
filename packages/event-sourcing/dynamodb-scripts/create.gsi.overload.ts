import { UpdateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ endpoint: "http://localhost:8000" });

async function createIndex() {
  try {
    return await client.send(
      new UpdateTableCommand({
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
        GlobalSecondaryIndexUpdates: [
          {
            Create: {
              IndexName: "GsiOverload",
              KeySchema: [
                {
                  AttributeName: "sk",
                  KeyType: "HASH", // Secondary key in main table becomes Partition key
                },
                {
                  AttributeName: "pk",
                  KeyType: "RANGE", // Vice versa
                },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
              // If the base table is in on-demand mode, the ProvisionedThroughput object can be omitted entirely.
              ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
              },
            },
          },
        ],
      }),
    );
  } catch (err) {
    console.error(err);
    return null;
  }
}

createIndex()
  .then((data) => console.log(data))
  .catch((error) =>
    console.log(
      "An error occurred while creating the index:" + " " + error.message,
    ),
  );
