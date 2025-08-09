import "isomorphic-fetch";
import { z } from "zod";

const BASE = process.env.AGENTVERSE_BASE_URL || "https://agentverse.ai/v1";
const KEY = process.env.AGENTVERSE_API_KEY; // optional in dev, required in prod

const SearchResponse = z.array(
  z.object({
    address: z.string().optional(),
    name: z.string().optional(),
    readme: z.string().optional(),
    status: z.string().optional(),
    total_interactions: z.number().optional(),
    recent_interactions: z.number().optional(),
    type: z.string().optional(),
    category: z.string().optional(),
    last_updated: z.string().optional(),
    created_at: z.string().optional(),
  })
);
export type AgentSearchItem = z.infer<typeof SearchResponse>[number];

export async function agentverseSearch(
  query: string,
  limit = 5
): Promise<AgentSearchItem[]> {
  if (!KEY) return dummyAgents(query, limit);
  const body = {
    filters: { state: [], category: [], agent_type: [], protocol_digest: [] },
    sort: "relevancy",
    direction: "asc",
    search_text: query,
    offset: 0,
    limit,
  };
  const res = await fetch(`${BASE}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Agentverse search failed: ${res.status}`);
  const json = await res.json();
  const parsed = SearchResponse.safeParse(json);
  if (!parsed.success) throw new Error("Invalid Agentverse schema");
  return parsed.data;
}

function dummyAgents(q: string, limit: number) {
  const base = [
    {
      name: "PriceWatcher",
      readme: "Tracks prices of e‑commerce items and alerts on drops.",
      status: "active",
      total_interactions: 1024,
      recent_interactions: 128,
      type: "hosted",
      category: "fetch-ai",
    },
    {
      name: "TripPlanner",
      readme: "Builds travel itineraries and books services via partner APIs.",
      status: "active",
      total_interactions: 2048,
      recent_interactions: 256,
      type: "hosted",
      category: "community",
    },
  ];
  return base
    .filter((x) => !q || x.name?.toLowerCase().includes(q.toLowerCase()))
    .slice(0, Math.max(1, limit));
}
