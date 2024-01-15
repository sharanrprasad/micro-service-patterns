
export interface BaseDbEntry {
    pk: string;
    sk: string;
}
export interface TaskDbEntry extends BaseDbEntry {
    taskName: string;
}