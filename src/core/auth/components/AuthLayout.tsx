import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { BarChart3, Boxes, ShieldCheck, Sparkles } from "lucide-react";
import { usePlatformSettings } from "@/core/platform-settings/hooks";

const highlights = [
  {
    icon: BarChart3,
    title: "Real-time visibility",
    description: "Revenue, stock, and staff performance in one live dashboard.",
  },
  {
    icon: Boxes,
    title: "Built for every vertical",
    description: "Retail, restaurants, pharmacies, hotels — one OS, tailored workflows.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-grade security",
    description: "Row-level tenant isolation and role-based access, by default.",
  },
];

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  const { data: platformSettings } = usePlatformSettings();
  const platformName = platformSettings?.platformName ?? "AxisOneDesk";
  // Page copy is authored with the literal "AxisOneDesk" — swap in the
  // white-labeled name so per-page subtitles stay in sync with branding
  // without every page needing to know about platform_settings itself.
  const brandedSubtitle = subtitle.replace(/AxisOneDesk/g, platformName);

  return (
    <div className="bg-background grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_20%_20%,hsl(243_75%_28%),hsl(222_47%_8%)_60%)] p-10 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(hsl(0_0%_100%)_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
            {platformSettings?.logoUrl ? (
              <img src={platformSettings.logoUrl} alt="" className="size-5 object-contain" />
            ) : (
              <Sparkles className="size-4" />
            )}
          </div>
          <span className="text-lg font-semibold tracking-tight">{platformName}</span>
        </div>

        <div className="relative flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              The Business OS that runs your operation end to end.
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/70">
              Inventory, sales, staff, and reporting — unified for retail, hospitality, and
              service businesses.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                className="flex items-start gap-3"
              >
                <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
                  <item.icon className="size-4.5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-sm text-white/60">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          &copy; {new Date().getFullYear()} {platformName}. All rights reserved.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              {platformSettings?.logoUrl ? (
                <img src={platformSettings.logoUrl} alt="" className="size-5 object-contain" />
              ) : (
                <Sparkles className="size-4" />
              )}
            </div>
            <span className="text-lg font-semibold tracking-tight">{platformName}</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-muted-foreground mt-1.5 text-sm">{brandedSubtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
