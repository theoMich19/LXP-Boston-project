import { JobFiltersProps, Filters, FilterCategories, FilterCategory, FilterOption } from "@/types/filters";
import { Briefcase, MapPin, GraduationCap, Calendar, Check, Filter, ChevronDown, X, DollarSign } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge"

export const JobFilters: React.FC<JobFiltersProps> = ({
    onFiltersChange,
    activeFilters = {},
    className
}) => {
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [tempFilters, setTempFilters] = useState<Filters>(activeFilters);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowFilters(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filterCategories: FilterCategories = {
        jobType: {
            icon: Briefcase,
            title: 'Job Type',
            options: [
                { value: 'full-time', label: 'Full-time' },
                { value: 'part-time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'internship', label: 'Internship' }
            ]
        },
        workMode: {
            icon: MapPin,
            title: 'Work Mode',
            options: [
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'onsite', label: 'On-site' }
            ]
        },
        experience: {
            icon: GraduationCap,
            title: 'Experience Level',
            options: [
                { value: 'entry', label: 'Entry level' },
                { value: 'mid', label: 'Mid level' },
                { value: 'senior', label: 'Senior level' },
                { value: 'lead', label: 'Lead/Manager' }
            ]
        },
        datePosted: {
            icon: Calendar,
            title: 'Date Posted',
            options: [
                { value: '24h', label: 'Past 24 hours' },
                { value: '3d', label: 'Past 3 days' },
                { value: '7d', label: 'Past week' },
                { value: '30d', label: 'Past month' }
            ]
        }
    };

    const handleFilterToggle = (category: string, value: string): void => {
        setTempFilters(prev => {
            const currentValues = prev[category] as string[] || [];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];

            return {
                ...prev,
                [category]: newValues.length > 0 ? newValues : undefined
            };
        });
    };

    const handleSalaryChange = (type: 'min' | 'max', value: string): void => {
        setTempFilters(prev => ({
            ...prev,
            salary: {
                ...prev.salary,
                [type]: value
            }
        }));
    };

    const applyFilters = (): void => {
        onFiltersChange?.(tempFilters);
        setShowFilters(false);
    };

    const clearAllFilters = (): void => {
        setTempFilters({});
        onFiltersChange?.({});
    };

    const getActiveFiltersCount = (): number => {
        return Object.values(tempFilters).filter(value => {
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).some(v => v);
            }
            return Boolean(value);
        }).length;
    };

    const renderFilterSection = (categoryKey: string, category: FilterCategory) => {
        const { icon: Icon, title, options } = category;
        const selectedValues = tempFilters[categoryKey] as string[] || [];

        return (
            <div key={categoryKey} className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-medium text-foreground">
                    <Icon className="h-3 w-3 text-primary" />
                    <span>{title}</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                    {options.map((option: FilterOption) => (
                        <label
                            key={option.value}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded text-xs transition-colors"
                        >
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={selectedValues.includes(option.value)}
                                    onChange={() => handleFilterToggle(categoryKey, option.value)}
                                    className="sr-only"
                                />
                                <div
                                    className={`w-3 h-3 border rounded flex items-center justify-center transition-colors ${selectedValues.includes(option.value)
                                        ? 'bg-primary border-primary'
                                        : 'border-border'
                                        }`}
                                >
                                    {selectedValues.includes(option.value) && (
                                        <Check className="h-2 w-2 text-primary-foreground" />
                                    )}
                                </div>
                            </div>
                            <span className="text-xs text-foreground leading-none">{option.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={`relative ${className || ''}`}>
            <Button
                ref={buttonRef}
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
            >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {getActiveFiltersCount() > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                        {getActiveFiltersCount()}
                    </Badge>
                )}
                <ChevronDown
                    className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''
                        }`}
                />
            </Button>

            {showFilters && (
                <Card
                    ref={dropdownRef}
                    className="absolute top-full right-0 mt-2 w-80 p-4 shadow-xl z-50 max-h-96 overflow-y-auto"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                            <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowFilters(false)}
                                className="h-6 w-6 p-0"
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-xs font-medium text-foreground">
                                <DollarSign className="h-3 w-3 text-primary" />
                                <span>Salary Range (k$/year)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={tempFilters.salary?.min || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleSalaryChange('min', e.target.value)
                                    }
                                    className="h-8 text-xs"
                                />
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={tempFilters.salary?.max || ''}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleSalaryChange('max', e.target.value)
                                    }
                                    className="h-8 text-xs"
                                />
                            </div>
                        </div>

                        {Object.entries(filterCategories).map(([key, category]) =>
                            renderFilterSection(key, category)
                        )}

                        <div className="flex space-x-2 pt-3 border-t border-border">
                            <Button
                                variant="outline"
                                onClick={clearAllFilters}
                                className="flex-1 h-8 text-xs"
                            >
                                Clear All
                            </Button>
                            <Button
                                onClick={applyFilters}
                                className="flex-1 h-8 text-xs"
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};