import { supabase } from "@/core/supabase/client";

// Fire-and-forget: reporting an error must never itself throw or block the
// UI. Only inserts (see error_logs RLS) — the reporter can't read back what
// they've sent, only platform admins can.
export function reportClientError(message: string, stack?: string, context?: Record<string, unknown>) {
  void (async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      await supabase.from("error_logs").insert({
        user_id: userData.user.id,
        message: message.slice(0, 2000),
        stack: stack?.slice(0, 8000),
        url: window.location.href,
        context: (context ?? {}) as unknown as Record<string, string>,
      });
    } catch {
      // Reporting is best-effort only.
    }
  })();
}

export function installGlobalErrorReporting() {
  window.addEventListener("error", (event) => {
    reportClientError(event.message, event.error?.stack);
  });
  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const message = reason instanceof Error ? reason.message : String(reason);
    const stack = reason instanceof Error ? reason.stack : undefined;
    reportClientError(message, stack, { type: "unhandledrejection" });
  });
}
