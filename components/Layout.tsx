import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen bg-gray-100">
    <header className="bg-blue-500 text-white p-5">
      <h1 className="text-xl">AI Image Generation</h1>
    </header>
    <main className="container mx-auto p-5">{children}</main>
  </div>
);

export default Layout;
