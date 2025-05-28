"use client"
import { useRouter } from 'next/navigation';


export default function Default() {
  const route = useRouter()
  route.push('/dashboard')

  return (<></>)
}