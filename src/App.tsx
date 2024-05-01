import { zodResolver } from "@hookform/resolvers/zod";
import {
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

const FormSchema = z.object({
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
});

export default function App() {
  const [text, setText] = useState<string>("");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>): void {
    toast({
      title: calculateAge(data.dob),
    });
  }

  function calculateAge(birthDate: Date | string): string {
    const birthDateObj =
      typeof birthDate === "string" ? new Date(birthDate) : birthDate;
    const today = new Date();
    const years = differenceInYears(today, birthDateObj);
    const months = differenceInMonths(today, birthDateObj) % 12;
    const lastBirthday = new Date(
      today.getFullYear() - years,
      birthDateObj.getMonth(),
      birthDateObj.getDate()
    );
    const days = differenceInDays(today, lastBirthday);

    const text = `You are ${years} years, ${months} months, ${days} days old`;

    setText(text);

    return text;
  }

  return (
    <>
      <main className="flex-center flex-col w-screen h-screen gap-4">
        <Card className="card-width">
          <CardHeader>
            <CardTitle>Age Calculator</CardTitle>
            <CardDescription>Check your age in one-click.</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your date of birth is used to calculate your age.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {text ? (
          <Card className="card-width animate-in duration-500">
            <CardContent className="p-6">{text}</CardContent>
          </Card>
        ) : null}
      </main>
      <Toaster />
    </>
  );
}

