"use client";

import { useAuthStore } from "@/stores/auth";
import { formatCurrency } from "@/lib/utils";

export function useOrganization() {
  const { organization } = useAuthStore();

  const formatOrgCurrency = (amount: number) => {
    return formatCurrency(amount, organization?.currency || "INR");
  };

  const getOrgTimezone = () => organization?.timezone || "Asia/Kolkata";

  const getOrgCountry = () => organization?.country || "IN";

  return {
    organization,
    formatCurrency: formatOrgCurrency,
    timezone: getOrgTimezone(),
    country: getOrgCountry(),
    currency: organization?.currency || "INR",
  };
}
