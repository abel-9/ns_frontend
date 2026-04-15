import {
  formatWorkExperienceDate,
  getWorkExperienceHeadline,
} from "../utils/workExperience";
import type { ProfileWorkExperienceItemData } from "../types";

interface ProfileWorkExperienceItemProps {
  experience: ProfileWorkExperienceItemData;
}

const ProfileWorkExperienceItem = ({
  experience,
}: ProfileWorkExperienceItemProps) => {
  const startDate = formatWorkExperienceDate(experience.start_date);
  const endDate = formatWorkExperienceDate(experience.end_date);
  const description =
    experience.description.trim() || "No description provided.";
  const headline = getWorkExperienceHeadline(experience);
  const company = experience.company?.trim() || "Company not specified";

  return (
    <article>
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-baseline sm:gap-8">
        <h3 className="text-xl font-extrabold leading-tight text-foreground sm:text-2xl">
          {headline}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-right">
          {startDate} - {endDate}
        </p>
      </div>

      <p className="mt-3 text-sm font-medium text-foreground/58">{company}</p>

      <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-foreground/84">
        {description}
      </p>
    </article>
  );
};

export default ProfileWorkExperienceItem;
