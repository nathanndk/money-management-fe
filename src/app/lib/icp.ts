import "isomorphic-fetch";
import { Actor, HttpAgent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { idlFactory } from "@/app/ic/echo.did";

const ICP_HOST = process.env.ICP_HOST || "https://icp-api.io";
const ICP_CANISTER_ID = process.env.ICP_CANISTER_ID; // required for live
const DFX_NETWORK = process.env.DFX_NETWORK; // 'ic' for mainnet

export interface EchoActor {
  greet: (name: string) => Promise<string>;
}

export function createEchoActor(canisterId?: string) {
  const id = canisterId || ICP_CANISTER_ID;
  if (!id)
    throw new Error("Missing ICP_CANISTER_ID. Provide env or pass canisterId.");
  const agent = new HttpAgent({ host: ICP_HOST });
  if (DFX_NETWORK !== "ic") {
    agent
      .fetchRootKey()
      .catch((err) => console.warn("fetchRootKey failed (dev only):", err));
  }
  const actor = Actor.createActor<EchoActor>(idlFactory as any, {
    canisterId: id as unknown as Principal,
    agent,
  });
  return actor;
}

export const echoDummy = {
  async greet(name: string) {
    await new Promise((r) => setTimeout(r, 120));
    return `Hello, ${name}. (dummy from server)`;
  },
};
