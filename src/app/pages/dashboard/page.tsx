"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardCliente from "./dashboardCliente";
import DashboardArtista from "./dashboardArtista";
import SessionWrapper from "../sessionWrapper/page";
import Loading from "@/app/components/Loading";

function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  if (status === "loading") return <Loading />;

  if (!session || !session.user) {
    return null;
  }

  return session.user.role === "CLIENTE" ? (
    <DashboardCliente />
  ) : (
    <DashboardArtista />
  );
}

export default function DashboardPageWithSession() {
  return (
    <SessionWrapper>
      <DashboardPage />
    </SessionWrapper>
  );
}
