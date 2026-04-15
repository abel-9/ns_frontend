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
  workExperienceSchema,
  type WorkExperienceSchemaValues,
} from "../schema/work_experience";

interface NewWorkExperienceFormProps {
  onCancel: () => void;
  onSubmit: (payload: WorkExperienceSchemaValues) => void;
}

const initialValues: WorkExperienceSchemaValues = {
  company: "Any Company",
  position: "Software Engineer",
  role: "Frontend Developer",
  title: "Senior Frontend Engineer",
  description:
    "Led the frontend team in building a scalable web application using React and TypeScript. Implemented new features, optimized performance, and collaborated closely with designers and backend developers to deliver a seamless user experience.",
  start_date: "",
  end_date: null,
};

export default function NewWorkExperienceForm({
  onCancel,
  onSubmit,
}: NewWorkExperienceFormProps) {
  const form = useForm<WorkExperienceSchemaValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: initialValues,
  });

  const handleSubmit = (values: WorkExperienceSchemaValues) => {
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
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input placeholder="Senior Frontend Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input placeholder="Team Lead" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Software Engineer" {...field} />
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
                    value={field.value ?? ""}
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
                  placeholder="Describe your impact and responsibilities"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <Button type="submit">Save experience</Button>
          <Button onClick={onCancel} type="button" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
