import { useEffect } from "react";
import { useRouter } from "next/router";

export default function ReportGenerateRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard/report/generate");
  }, [router]);

  return null;
}

