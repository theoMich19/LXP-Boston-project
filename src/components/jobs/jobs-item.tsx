import { Building, DollarSign, MapPin, Clock, Star, AlertCircle, Eye, Send } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar } from "../ui/avatar";
import { JobItemProps } from "@/types/jobs";
import { CompatibilityScore } from "./jobs-item-score";
import { useUser } from "@/context/userContext";

export const JobItem: React.FC<JobItemProps> = ({
    isJobsApply,
    job,
    onViewDetails,
    onApply,
    company
}) => {
    const {
        id,
        title,
        compatibility_score,
        matched_skills,
        missing_skills,
        salary_min,
        salary_max,
        description
    } = job;
    const { user } = useUser()

    const formatSalary = (min: number, max: number) => {
        const minK = Math.round(min / 1000);
        const maxK = Math.round(max / 1000);
        return `${minK}k - ${maxK}k €`;
    };

    return (
        <Card className="p-6 hover:shadow-lg transition-all duration-200 border border-border hover:border-primary/20">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                        <Avatar
                            className="h-12 w-12 bg-primary/10 text-primary font-semibold"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer transition-colors line-clamp-1">
                                {title}
                            </h3>
                            <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                                <Building className="h-4 w-4" />
                                <span className="text-sm font-medium">{company?.name}</span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{formatSalary(salary_min, salary_max)}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>Remote Available</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>2 days ago</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    {
                        compatibility_score && <CompatibilityScore score={compatibility_score} />
                    }
                </div>

                <div className="text-sm text-muted-foreground line-clamp-2">
                    {description}
                </div>

                <div className="space-y-3">
                    {matched_skills && matched_skills.length > 0 && (
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Star className="h-4 w-4 text-success" />
                                <span className="text-sm font-medium text-success">
                                    Matched Skills ({matched_skills.length})
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {matched_skills.slice(0, 6).map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-success/10 text-success border-success/20 hover:bg-success/20"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                                {matched_skills.length > 6 && (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        +{matched_skills.length - 6} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {missing_skills && missing_skills.length > 0 && (
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-warning" />
                                <span className="text-sm font-medium text-warning">
                                    Skills to Learn ({missing_skills.length})
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {missing_skills.slice(0, 4).map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-warning/5 text-warning border-warning/20 hover:bg-warning/10"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                                {missing_skills.length > 4 && (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        +{missing_skills.length - 4} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                    {
                        compatibility_score ?
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant={compatibility_score >= 70 ? "default" : compatibility_score >= 40 ? "secondary" : "outline"}
                                    className="text-xs"
                                >
                                    {compatibility_score >= 70 ? "Excellent Match" :
                                        compatibility_score >= 40 ? "Good Match" : "Partial Match"}
                                </Badge>
                            </div> : <div></div>
                    }

                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails?.(id)}
                            className="flex items-center space-x-1"
                        >
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                        </Button>
                        {user?.role === "candidate" ? (
                            <>
                                {
                                    isJobsApply ? <Button disabled>already applied </Button> : (
                                        <Button
                                            size="sm"
                                            onClick={() => onApply?.(id)}
                                            className="flex items-center space-x-1"
                                        >
                                            <Send className="h-4 w-4" />
                                            <span>Apply Now</span>
                                        </Button>

                                    )
                                }
                            </>
                        ) : (null)}

                    </div>
                </div>
            </div>
        </Card >
    );
};
