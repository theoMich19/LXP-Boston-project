"use client";

import React, { useState, useEffect } from 'react';
import {
    Search,
    Bell,
    User,
    Briefcase,
    MapPin,
    Clock,
    DollarSign,
    Heart,
    Send,
    Filter,
    Star,
    ChevronDown,
    Menu,
    X,
    Building,
    Users,
    TrendingUp,
    Award,
    Eye,
    MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import Header from '@/components/header/header';


const MatchingScore = ({ score, className = '' }) => {
    const getScoreColor = (score) => {
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

// Composant principal
const JobPlatformDemo = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const jobsData = [
        {
            id: 1,
            title: "Développeur Full Stack React/Node.js",
            company: "TechCorp",
            location: "Paris, France",
            salary: "45-55k €",
            type: "CDI",
            posted: "2h",
            match: 92,
            logo: "TC",
            description: "Nous recherchons un développeur passionné pour rejoindre notre équipe...",
            skills: ["React", "Node.js", "TypeScript", "MongoDB"]
        },
        {
            id: 2,
            title: "UX/UI Designer Senior",
            company: "Design Studio",
            location: "Lyon, France",
            salary: "40-50k €",
            type: "CDI",
            posted: "1j",
            match: 78,
            logo: "DS",
            description: "Créez des expériences utilisateur exceptionnelles...",
            skills: ["Figma", "Adobe XD", "Prototyping", "User Research"]
        },
        {
            id: 3,
            title: "Data Scientist",
            company: "AI Solutions",
            location: "Remote",
            salary: "55-65k €",
            type: "CDI",
            posted: "3j",
            match: 65,
            logo: "AI",
            description: "Analysez et modélisez des données complexes...",
            skills: ["Python", "Machine Learning", "SQL", "TensorFlow"]
        }
    ];

    const candidatesData = [
        {
            id: 1,
            name: "Sophie Martin",
            title: "Développeuse Frontend",
            location: "Paris",
            experience: "3 ans",
            match: 88,
            avatar: "SM",
            skills: ["React", "Vue.js", "CSS", "JavaScript"],
            availability: "Disponible"
        },
        {
            id: 2,
            name: "Thomas Dubois",
            title: "Designer UI/UX",
            location: "Marseille",
            experience: "5 ans",
            match: 76,
            avatar: "TD",
            skills: ["Figma", "Sketch", "Prototyping", "Design Systems"],
            availability: "2 semaines"
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <Skeleton className="h-8 w-32" />
                        <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>

                    <Card className="p-6 mb-8">
                        <Skeleton className="h-12 w-full mb-4" />
                        <div className="flex space-x-4">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2 mb-4" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5">
            <Header />
            <div className="container mx-auto px-4 py-8">
                <Card className="p-6 mb-8 glass-effect">
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            {/* <Input
                type="text"
                placeholder={selectedTab === 'jobs' ? "Rechercher un emploi..." : "Rechercher un candidat..."}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              /> */}
                        </div>

                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Localisation"
                                className="w-full md:w-48 pl-10 pr-4 py-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <Button className="px-8">
                            <Search className="h-5 w-5 mr-2" />
                            Rechercher
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                            <Filter className="h-4 w-4 mr-2" />
                            Filtres
                        </Button>
                        <Badge variant="secondary">Remote</Badge>
                        <Badge variant="secondary">CDI</Badge>
                        <Badge variant="secondary">Tech</Badge>
                    </div>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">1,245</div>
                        <div className="text-sm text-muted-foreground">Emplois actifs</div>
                    </Card>

                    <Card className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Users className="h-6 w-6 text-accent" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">8,921</div>
                        <div className="text-sm text-muted-foreground">Candidats</div>
                    </Card>

                    <Card className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <Building className="h-6 w-6 text-success" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">456</div>
                        <div className="text-sm text-muted-foreground">Entreprises</div>
                    </Card>

                    <Card className="p-4 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <TrendingUp className="h-6 w-6 text-warning" />
                        </div>
                        <div className="text-2xl font-bold text-foreground">89%</div>
                        <div className="text-sm text-muted-foreground">Taux de match</div>
                    </Card>
                </div>

                {"jobs" === 'jobs' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {jobsData.map(job => (
                                <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start space-x-4">
                                            <Avatar size="lg" />
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                                                    {job.title}
                                                </h3>
                                                <p className="text-muted-foreground">{job.company}</p>
                                                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                                    <span className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {job.location}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <DollarSign className="h-4 w-4 mr-1" />
                                                        {job.salary}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        {job.posted}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <MatchingScore score={job.match} />
                                            <Button variant="ghost" size="icon">
                                                <Heart className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground mb-4">{job.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {job.skills.map(skill => (
                                            <Badge key={skill} variant="outline">{skill}</Badge>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <Badge variant="secondary">{job.type}</Badge>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                Voir plus
                                            </Button>
                                            <Button size="sm">
                                                <Send className="h-4 w-4 mr-2" />
                                                Postuler
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="space-y-6">
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Recommandations</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3">
                                        <Star className="h-5 w-5 text-warning" />
                                        <div>
                                            <p className="font-medium">Complétez votre profil</p>
                                            <p className="text-sm text-muted-foreground">+20% de chances d&apos;être contacté</p>
                                        </div>
                                    </div>
                                    <Progress value={65} />
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Tendances du marché</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">React Developer</span>
                                        <Badge variant="success">+15%</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">UX Designer</span>
                                        <Badge variant="success">+8%</Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Data Scientist</span>
                                        <Badge variant="success">+12%</Badge>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {candidatesData.map(candidate => (
                            <Card key={candidate.id} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start space-x-4">
                                        <Avatar size="lg" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">{candidate.name}</h3>
                                            <p className="text-muted-foreground">{candidate.title}</p>
                                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                                <span className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {candidate.location}
                                                </span>
                                                <span>{candidate.experience}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <MatchingScore score={candidate.match} />
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {candidate.skills.map(skill => (
                                        <Badge key={skill} variant="outline">{skill}</Badge>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-success rounded-full"></div>
                                        <span className="text-sm text-muted-foreground">{candidate.availability}</span>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            Profil
                                        </Button>
                                        <Button size="sm">
                                            <MessageCircle className="h-4 w-4 mr-2" />
                                            Contacter
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobPlatformDemo;