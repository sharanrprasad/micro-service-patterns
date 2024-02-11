export enum TodoStatus {
  Todo = "todo",
  Scheduled = "scheduled",
  Done = "done",
}

export type TodoLocation = {
  address: string;
  placeId: string;
  geoLocation: {
    lat: number;
    lng: number;
  };
};

export type TodoItem = {
  title: string;
  status: TodoStatus;
  location: TodoLocation;
  id: string;
  userId: string;
};
