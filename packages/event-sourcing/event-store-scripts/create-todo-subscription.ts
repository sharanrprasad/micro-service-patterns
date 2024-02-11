import "dotenv/config";
import {
  EventStoreDBClient,
  persistentSubscriptionToAllSettingsFromDefaults,
  streamNameFilter,
} from "@eventstore/db-client";
import AppConstants from "../src/core/app.constants";

console.log(process.env["EVENT_STORE_URL"]);

async function createTodoSubscriptionStream() {
  const client = EventStoreDBClient.connectionString(
    process.env.EVENT_STORE_URL as string,
  );

  await client.createPersistentSubscriptionToAll(
    AppConstants.TodoSubscriptionGroupName,
    persistentSubscriptionToAllSettingsFromDefaults(),
    {
      filter: streamNameFilter({
        prefixes: [AppConstants.EventStoreTodoPrefixStream],
      }),
      credentials: { username: "admin", password: "changeit" },
    },
  );
}

createTodoSubscriptionStream()
  .then(() => {
    console.log("Completed task");
  })
  .catch((err) => {
    console.error(err);
  });
