---
title: Form Template
---
# FORM_TEMPLATE

Pair with [16_PLAYBOOKS/CREATE_FORM.md](../16_PLAYBOOKS/CREATE_FORM.md). react-hook-form + zod, per the codebase's only form pattern.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreate<Name> } from "@/modules/<name>/hooks";

const schema = z.object({
  name: z.string().min(1, "Required"),
});

export function <Name>Form() {
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });
  const create = useCreate<Name>();

  return (
    <form onSubmit={form.handleSubmit((values) => create.mutate(values))}>
      {/* fields from src/shared/components/forms */}
    </form>
  );
}
```
