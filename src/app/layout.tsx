"use client"

import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<'guest' | 'user' | 'admin'>('guest');

  useEffect(() => {
    // Example: Fetch role from an API or localStorage
    const userRole = localStorage.getItem('role') || 'guest';
    setRole(userRole as 'guest' | 'user' | 'admin');
  }, []);

  const changeRole = (newRole: 'guest' | 'user' | 'admin') => {
    setRole(newRole);
    localStorage.setItem('role', newRole);
  };

  return (
    <html lang="en">
      <head>
        <title>Trendy Closet</title>
        <link rel="icon" href="/Logo-Black-Fill.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Header role={role} />
        <div>
          <button onClick={() => changeRole('guest')}>Guest Mode</button>
          <button onClick={() => changeRole('user')}>User Mode</button>
          <button onClick={() => changeRole('admin')}>Admin Mode</button>
        </div>
        <main>{children}</main>
        {role === "guest" && <Footer />}
      </body>
    </html>
  );
}
