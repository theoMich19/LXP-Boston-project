"use client"

import { User } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from 'next/navigation'
import { useUser } from "@/context/userContext";

const Header = () => {
    const { user, logout, isAuthenticated } = useUser();
    console.log("🚀 ~ Header ~ user:", user)
    console.log("🚀 ~ Header ~ isAuthenticated:", isAuthenticated)
    const pathname = usePathname()
    const route = useRouter()

    // if (!isAuthenticated) {
    //     route.push("/dashboard")
    // }


    if (pathname === "/auth") {
        return (
            <h1
                onClick={() => route.push('/')}
                className="absolute top-4 left-4 hover:cursor-pointer text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TalentBridge
            </h1>
        )
    }

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
                    </div>
                    {
                        isAuthenticated ?
                            (
                                <div className="flex space-x-4">
                                    <Button className="hidden md:flex " variant="ghost" onClick={() => route.push('/profile')}>
                                        <User className="h-5 w-5" />
                                        <span>Profile</span>
                                    </Button>
                                    <Button className="hover:shadow-sm hidden md:flex" onClick={() => logout()}>Logout</Button>
                                </div>
                            ) :
                            (
                                <Button className="hover:shadow-sm hidden md:flex" onClick={() => route.push('/auth')}>Login</Button>
                            )
                    }

                </div>
            </div>
        </header >
    )
}

export default Header;
