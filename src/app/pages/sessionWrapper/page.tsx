"use client";

import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <ToastContainer />
      {children}
    </SessionProvider>
  );
};

export default SessionWrapper;
