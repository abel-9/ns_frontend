import { toast } from "sonner";
import NewEducationForm from "../forms/NewEducationForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProfileEducation } from "../services";
import type { EducationSchemaValues } from "../schema/education";

interface NewEducationProps {
  setNewEducation: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewEducation: React.FC<NewEducationProps> = ({ setNewEducation }) => {
  const queryClinet = useQueryClient();
  const { mutate: createEducation } = useMutation({
    mutationFn: addProfileEducation,
    onSuccess: () => {
      toast.success("Education added successfully");
      queryClinet.invalidateQueries({
        queryKey: ["profileEducation"],
      });
    },
    onError: () => {
      toast.error("Failed to add education");
    },
  });

  const handleSubmit = (_payload: EducationSchemaValues) => {
    createEducation({ data: _payload });
    setNewEducation(false);
  };

  return (
    <div className="mt-7 space-y-10 sm:space-y-12">
      <p className="text-sm font-semibold text-primary">Add education</p>
      <NewEducationForm
        onCancel={() => setNewEducation(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default NewEducation;
