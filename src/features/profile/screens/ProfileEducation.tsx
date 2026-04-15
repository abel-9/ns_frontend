import { useQuery } from "@tanstack/react-query";
import ProfileEducationItem from "../components/ProfileEducationItem";
import { getProfileEducation } from "../services";
import { getEducationItems } from "../utils/education";
import { Plus } from "lucide-react";
import { useState } from "react";
import NewEducation from "../components/NewEducation";
import { FaSpinner } from "react-icons/fa";

const ProfileEducation = () => {
  const [newEducation, setNewEducation] = useState<boolean>(false);
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["profileEducation"],
    queryFn: getProfileEducation,
  });

  const educationItems = getEducationItems(data);

  return (
    <section className="border-t border-line py-4 sm:py-6">
      <div className="flex items-center justify-between w-full">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Education
        </p>
        <Plus
          className="cursor-pointer"
          onClick={() => setNewEducation(true)}
        />
      </div>

      {isLoading ? (
        <p className="mt-6 text-base text-(--muted-foreground)/85 animate-spin w-fit">
          <FaSpinner />
        </p>
      ) : null}

      {isError ? (
        <p className="mt-6 text-sm font-semibold text-error">
          Could not load education records:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      ) : null}

      {!isLoading && !isError && educationItems.length === 0 ? (
        <p className="mt-6 text-base text-(--muted-foreground)/85">
          No education entries found.
        </p>
      ) : null}

      {!isLoading && !isError && educationItems.length > 0 ? (
        <div className="mt-7 sm:space-y-12">
          {educationItems.map((education) => (
            <ProfileEducationItem key={education.id} education={education} />
          ))}
        </div>
      ) : null}

      {newEducation ? <NewEducation setNewEducation={setNewEducation} /> : null}
    </section>
  );
};

export default ProfileEducation;
