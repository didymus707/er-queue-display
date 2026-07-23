"use client";

import { QueueEntry } from "@/lib/types";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type PickedEntry = Pick<
  QueueEntry,
  "id" | "initials" | "queue_number" | "room" | "status"
>;
interface Props {
  initialQueueEntries: PickedEntry[];
}

const supabase = createClient();

export default function QueueDisplay({ initialQueueEntries }: Props) {
  console.log("initialQueueEntries:", initialQueueEntries);
  const [entries, setEntries] = useState<PickedEntry[]>(initialQueueEntries);
  const waiting = entries.filter((entry) => entry.status === "waiting");
  const nowCalling = entries.filter(
    (entry) => entry.status === "called" || entry.status === "recalled",
  );

  useEffect(() => {
    const channel = supabase
      .channel("live-queue")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "queue_entries",
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          setEntries((currentEntries) => {
            if (eventType === "UPDATE" && newRecord) {
              if (newRecord.status === "done") {
                return currentEntries.filter(
                  (entry) => entry.id !== newRecord.id,
                );
              }

              return currentEntries.map((entry) =>
                entry.id === newRecord.id ? (newRecord as PickedEntry) : entry,
              );
            }

            if (eventType === "DELETE" && oldRecord) {
              return currentEntries.filter(
                (entry) => entry.id !== oldRecord.id,
              );
            }

            if (eventType === "INSERT" && newRecord) {
              if (currentEntries.some((entry) => entry.id === newRecord.id))
                return currentEntries;
              return [...currentEntries, newRecord as PickedEntry];
            }

            return currentEntries;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      <div className="grid grid-cols-2">
        <div>
          <h2 className="text-xl font-bold mb-4">Now Calling</h2>
          <ul className="space-y-2">
            {nowCalling.map((arr) => (
              <div key={arr.id}>
                <li>
                  {`${arr.initials}-${String(arr.queue_number).padStart(3, "0")} to ${arr.room}`}
                </li>
              </div>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Waiting</h2>
          <ul className="space-y-2">
            {waiting.map((arr) => (
              <div key={arr.id}>
                <li>
                  {`${arr.initials}-${String(arr.queue_number).padStart(3, "0")}`}
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
