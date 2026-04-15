import { useQuery } from "@tanstack/react-query";
import ProfileWorkExperienceItem from "../components/ProfileWorkExperienceItem";
import { getProfileWorkExperience } from "../services";
import { getWorkExperienceItems } from "../utils/workExperience";
import { Plus } from "lucide-react";
import { useState } from "react";
import NewWorkExperience from "../components/NewWorkExperience";
import { FaSpinner } from "react-icons/fa";

const ProfileWorkExperience = () => {
  const [newExperience, setNewExperience] = useState<boolean>(false);
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["profileWorkExperience"],
    queryFn: getProfileWorkExperience,
  });

  const workExperienceItems = getWorkExperienceItems(data);

  return (
    <section className="border-t border-line py-4 sm:py-6">
      <div className="flex items-center justify-between">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Professional Experience
        </p>
        <div className="flex items-center gap-4">
          <Plus
            className="cursor-pointer"
            onClick={() => setNewExperience(true)}
          />
        </div>
      </div>

      {isLoading ? (
        <p className="mt-6 text-base text-(--muted-foreground)/85 animate-spin w-fit">
          <FaSpinner />
        </p>
      ) : null}

      {isError ? (
        <p className="mt-6 text-sm font-semibold text-error">
          Could not load work experience records:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      ) : null}

      {!isLoading && !isError && workExperienceItems.length === 0 ? (
        <p className="mt-6 text-base text-(--muted-foreground)/85">
          No work experience entries found.
        </p>
      ) : null}

      {!isLoading && !isError && workExperienceItems.length > 0 ? (
        <div className="mt-7 space-y-2 sm:space-y-12">
          {workExperienceItems.map((experience) => (
            <ProfileWorkExperienceItem
              key={experience.id}
              experience={experience}
            />
          ))}
        </div>
      ) : null}

      {newExperience ? (
        <NewWorkExperience setNewExperience={setNewExperience} />
      ) : null}
    </section>
  );
};

export default ProfileWorkExperience;
