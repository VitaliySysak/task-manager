'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

export function GoogleCheckbox({ className, checked, onChange }: Props) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950">
        <Checkbox
          id="toggle-2"
          checked={checked}
          onCheckedChange={onChange}
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">Add as google event</p>
          <p className="text-muted-foreground text-sm">Check this box to add this task to google events.</p>
        </div>
      </Label>
    </div>
  );
}
