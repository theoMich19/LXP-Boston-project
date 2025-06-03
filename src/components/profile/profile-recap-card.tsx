import { Mail, Shield, Calendar, Building } from "lucide-react";
import { Card } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { User } from "@/types/user";
import { Badge } from "../ui/badge";

const ProfileRecapCard = ({ user }: { user: User }) => {
    return (
        <Card className="p-6 text-center">
            <div className="mb-4">
                <Avatar />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
                {user.first_name} {user.last_name}
            </h2>
            <p className="text-muted-foreground mb-4 flex items-center justify-center">
                <Mail className="h-4 w-4 mr-2" />
                {user.email}
            </p>

            <div className="space-y-2">
                <Badge variant="secondary" className="mb-2">
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role === 'candidate' ? 'Candidat' : 'Recruteur'}
                </Badge>

                {user.created_at && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long'
                        })}
                    </div>
                )}

                {user.company_id && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                        <Building className="h-4 w-4 mr-2" />
                        ID Entreprise: {user.company_id}
                    </div>
                )}
            </div>
        </Card>

    )
}

export default ProfileRecapCard;