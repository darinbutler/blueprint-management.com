import { Resend } from "resend";
import { requireSecret } from "./env";

export function getResend() {
  return new Resend(requireSecret("RESEND_API_KEY"));
}

// Re-export for backward-compat with existing imports
export { requireAdminToken } from "./auth";
