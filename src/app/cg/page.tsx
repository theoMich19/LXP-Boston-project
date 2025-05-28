"use client";

import { toastUtils, showApiError, showSaveSuccess } from '@/utils/toast';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Heart, Search, Send, MapPin, User, Bell, Star, DollarSign, Clock, Eye, Filter, Building, Users, TrendingUp, Award, MessageCircle, Briefcase } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Alert } from '@/components/ui/alert';

const testToast = () => {

    // Utilisation basique
    toastUtils.info("Information importante");
    toastUtils.success("Opération réussie !");
    toastUtils.warn("Attention à ceci");
    toastUtils.error("Une erreur est survenue");

    // Toast de chargement
    const loadingToast = toastUtils.loading("Sauvegarde en cours...");
    // Plus tard...
    toastUtils.updateLoadingToSuccess(loadingToast, "Sauvegardé avec succès !");

    // Gestion automatique des promesses
    toastUtils.promise(
        fetch('/api/data'),
        {
            pending: 'Chargement des données...',
            success: 'Données chargées !',
            error: 'Erreur lors du chargement'
        }
    );

    // Fonctions utilitaires
    showApiError("truc muche erreur");
    showSaveSuccess("utilisateur");
}



const DesignSystemShowcase = () => {

    const MatchingScore = ({ score = 0, className = '' }) => {
        const getScoreColor = (score: number) => {
            if (score >= 80) return 'text-success';
            if (score >= 60) return 'text-warning';
            return 'text-destructive';
        };

        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-muted"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={251.32}
                            strokeDashoffset={251.32 - (251.32 * score) / 100}
                            className={getScoreColor(score)}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-bold ${getScoreColor(score)}`}>
                            {score}%
                        </span>
                    </div>
                </div>
                <span className="text-sm text-muted-foreground">Match</span>
            </div>
        );
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                        Design System - TalentBridge
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Charte graphique et composants réutilisables
                    </p>
                </div>
                <div className='mx-auto'>
                    <Button onClick={() => testToast()}>Toast </Button>
                </div>
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">🎨 Palette de couleurs</h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                        <div className="space-y-2">
                            <div className="h-20 bg-primary rounded-lg shadow-sm"></div>
                            <div className="text-center">
                                <p className="font-medium">Primary</p>
                                <p className="text-xs text-muted-foreground">Bleu principal</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-20 bg-accent rounded-lg shadow-sm"></div>
                            <div className="text-center">
                                <p className="font-medium">Accent</p>
                                <p className="text-xs text-muted-foreground">Violet moderne</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-20 bg-success rounded-lg shadow-sm"></div>
                            <div className="text-center">
                                <p className="font-medium">Success</p>
                                <p className="text-xs text-muted-foreground">Vert succès</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-20 bg-warning rounded-lg shadow-sm"></div>
                            <div className="text-center">
                                <p className="font-medium">Warning</p>
                                <p className="text-xs text-muted-foreground">Orange attention</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-20 bg-destructive rounded-lg shadow-sm"></div>
                            <div className="text-center">
                                <p className="font-medium">Destructive</p>
                                <p className="text-xs text-muted-foreground">Rouge erreur</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-20 bg-muted rounded-lg shadow-sm"></div>
                            <div className="text-center">
                                <p className="font-medium">Muted</p>
                                <p className="text-xs text-muted-foreground">Gris neutre</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">🔘 Boutons</h2>

                    <Card className="p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Variants</h3>
                        <div className="flex flex-wrap gap-4">
                            <Button>Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                            <Button variant="success">Success</Button>
                            <Button variant="destructive">Destructive</Button>
                        </div>
                    </Card>

                    <Card className="p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">Tailles</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <Button size="sm">Small</Button>
                            <Button>Default</Button>
                            <Button size="lg">Large</Button>
                            <Button size="icon"><Heart className="h-4 w-4" /></Button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Avec icônes</h3>
                        <div className="flex flex-wrap gap-4">
                            <Button><Search className="h-4 w-4 mr-2" />Rechercher</Button>
                            <Button variant="outline"><Heart className="h-4 w-4 mr-2" />Favoris</Button>
                            <Button variant="success"><Send className="h-4 w-4 mr-2" />Envoyer</Button>
                        </div>
                    </Card>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">🏷️ Badges</h2>

                    <Card className="p-6">
                        <div className="flex flex-wrap gap-3">
                            <Badge>Default</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="success">Success</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-medium mb-3">Exemples d&apos;usage :</h4>
                            <div className="flex flex-wrap gap-2">
                                <Badge >React</Badge>
                                <Badge variant="outline">TypeScript</Badge>
                                <Badge variant="outline">Node.js</Badge>
                                <Badge variant="success">CDI</Badge>
                                <Badge variant="secondary">Junior</Badge>
                            </div>
                        </div>
                    </Card>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">👤 Avatars</h2>

                    <Card className="p-6">
                        <div className="flex flex-wrap items-center gap-6">
                            <div className="text-center space-y-2">
                                <Avatar />
                                <p className="text-sm">Small</p>
                            </div>

                            <div className="text-center space-y-2">
                                <Avatar />
                                <p className="text-sm">Default</p>
                            </div>

                            <div className="text-center space-y-2">
                                <Avatar />
                                <p className="text-sm">Large</p>
                            </div>

                            <div className="text-center space-y-2">
                                <Avatar />
                                <p className="text-sm">Extra Large</p>
                            </div>
                        </div>
                    </Card>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">📄 Cards</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-2">Card basique</h3>
                            <p className="text-muted-foreground">
                                Une card simple avec du contenu de base.
                            </p>
                        </Card>

                        <Card className="p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start space-x-4">
                                <Avatar />
                                <div className="flex-1">
                                    <h3 className="font-semibold">John Doe</h3>
                                    <p className="text-sm text-muted-foreground">Développeur Full Stack</p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Paris, France</span>
                                    </div>
                                </div>
                                <MatchingScore score={85} />
                            </div>
                        </Card>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">📝 Inputs</h2>

                    <Card className="p-6">
                        <div className="space-y-4 max-w-md">
                            <Input placeholder="Input basique" />
                        </div>
                    </Card>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">📊 Barres de progression</h2>

                    <Card className="p-6">
                        <div className="space-y-6 max-w-md">
                            <Progress value={25} />
                            <Progress value={50} />
                            <Progress value={75} />
                            <Progress value={100} />
                        </div>
                    </Card>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">🎯 Scores de matching</h2>

                    <Card className="p-6">
                        <div className="flex flex-wrap gap-8">
                            <MatchingScore score={45} />
                            <MatchingScore score={67} />
                            <MatchingScore score={82} />
                            <MatchingScore score={95} />
                        </div>
                    </Card>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">⚠️ Alertes</h2>

                    <div className="space-y-4">
                        <Alert title="Information">
                            Ceci est une alerte d&apos;information par défaut.
                        </Alert>

                        <Alert title="Succès">
                            Votre profil a été mis à jour avec succès !
                        </Alert>

                        <Alert title="Attention">
                            Votre abonnement expire dans 5 jours.
                        </Alert>

                        <Alert title="Erreur">
                            Une erreur s&apos;est produite lors de l&apos;envoi du formulaire.
                        </Alert>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">⏳ États de chargement</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Skeletons</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                </div>
                                <Skeleton className="h-20 w-full" />
                            </div>
                        </Card>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">🎨 Icônes courantes</h2>

                    <Card className="p-6">
                        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                            {[
                                { Icon: Search, name: 'Search' },
                                { Icon: Bell, name: 'Bell' },
                                { Icon: User, name: 'User' },
                                { Icon: Heart, name: 'Heart' },
                                { Icon: Star, name: 'Star' },
                                { Icon: MapPin, name: 'MapPin' },
                                { Icon: DollarSign, name: 'Dollar' },
                                { Icon: Clock, name: 'Clock' },
                                { Icon: Eye, name: 'Eye' },
                                { Icon: Send, name: 'Send' },
                                { Icon: Filter, name: 'Filter' },
                                { Icon: Building, name: 'Building' },
                                { Icon: Users, name: 'Users' },
                                { Icon: TrendingUp, name: 'Trending' },
                                { Icon: Award, name: 'Award' },
                                { Icon: MessageCircle, name: 'Message' },
                            ].map(({ Icon, name }) => (
                                <div key={name} className="text-center space-y-2">
                                    <div className="flex justify-center">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">{name}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">💼 Exemples d&apos;usage</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start space-x-3">
                                    <Avatar />
                                    <div>
                                        <h3 className="font-semibold text-primary hover:underline cursor-pointer">
                                            Développeur React Senior
                                        </h3>
                                        <p className="text-muted-foreground text-sm">TechCorp</p>
                                        <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                                            <span className="flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                Paris
                                            </span>
                                            <span className="flex items-center">
                                                <DollarSign className="h-3 w-3 mr-1" />
                                                50-60k €
                                            </span>
                                            <span className="flex items-center">
                                                <Clock className="h-3 w-3 mr-1" />
                                                2h
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <MatchingScore score={92} />
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">
                                Rejoignez notre équipe pour développer des applications React modernes...
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline">React</Badge>
                                <Badge variant="outline">TypeScript</Badge>
                                <Badge variant="outline">Node.js</Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <Badge variant="success">CDI</Badge>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                        <Eye className="h-4 w-4 mr-1" />
                                        Voir
                                    </Button>
                                    <Button size="sm">
                                        <Send className="h-4 w-4 mr-1" />
                                        Postuler
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        <div className="space-y-4">
                            <Card className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold">1,245</p>
                                        <p className="text-sm text-muted-foreground">Emplois actifs</p>
                                    </div>
                                    <Briefcase className="h-8 w-8 text-primary" />
                                </div>
                            </Card>

                            <Card className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold">89%</p>
                                        <p className="text-sm text-muted-foreground">Taux de réussite</p>
                                    </div>
                                    <TrendingUp className="h-8 w-8 text-success" />
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default DesignSystemShowcase;