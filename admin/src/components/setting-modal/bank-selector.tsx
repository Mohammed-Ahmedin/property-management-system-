import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useCreateSubAccountMutation } from "@/hooks/api/use-payment";
import { Button } from "../ui/button";

const banks = [
  { id: 130, name: "Abay Bank" },
  { id: 772, name: "Addis International Bank" },
  { id: 207, name: "Ahadu Bank" },
  { id: 656, name: "Awash Bank" },
  { id: 347, name: "Bank of Abyssinia" },
  { id: 571, name: "Berhan Bank" },
  { id: 128, name: "CBEBirr" },
  { id: 94, name: "Commercial Bank of Ethiopia (CBE)" },
  { id: 999, name: "Dashen Bank" },
  { id: 1, name: "Enat Bank" },
  { id: 301, name: "Global Bank Ethiopia" },
  { id: 534, name: "Hibret Bank" },
  { id: 315, name: "Anbesa Bank" },
  { id: 855, name: "Telebirr" },
  { id: 472, name: "Wegagen Bank" },
];

export function BankSelector({ code, setValue }: { code: any; setValue: any }) {
  const [open, setOpen] = React.useState(false);
  const [selectedBank, setSelectedBank] = React.useState<any>({});

  return (
    <div className="w-full max-w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedBank ? selectedBank.name : "Select a bank..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder="Search bank..." />
            <CommandList>
              <CommandEmpty>No bank found.</CommandEmpty>
              <CommandGroup heading="Banks">
                {banks.map((bank) => (
                  <CommandItem
                    key={bank.id}
                    onSelect={() => {
                      setSelectedBank(bank);
                      setValue("bankCode", bank.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBank?.id === bank.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {bank.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedBank && (
        <div className="mt-2 text-sm text-muted-foreground">
          Selected ID: <span className="font-medium">{selectedBank.id}</span>
        </div>
      )}
    </div>
  );
}


