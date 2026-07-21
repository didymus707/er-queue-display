"use client";

import { QueueEntry } from "@/lib/types";

type Props = {
  queueEntries: Pick<
    QueueEntry,
    "id" | "initials" | "queue_number" | "room" | "status"
  >[];
};

export default function QueueDisplay({ queueEntries }: Props) {
  const waiting = queueEntries.filter((entry) => entry.status === "waiting");
  const nowCalling = queueEntries.filter(
    (entry) => entry.status === "called" || entry.status === "recalled",
  );

  return (
    <>
      <div className="grid grid-cols-2">
        <ul>
          <h2>Now Calling</h2>
          {nowCalling.map((arr) => (
            <div key={arr.id}>
              <li>
                {`${arr.initials}-${String(arr.queue_number).padStart(3, "0")} to ${arr.room}`}
              </li>
            </div>
          ))}
        </ul>
        <ul>
          <h2>Waiting</h2>
          {waiting.map((arr) => (
            <div key={arr.id}>
              <li>
                {`${arr.initials}-${String(arr.queue_number).padStart(3, "0")}`}
              </li>
            </div>
          ))}
        </ul>
      </div>
    </>
  );
}
