"use client"
import { usePathname, useRouter } from 'next/navigation';


export default function Default() {
  const pathname = usePathname()
  const route = useRouter()
  if (pathname === "/") {
    route.push('/dashboard')
  }

  return (<></>)
}