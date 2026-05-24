export function isLocalPublicJsonMode(): boolean {
  const m = process.env.NEXT_PUBLIC_ENV_MODE?.trim().toLowerCase();
  return m === "dev" || m === "development";
}
