import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";
const DashboardCliente = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session || !session.user) {
      router.push("/auth/login");
    } else {
      router.push("/pages/catalogoEstampas");
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Loading></Loading>
    </div>
  );
};

export default DashboardCliente;
