"use client";

import { useEffect, useState } from "react";
import { useContracts } from "@/context/contracts-context";
import AnanaLoading from "../anana-loading";
import EmployeeDashboard from "../dashboard/employee";
import EmployerDashboard from "../dashboard/employer";

type Props = {
  companyContractId: string;
};

export default function ProjectDetailsClientPage({ companyContractId }: Props) {
  const [loadingPage, setLoadingPage] = useState(true);
  const { companyRegistry, address, isConnected, account } = useContracts();
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(false);

  useEffect(() => {
    if (!(companyRegistry && address && isConnected && account)) {
      return;
    }

    const checkIsCompanyAdmin = async () => {
      const isAdmin = await companyRegistry.read.isCompanyAdmin([
        BigInt(companyContractId),
        address,
      ]);
      setIsCompanyAdmin(isAdmin);
      setLoadingPage(false);
    };

    checkIsCompanyAdmin();

    setLoadingPage(false);
  }, [companyRegistry, address, isConnected, account, companyContractId]);

  if (loadingPage) {
    return <AnanaLoading />;
  }

  if (isCompanyAdmin) {
    return <EmployerDashboard companyContractId={companyContractId} />;
  }

  return <EmployeeDashboard companyContractId={companyContractId} />;
}
