"use client"

import React from 'react';
import {
    User,
    Mail,
    Save,
    Loader2,
    Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProfileFormData } from '@/types/profile';


export const PersonalInfoForm = ({
    formData,
    isEditing,
    isLoading,
    errors,
    onInputChange,
    onEdit,
    onCancel,
    onSave
}: {
    formData: ProfileFormData;
    isEditing: boolean;
    isLoading: boolean;
    errors: Record<string, string>;
    onInputChange: (field: keyof ProfileFormData, value: string) => void;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}) => {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                </h3>
                {!isEditing && (
                    <Button variant="outline" onClick={onEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        First Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                        <Input
                            value={formData.first_name}
                            onChange={(e) => onInputChange('first_name', e.target.value)}
                            className={errors.first_name ? 'border-destructive' : ''}
                            disabled={isLoading}
                        />
                    ) : (
                        <p className="py-2 text-foreground">{formData.first_name}</p>
                    )}
                    {errors.first_name && (
                        <p className="text-sm text-destructive">{errors.first_name}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Last Name <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                        <Input
                            value={formData.last_name}
                            onChange={(e) => onInputChange('last_name', e.target.value)}
                            className={errors.last_name ? 'border-destructive' : ''}
                            disabled={isLoading}
                        />
                    ) : (
                        <p className="py-2 text-foreground">{formData.last_name}</p>
                    )}
                    {errors.last_name && (
                        <p className="text-sm text-destructive">{errors.last_name}</p>
                    )}
                </div>

                <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Email <span className="text-destructive">*</span>
                    </label>
                    {isEditing ? (
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => onInputChange('email', e.target.value)}
                            className={errors.email ? 'border-destructive' : ''}
                            disabled={isLoading}
                        />
                    ) : (
                        <p className="py-2 text-foreground flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            {formData.email}
                        </p>
                    )}
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                </div>
            </div>

            {isEditing && (
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                    <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={onSave} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </>
                        )}
                    </Button>
                </div>
            )}
        </Card>
    );
};