import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";
import Header from "@/components/header/header";
import { UserProvider } from "@/context/userContext";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <UserProvider>
          <Header />
          {children}
          <ToastContainer aria-label={undefined} position={"bottom-right"} />
        </UserProvider>
      </body>
    </html>
  );
}
