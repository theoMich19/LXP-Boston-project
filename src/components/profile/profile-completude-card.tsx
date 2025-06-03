import { Check, User, X } from "lucide-react"
import { Card } from "../ui/card"
import { Progress } from "../ui/progress"
import { useCallback } from "react";
import { User as UserType } from "@/types/user";

export const ProfileCompletudeCard = ({ user }: { user: UserType }) => {
    const getProfileCompleteness = useCallback(() => {
        if (!user) return 0;

        let completeness = 0;
        if (user.first_name) completeness += 40;
        if (user.last_name) completeness += 40;
        if (user.email) completeness += 20;

        return completeness;
    }, [user]);
    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Complétude du profil
            </h3>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span>Progression</span>
                        <span>{getProfileCompleteness()}%</span>
                    </div>
                    <Progress value={getProfileCompleteness()} className="h-2" />
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <span>Prénom</span>
                        {user.first_name ? (
                            <Check className="h-4 w-4 text-success" />
                        ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Nom</span>
                        {user.last_name ? (
                            <Check className="h-4 w-4 text-success" />
                        ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Email</span>
                        {user.email ? (
                            <Check className="h-4 w-4 text-success" />
                        ) : (
                            <X className="h-4 w-4 text-muted-foreground" />
                        )}
                    </div>
                </div>
            </div>
        </Card>
    )

}