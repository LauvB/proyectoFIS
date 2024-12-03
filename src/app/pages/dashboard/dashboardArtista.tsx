import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";
const DashboardArtista = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user?.artistaId) {
      router.push("/auth/login");
    } else {
      router.push("/pages/subirEstampa");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Loading></Loading>
    </div>
  );
};

export default DashboardArtista;
