"use client"

import { useState } from "react"
import { JobFilters } from "@/components/search/search-filter"
import { ActiveFilters } from "@/components/search/search-filter-active"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Filters } from "@/types/filters"

export const FormSearch = () => {
    const [filters, setFilters] = useState<Filters>({});

    const handleFiltersChange = (newFilters: Filters): void => {
        setFilters(newFilters);
    };

    const handleRemoveFilter = (category: string, value?: string): void => {
        setFilters(prev => {
            const updated = { ...prev };
            if (value) {
                const categoryValues = updated[category] as string[];
                updated[category] = categoryValues?.filter(v => v !== value);
                if ((updated[category] as string[])?.length === 0) {
                    delete updated[category];
                }
            } else {
                delete updated[category];
            }
            return updated;
        });
    };

    const handleClearAllFilters = (): void => {
        setFilters({});
    };


    return (<Card className="flex flex-col w-full justify-between gap-4 p-6 mx-auto">
        <div className="flex gap-4 flex-1">
            <Input className="max-w-[30%]" placeholder="Job title, skill or company..." />
            <Input placeholder="Location..." />
            <Button>Search</Button>
            <JobFilters
                onFiltersChange={handleFiltersChange}
                activeFilters={filters}
            />
        </div>
        {
            Object.keys(filters).length > 0 ? (
                <div className="container mx-auto">
                    <ActiveFilters
                        filters={filters}
                        onRemoveFilter={handleRemoveFilter}
                        onClearAll={handleClearAllFilters}
                    />
                </div>
            ) : null
        }
    </Card>)
}