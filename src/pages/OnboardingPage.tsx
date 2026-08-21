import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { OnboardingForm } from "@/core/tenant/components/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="bg-muted/30 flex min-h-svh items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <div className="bg-card rounded-xl border p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <Sparkles className="size-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">AxisOneDesk</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Set up your workspace</h1>
          <p className="text-muted-foreground mt-1.5 mb-6 text-sm">
            Tell us about your business so we can tailor AxisOneDesk to how you operate.
          </p>

          <OnboardingForm />
        </div>
      </motion.div>
    </div>
  );
}

export { OnboardingPage as Component };
