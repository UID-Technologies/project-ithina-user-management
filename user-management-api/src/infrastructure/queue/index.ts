/** Job queue placeholder — swap for BullMQ / SQS when needed */
export const queue = {
  enqueue(_jobName: string, _payload: unknown): void {},
};
