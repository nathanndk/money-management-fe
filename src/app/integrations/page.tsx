"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Integrations() {
  const [name, setName] = useState("Nathan");
  const [greet, setGreet] = useState<any>(null);
  const [query, setQuery] = useState("travel");
  const [agents, setAgents] = useState<any>(null);

  const callIcp = async () => {
    setGreet(null);
    const res = await fetch("/api/icp/greet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const j = await res.json();
    setGreet(j);
  };

  const searchAgents = async () => {
    setAgents(null);
    const res = await fetch(
      `/api/fetchai/search?q=${encodeURIComponent(query)}&limit=5`
    );
    const j = await res.json();
    setAgents(j);
  };

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Integrations</h1>
      <Card>
        <CardHeader>
          <CardTitle>ICP canister query (greet)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={callIcp}>Call ICP</Button>
          </div>
          {greet && (
            <pre className="mt-3 whitespace-pre-wrap text-xs">
              {JSON.stringify(greet, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fetch.ai Agentverse search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search agents..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={searchAgents}>Search</Button>
          </div>
          {agents && (
            <pre className="mt-3 whitespace-pre-wrap text-xs">
              {JSON.stringify(agents, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
