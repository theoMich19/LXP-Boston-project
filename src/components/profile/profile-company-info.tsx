import { Briefcase, Building, Calendar, Edit, Mail, MapPin, Phone, TrendingUp, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CompanyData } from "@/types/company";

export const CompanyInfoCard = ({ companyData }: { companyData: CompanyData }) => {
    if (!companyData) return null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <Card className="p-6">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Building className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-1">
                            {companyData.name}
                        </h2>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{companyData.city}, {companyData.country}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{companyData.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Téléphone</p>
                            <p className="font-medium">{companyData.phone}</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Membre depuis</p>
                            <p className="font-medium">{formatDate(companyData.created_at)}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Briefcase className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">Offres actives</p>
                            <p className="font-medium">{companyData.job_offers?.length || 0} postes</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
