"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FormMultiComboboxItem {
  id: string;
  name: string;
}

interface FormMultiComboboxProps {
  items: FormMultiComboboxItem[];
  selectedIds: string[];
  onToggle: (itemId: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  showSelectedBadges?: boolean;
}

export function FormMultiCombobox({
  items,
  selectedIds,
  onToggle,
  placeholder = "Pilih item...",
  searchPlaceholder = "Cari item...",
  emptyMessage = "Tidak ada item ditemukan.",
  className,
  error = false,
  disabled = false,
  showSelectedBadges = true,
}: FormMultiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedCount = selectedIds.length;
  const displayText =
    selectedCount > 0 ? `${selectedCount} item dipilih` : placeholder;

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600 hover:text-white",
              error && "border-red-500",
              className
            )}
          >
            {displayText}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 border-slate-600">
          <Command className="bg-popover [&_[data-slot=command-input-wrapper]]:border-slate-600">
            <CommandInput
              placeholder={searchPlaceholder}
              className="border-0 text-slate-200 placeholder:text-slate-400 focus:ring-0"
            />
            <CommandList>
              <CommandEmpty className="text-slate-400 p-4 text-center">
                {emptyMessage}
              </CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.name}
                    onSelect={() => {
                      onToggle(item.id);
                    }}
                    className="text-slate-200 hover:bg-slate-700 cursor-pointer data-[highlighted]:bg-slate-700"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedIds.includes(item.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Items Display */}
      {showSelectedBadges && selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedIds.map((itemId) => {
            const item = items.find((i) => i.id === itemId);
            return item ? (
              <span
                key={itemId}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-sky-500/20 text-sky-200 border border-sky-500/30"
              >
                {item.name}
                <button
                  type="button"
                  onClick={() => onToggle(itemId)}
                  className="ml-1 hover:text-sky-100"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}
