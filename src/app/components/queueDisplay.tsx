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

  const fmt = (initials: string, num: number) =>
    `${initials}-${String(num).padStart(3, "0")}`;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white px-12 py-10 font-sans">
      <div className="mb-10 pb-6 border-b border-white/10">
        <p className="text-xs tracking-widest uppercase text-white/30 mb-1">
          City General Hospital
        </p>
        <h1 className="text-2xl font-light tracking-wide text-white/60">
          Emergency Department — Queue Display
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-12">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-xs font-medium tracking-widest uppercase text-green-500">
              Now calling
            </h2>
          </div>

          {nowCalling.length === 0 ? (
            <p className="text-white/30 text-sm">
              No patients currently being called
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {nowCalling.map((e) => (
                <li
                  key={e.id}
                  className="bg-white/5 border border-white/10 border-l-2 border-l-green-500 rounded-md px-5 py-4"
                >
                  <div className="text-4xl font-bold tracking-wide tabular-nums">
                    {fmt(e.initials, e.queue_number)}
                  </div>
                  <div className="text-white/40 text-sm mt-1">
                    → {e.room ?? "Room being assigned"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-xs font-medium tracking-widest uppercase text-white/40">
              Waiting
            </h2>
          </div>

          {waiting.length === 0 ? (
            <p className="text-white/30 text-sm">No patients waiting</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {waiting.map((e, i) => (
                <li
                  key={e.id}
                  className={`flex items-center gap-4 px-4 py-3 rounded border-b border-white/5 ${i === 0 ? "bg-white/5" : ""}`}
                >
                  <span className="text-white/20 text-xs w-5 text-right">
                    {i + 1}
                  </span>
                  <span className="text-2xl font-semibold tracking-wide tabular-nums">
                    {fmt(e.initials, e.queue_number)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
