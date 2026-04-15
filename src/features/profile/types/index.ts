export interface ApiDateObject {
  $date: string;
}

export type ApiDateValue = string | ApiDateObject;

export interface ProfileEducationItemData {
  id: string;
  major: string;
  description: string;
  start_date: ApiDateValue;
  end_date: ApiDateValue | null;
}

export interface ProfileWorkExperienceItemData {
  id: string;
  company?: string;
  position?: string;
  role?: string;
  title?: string;
  description: string;
  start_date: ApiDateValue;
  end_date: ApiDateValue | null;
}
