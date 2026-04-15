import { toast } from "sonner";
import NewWorkExperienceForm from "../forms/NewWorkExperienceForm";
import type { WorkExperienceSchemaValues } from "../schema/work_experience";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProfileWorkExperience } from "../services";

interface NewWorkExperienceProps {
  setNewExperience: React.Dispatch<React.SetStateAction<boolean>>;
}
const NewWorkExperience: React.FC<NewWorkExperienceProps> = ({
  setNewExperience,
}) => {
  const queryClient = useQueryClient();
  const { mutate: createWorkExperience } = useMutation({
    mutationFn: addProfileWorkExperience,
    onSuccess: () => {
      toast.success("Work experience added successfully");
      queryClient.invalidateQueries({ queryKey: ["profileWorkExperience"] });
    },
    onError: () => {
      toast.error("Failed to add work experience");
    },
  });

  const handleSubmit = (_payload: WorkExperienceSchemaValues) => {
    createWorkExperience({ data: _payload });
    setNewExperience(false);
  };

  return (
    <div className="mt-7 space-y-10 sm:space-y-12">
      <p className="text-sm font-semibold text-primary">Add work experience</p>
      <NewWorkExperienceForm
        onCancel={() => setNewExperience(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default NewWorkExperience;
