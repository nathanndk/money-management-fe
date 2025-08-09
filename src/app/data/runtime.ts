// Dev-only in-memory users (cleared on restart). Do NOT use in prod.
export type RuntimeUser = { id: string; name: string; email: string; password: string };
export const volatileUsers: RuntimeUser[] = [];