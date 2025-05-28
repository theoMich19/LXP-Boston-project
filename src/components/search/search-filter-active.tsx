import { ActiveFiltersProps, FilterLabels, SalaryFilter } from "@/types/filters";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
    filters,
    onRemoveFilter,
    onClearAll
}) => {
    const filterLabels: FilterLabels = {
        jobType: {
            'full-time': 'Full-time',
            'part-time': 'Part-time',
            'contract': 'Contract',
            'internship': 'Internship'
        },
        workMode: {
            remote: 'Remote',
            hybrid: 'Hybrid',
            onsite: 'On-site'
        },
        experience: {
            entry: 'Entry level',
            mid: 'Mid level',
            senior: 'Senior level',
            lead: 'Lead/Manager'
        },
        datePosted: {
            '24h': 'Past 24h',
            '3d': 'Past 3 days',
            '7d': 'Past week',
            '30d': 'Past month'
        }
    };

    interface ActiveBadge {
        key: string;
        label: string;
        onRemove: () => void;
    }

    const getActiveFilterBadges = (): ActiveBadge[] => {
        const badges: ActiveBadge[] = [];

        Object.entries(filters).forEach(([category, values]) => {
            if (category === 'salary') {
                const salaryValues = values as SalaryFilter;
                const { min, max } = salaryValues;
                if (min || max) {
                    badges.push({
                        key: 'salary',
                        label: `$${min || 0}k-${max || '∞'}k`,
                        onRemove: () => onRemoveFilter('salary')
                    });
                }
            } else if (Array.isArray(values) && values.length > 0) {
                values.forEach((value: string) => {
                    badges.push({
                        key: `${category}-${value}`,
                        label: filterLabels[category]?.[value] || value,
                        onRemove: () => onRemoveFilter(category, value)
                    });
                });
            }
        });

        return badges;
    };

    const activeBadges = getActiveFilterBadges();

    if (activeBadges.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {activeBadges.map((badge: ActiveBadge) => (
                <Badge
                    key={badge.key}
                    variant="secondary"
                    className="flex items-center space-x-1 px-2 py-1 text-xs"
                >
                    <span>{badge.label}</span>
                    <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={badge.onRemove}
                    />
                </Badge>
            ))}
            <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="text-xs h-6 px-2"
            >
                Clear all
            </Button>
        </div>
    );
};