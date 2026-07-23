import { createClient } from "@/lib/supabase/server";
import QueueDisplay from "./components/queueDisplay";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("queue_entries")
    .select("id, initials, queue_number, room, status")
    .neq("status", "done")
    .order("checked_in_at", { ascending: true });

  console.log(error);

  return (
    <>
      <main>
        {data ? (
          <>
            <QueueDisplay initialQueueEntries={data} />
          </>
        ) : (
          <>
            <p>No queue entry is available</p>
          </>
        )}
      </main>
    </>
  );
}
