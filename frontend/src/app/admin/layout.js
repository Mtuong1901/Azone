"use client";
import { useEffect, useState } from "react";
import "@/styles/admin.css";
import "../../../public/bootstrap/css/bootstrap.min.css";
import AuthProvider from "../(user)/component/authprovider";
import Providers from "@/redux/providers";
export default function RootLayout({ children }) {
  

  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            {children}
          </AuthProvider>
        </Providers>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://kit.fontawesome.com/ea6209cd9f.js"
          crossOrigin="anonymous"
        ></script>
      </body>
    </html>
  );
}
