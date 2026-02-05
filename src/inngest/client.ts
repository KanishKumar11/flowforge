import { Inngest } from "inngest";

const isDev = process.env.NODE_ENV === "development";

export const inngest = new Inngest({
  id: "Flowgent",
  eventKey: process.env.INNGEST_EVENT_KEY || (isDev ? "local" : undefined),
});
