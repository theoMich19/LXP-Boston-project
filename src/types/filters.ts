import { LucideIcon } from "lucide-react";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterCategory {
  icon: LucideIcon;
  title: string;
  options: FilterOption[];
}

export interface FilterCategories {
  [key: string]: FilterCategory;
}

export interface SalaryFilter {
  min?: string;
  max?: string;
}

export interface Filters {
  jobType?: string[];
  workMode?: string[];
  experience?: string[];
  datePosted?: string[];
  salary?: SalaryFilter;
  [key: string]: string[] | SalaryFilter | undefined;
}

export interface JobFiltersProps {
  onFiltersChange?: (filters: Filters) => void;
  activeFilters?: Filters;
  className?: string;
}

export interface ActiveFiltersProps {
  filters: Filters;
  onRemoveFilter: (category: string, value?: string) => void;
  onClearAll: () => void;
}

export interface FilterLabels {
  [category: string]: {
    [value: string]: string;
  };
}
