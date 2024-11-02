"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth, subYears } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TransactionTable from "./_components/TransactionTable";
import DockArea from "@/components/DockArea";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

export default function TransactionsPage() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    getSession()
      .then((res) => setSession(res))
      .catch(() => toast.error("Failed to fetch session"));
  }, []);
  //if (!session) redirect("/auth");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subYears(new Date(), 1),
    to: new Date(),
  });

  return (
    <>
      <div className="border-b bg-card ">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-6">
          <div className="">
            <p className="text-3xl font-bold">Transactions history</p>
          </div>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;
              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days!`
                );
                return;
              }
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className="container mb-20">
        <TransactionTable from={dateRange.from} to={dateRange.to} />
      </div>
      <div className="fixed bottom-1 mx-auto w-full">
        <DockArea />
      </div>
    </>
  );
}
