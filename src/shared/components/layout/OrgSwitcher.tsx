import { Check, ChevronsUpDown } from "lucide-react";
import { useCurrentOrganization } from "@/core/tenant/OrganizationProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";

export function OrgSwitcher() {
  const { organizations, activeOrg, activeOrgId, setActiveOrgId, isLoading } =
    useCurrentOrganization();

  if (isLoading) {
    return (
      <div className="mr-1 hidden flex-col items-end gap-1 md:flex">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  if (!activeOrg) return null;

  if (organizations.length <= 1) {
    return (
      <div className="mr-1 hidden flex-col items-end leading-tight md:flex">
        <span className="text-sm font-medium">{activeOrg.name}</span>
        <span className="text-muted-foreground text-xs capitalize">
          {activeOrg.businessType} workspace
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="hover:bg-muted/60 mr-1 hidden flex-col items-end gap-0.5 rounded-md px-2 py-1 leading-tight transition-colors md:flex">
          <span className="flex items-center gap-1 text-sm font-medium">
            {activeOrg.name}
            <ChevronsUpDown className="text-muted-foreground size-3.5" />
          </span>
          <span className="text-muted-foreground text-xs capitalize">
            {activeOrg.businessType} workspace
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((org) => (
          <DropdownMenuItem
            key={org.id}
            onClick={() => setActiveOrgId(org.id)}
            className="justify-between"
          >
            <div className="flex flex-col">
              <span className="text-sm">{org.name}</span>
              <span className="text-muted-foreground text-xs capitalize">{org.businessType}</span>
            </div>
            <Check className={cn("size-4", org.id === activeOrgId ? "opacity-100" : "opacity-0")} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
