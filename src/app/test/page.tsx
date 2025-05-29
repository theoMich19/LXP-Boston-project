"use client"
import LoadingLogo from "@/components/logo/animated-logo";
import { useState } from "react";

const LoadingDemo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);

    const loadingMessages = [
        "Connexion en cours...",
        "Chargement des données...",
        "Finalisation...",
        "Terminé !"
    ];

    const startLoading = () => {
        setIsLoading(true);
        setLoadingStep(0);

        const interval = setInterval(() => {
            setLoadingStep(prev => {
                if (prev >= loadingMessages.length - 1) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 1000);
                    return prev;
                }
                return prev + 1;
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5">
            {isLoading && (
                <div className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
                    <LoadingLogo
                        size="xl"
                        message={loadingMessages[loadingStep]}
                        className="animate-fade-in"
                    />
                </div>
            )}

            <div className="container mx-auto px-4 py-8 space-y-12">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        Animation Loading TalentBridge
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        Logo animé pour les états de chargement
                    </p>
                    <button
                        onClick={startLoading}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Tester l'animation complète
                    </button>
                </div>

                {/* Différentes tailles */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Tailles disponibles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        <div className="bg-card p-8 rounded-lg border text-center">
                            <h3 className="text-sm font-medium mb-4 text-muted-foreground">Small</h3>
                            <LoadingLogo size="sm" message={undefined} />
                        </div>

                        <div className="bg-card p-8 rounded-lg border text-center">
                            <h3 className="text-sm font-medium mb-4 text-muted-foreground">Medium</h3>
                            <LoadingLogo size="md" message={undefined} />
                        </div>

                        <div className="bg-card p-8 rounded-lg border text-center">
                            <h3 className="text-sm font-medium mb-4 text-muted-foreground">Large</h3>
                            <LoadingLogo size="lg" message={undefined} />
                        </div>

                        <div className="bg-card p-8 rounded-lg border text-center">
                            <h3 className="text-sm font-medium mb-4 text-muted-foreground">Extra Large</h3>
                            <LoadingLogo size="xl" message={undefined} />
                        </div>

                    </div>
                </section>

                {/* Avec messages */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Avec messages de chargement</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="bg-card p-8 rounded-lg border">
                            <LoadingLogo
                                size="md"
                                message="Chargement des offres d'emploi..."
                            />
                        </div>

                        <div className="bg-card p-8 rounded-lg border">
                            <LoadingLogo
                                size="md"
                                message="Recherche de candidats..."
                            />
                        </div>

                        <div className="bg-card p-8 rounded-lg border">
                            <LoadingLogo
                                size="md"
                                message="Envoi de votre candidature..."
                            />
                        </div>

                        <div className="bg-card p-8 rounded-lg border">
                            <LoadingLogo
                                size="md"
                                message="Génération du rapport..."
                            />
                        </div>

                    </div>
                </section>

                {/* Exemples d'usage contextuels */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Exemples d'usage</h2>

                    {/* Modal de chargement */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Dans une modal</h3>
                        <div className="bg-card border rounded-lg p-6 max-w-md mx-auto">
                            <LoadingLogo
                                size="md"
                                message="Traitement en cours..."
                            />
                            <div className="mt-6 text-center">
                                <button className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Annuler
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Skeleton avec logo */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Page de chargement</h3>
                        <div className="bg-card border rounded-lg p-8">
                            <div className="text-center mb-8">
                                <LoadingLogo
                                    size="lg"
                                    message="Initialisation de TalentBridge..."
                                />
                            </div>

                            {/* Skeleton content */}
                            <div className="space-y-4">
                                <div className="h-4 bg-muted rounded animate-pulse"></div>
                                <div className="h-4 bg-muted rounded animate-pulse w-3/4"></div>
                                <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Inline loading */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Loading inline</h3>
                        <div className="bg-card border rounded-lg p-6">
                            <div className="flex items-center space-x-4">
                                <LoadingLogo size="sm" message={undefined} />
                                <span className="text-muted-foreground">Mise à jour du profil...</span>
                            </div>
                        </div>
                    </div>

                </section>

                {/* Code d'utilisation */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Code d'utilisation</h2>
                    <div className="bg-muted p-6 rounded-lg font-mono text-sm overflow-x-auto">
                        <div className="space-y-4">
                            <div>
                                <p className="text-muted-foreground mb-2">Usage basique :</p>
                                <code className="text-foreground">
                                    {`<LoadingLogo />`}
                                </code>
                            </div>

                            <div>
                                <p className="text-muted-foreground mb-2">Avec message :</p>
                                <code className="text-foreground">
                                    {`<LoadingLogo 
    size="lg" 
    message="Chargement..." 
  />`}
                                </code>
                            </div>

                            <div>
                                <p className="text-muted-foreground mb-2">Page de loading complète :</p>
                                <code className="text-foreground">
                                    {`<div className="min-h-screen flex items-center justify-center">
    <LoadingLogo 
      size="xl" 
      message="Initialisation..." 
    />
  </div>`}
                                </code>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Configuration Tailwind */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold">Configuration Tailwind requise</h2>
                    <div className="bg-muted p-6 rounded-lg font-mono text-sm overflow-x-auto">
                        <div className="space-y-4">
                            <div>
                                <p className="text-muted-foreground mb-2">À ajouter dans tailwind.config.ts :</p>
                                <code className="text-foreground">
                                    {`animation: {
    "loading-sweep": "loadingSweep 1.5s ease-in-out infinite",
  },
  
  keyframes: {
    loadingSweep: {
      "0%": { backgroundPosition: "-200% 0" },
      "100%": { backgroundPosition: "200% 0" },
    },
  }`}
                                </code>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default LoadingDemo;