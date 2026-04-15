import type {
  ApiDateObject,
  ApiDateValue,
  ProfileWorkExperienceItemData,
} from "../types";

const isApiDateObject = (value: unknown): value is ApiDateObject => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const dateObject = value as Record<string, unknown>;
  return typeof dateObject.$date === "string";
};

const isApiDateValue = (value: unknown): value is ApiDateValue => {
  return typeof value === "string" || isApiDateObject(value);
};

export const formatWorkExperienceDate = (dateValue: ApiDateValue | null) => {
  if (!dateValue) {
    return "Present";
  }

  const parsedDateValue =
    typeof dateValue === "string" ? dateValue : dateValue.$date;
  const date = new Date(parsedDateValue);
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
};

export const getWorkExperienceHeadline = (
  experience: ProfileWorkExperienceItemData,
) => {
  const roleLabel =
    experience.position ||
    experience.role ||
    experience.title ||
    "Work Experience";

  if (experience.company) {
    return `${roleLabel} at ${experience.company}`;
  }

  return roleLabel;
};

export const isWorkExperienceItem = (
  value: unknown,
): value is ProfileWorkExperienceItemData => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const maybeItem = value as Record<string, unknown>;

  return (
    typeof maybeItem.id === "string" &&
    typeof maybeItem.description === "string" &&
    isApiDateValue(maybeItem.start_date) &&
    (isApiDateValue(maybeItem.end_date) || maybeItem.end_date === null)
  );
};

export const getWorkExperienceItems = (
  data: unknown,
): ProfileWorkExperienceItemData[] => {
  if (Array.isArray(data)) {
    return data.filter(isWorkExperienceItem);
  }

  if (typeof data !== "object" || data === null) {
    return [];
  }

  const payload = data as Record<string, unknown>;
  const nestedCollectionKeys = [
    "items",
    "data",
    "work_experience",
    "workExperience",
    "experiences",
  ];

  for (const key of nestedCollectionKeys) {
    const value = payload[key];
    if (Array.isArray(value)) {
      return value.filter(isWorkExperienceItem);
    }
  }

  return isWorkExperienceItem(payload) ? [payload] : [];
};
