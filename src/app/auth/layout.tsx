"use client"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../globals.css";
import { useRouter } from 'next/navigation';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const route = useRouter()
  return (
    <html lang="en">
      <body
        className={`relative antialiased`}
      >
        <h1
          onClick={() => route.push('/')}
          className="absolute top-4 left-4 hover:cursor-pointer text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          TalentBridge
        </h1>

        {children}
        <ToastContainer aria-label={undefined} />
      </body>
    </html>
  );
}
