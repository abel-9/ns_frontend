import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "#/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import {
  educationSchema,
  type EducationSchemaValues,
} from "../schema/education";

interface NewEducationFormProps {
  onCancel: () => void;
  onSubmit: (payload: EducationSchemaValues) => void;
}

const initialValues: EducationSchemaValues = {
  major: "Computer Science",
  description: "Describe your education achievements",
  start_date: "",
  end_date: null,
};

export default function NewEducationForm({
  onCancel,
  onSubmit,
}: NewEducationFormProps) {
  const form = useForm<EducationSchemaValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = (values: EducationSchemaValues) => {
    onSubmit(values);
    form.reset(initialValues);
  };

  return (
    <Form {...form}>
      <form
        className="mt-7 space-y-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Major</FormLabel>
                <FormControl>
                  <Input placeholder="Computer Science" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    // {...field}
                    value={field.value ?? ""}
                    // Convert "" back to null when the user clears the input
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value === "" ? null : value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your education achievements"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <Button type="submit">Save education</Button>
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
