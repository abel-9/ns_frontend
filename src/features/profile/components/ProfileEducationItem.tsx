import { formatEducationDate } from "../utils/education";
import type { ProfileEducationItemData } from "../types";

interface ProfileEducationItemProps {
  education: ProfileEducationItemData;
}

const ProfileEducationItem = ({ education }: ProfileEducationItemProps) => {
  const startDate = formatEducationDate(education.start_date);
  const endDate = formatEducationDate(education.end_date);
  const description =
    education.description.trim() || "No description provided.";

  return (
    <article className="mb-4 border-b border-muted/80 pb-2 last:border-0">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_11rem] sm:items-baseline sm:gap-8">
        <h3 className="text-xl font-extrabold leading-tight text-foreground sm:text-2xl">
          {education.major}
        </h3>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-right">
          {startDate} - {endDate}
        </p>
      </div>

      <p className="mt-3 text-sm font-medium uppercase tracking-[0.08em] text-foreground/55">
        Education Track
      </p>

      <p className="mt-3 max-w-3xl text-[0.98rem] leading-7 text-foreground/84">
        {description}
      </p>
    </article>
  );
};

export default ProfileEducationItem;
