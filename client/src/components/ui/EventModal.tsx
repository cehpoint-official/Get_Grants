import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { insertEventSchema, InsertEvent } from "@shared/schema";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InsertEvent & { id?: string }) => Promise<void> | void;
  initialData?: {
    id?: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    location?: string;
  } | null;
}

export function EventModal({ isOpen, onClose, onSubmit, initialData }: EventModalProps) {
  const form = useForm<InsertEvent>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      description: "",
      start: new Date(),
      end: new Date(),
      allDay: false,
      location: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          title: initialData.title,
          description: initialData.description || "",
          start: initialData.start,
          end: initialData.end,
          allDay: initialData.allDay || false,
          location: initialData.location || "",
        });
      } else {
        form.reset({ title: "", description: "", start: new Date(), end: new Date(), allDay: false, location: "" });
      }
    }
  }, [isOpen, initialData, form]);

  const handleSubmit = async (data: InsertEvent) => {
    await onSubmit(initialData?.id ? { ...data, id: initialData.id } : data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Event description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" value={toInputDateTime(field.value)} onChange={(e) => field.onChange(new Date(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" value={toInputDateTime(field.value)} onChange={(e) => field.onChange(new Date(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Optional location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allDay"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                  </FormControl>
                  <FormLabel>All day</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">{initialData ? "Save" : "Create"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function toInputDateTime(value: any) {
  const d = value instanceof Date ? value : new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}


