import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { getSession } from '@auth0/nextjs-auth0';

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    return (
    <html lang="en">
    <UserProvider>
      <body className={inter.className}>
        <nav className="navigationBar">
          <a href="/">Sustainment</a>
          <a href="/discover">Discover</a>
          <a href="/api/auth/login">Login</a>
        </nav>
        {children}
      </body>
    </UserProvider>
    </html>
    );
  } else {
    return (
      <html lang="en">
      <UserProvider>
        <body className={inter.className}>
          <nav className="navigationBar">
            <a href="/">Sustainment</a>
            <a href="/discover">Discover</a>
            <a href="/profile">Profile</a>
            <a href="/api/auth/logout">Logout</a>
          </nav>
          {children}
        </body>
      </UserProvider>
      </html>
      );
  }
}
