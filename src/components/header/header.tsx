"use client"

import { User } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from 'next/navigation'

const Header = () => {
    const pathname = usePathname()
    const route = useRouter()
    const user = false

    return (
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <h1
                            onClick={() => route.push('/')}
                            className="hover:cursor-pointer text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            TalentBridge
                        </h1>
                        <nav className="hidden md:flex space-x-6">
                            <Button
                                variant="link"
                                onClick={() => route.push('/jobs')}
                                className={`font-medium transition-colors hover:text-primary  ${pathname === '/jobs' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Emplois
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => route.push('/candidates')}
                                className={`font-medium transition-colors hover:text-primary  ${pathname === '/candidates' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Candidats
                            </Button>
                            <Button
                                variant="link"
                                onClick={() => route.push('/company')}
                                className={`font-medium transition-colors hover:text-primary  ${pathname === '/company' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}>
                                Entreprises
                            </Button>
                        </nav>
                    </div>
                    {
                        user ?
                            (
                                <Button className="hidden md:flex" variant="ghost" size="icon" onClick={() => route.push('/profil')}>
                                    <User className="h-5 w-5" />
                                </Button>
                            ) :
                            (
                                <Button className="hover:shadow-sm hidden md:flex" onClick={() => route.push('/auth')}>Se connecter</Button>
                            )
                    }

                </div>
            </div>
        </header>
    )
}

export default Header;
