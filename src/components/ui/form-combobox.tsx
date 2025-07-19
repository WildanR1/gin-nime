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

interface FormComboboxItem {
  id: string;
  name: string;
}

interface FormComboboxProps {
  items: FormComboboxItem[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
}

export function FormCombobox({
  items,
  value,
  onValueChange,
  placeholder = "Pilih item...",
  searchPlaceholder = "Cari item...",
  emptyMessage = "Tidak ada item ditemukan.",
  className,
  error = false,
  disabled = false,
}: FormComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedItem = items.find((item) => item.id === value);

  return (
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
          {selectedItem ? selectedItem.name : placeholder}
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
                    onValueChange(item.id);
                    setOpen(false);
                  }}
                  className="text-slate-200 hover:bg-slate-700 cursor-pointer data-[highlighted]:bg-slate-700"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === item.id ? "opacity-100" : "opacity-0"
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
  );
}
