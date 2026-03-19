"use client";

import { useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomFeaturesProps {
  form: UseFormReturn<any>;
}

export function RoomFeatures({ form }: RoomFeaturesProps) {
  const { control, register, setValue, formState: { errors } } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "features",
  });

  const defaultCategories = [
    "Kitchen",
    "Bathroom",
    "Bedroom",
    "Living Room",
    "Outdoor",
    "Other",
  ];

  const [customCategory, setCustomCategory] = useState<{ [key: number]: boolean }>({});

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="text-xl">Room Features</CardTitle>
        <CardDescription>
          Add amenities and features available in this room
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border rounded-lg bg-card space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Feature #{index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Field */}
              <div className="space-y-2">
                <Label htmlFor={`features.${index}.category`} className="text-sm">
                  Category
                </Label>

                {!customCategory[index] ? (
                  <Select
                    onValueChange={(value) => {
                      if (value === "custom") {
                        setCustomCategory((prev) => ({ ...prev, [index]: true }));
                      } else {
                        setValue(`features.${index}.category`, value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultCategories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Add Custom</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={`features.${index}.category`}
                    placeholder="Enter custom category"
                    {...register(`features.${index}.category`)}
                  />
                )}
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor={`features.${index}.name`} className="text-sm">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`features.${index}.name`}
                  placeholder="e.g., wifi, tv"
                  {...register(`features.${index}.name`)}
                  className={
                    (errors as any).features?.[index]?.name ? "border-destructive" : ""
                  }
                />
                {(errors as any).features?.[index]?.name && (
                  <p className="text-sm text-destructive">
                    {(errors as any).features[index]?.name?.message}
                  </p>
                )}
              </div>

              {/* Value Field */}
              <div className="space-y-2">
                <Label htmlFor={`features.${index}.value`} className="text-sm">
                  Value
                </Label>
                <Input
                  id={`features.${index}.value`}
                  placeholder="e.g., true, 2 beds"
                  {...register(`features.${index}.value`)}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ category: "", name: "", value: "" })}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </CardContent>
    </Card>
  );
}
