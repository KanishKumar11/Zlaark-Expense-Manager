"use client";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { IUserSettings } from "@/models/UserSettings";
import {
  differenceInDays,
  startOfMonth,
  subYears,
  startOfYear,
} from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";

const Overview = ({ userSettings }: { userSettings: IUserSettings }) => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  // Lifetime range (assuming from the earliest possible date)
  const lifetimeRange = { from: new Date(2000, 0, 1), to: new Date() };
  console.log(lifetimeRange);
  console.log(dateRange);

  // Current financial year range (assuming financial year starts in April)
  const currentYear = new Date().getFullYear();
  const financialYearStart = new Date(currentYear, 3, 1); // April 1st of the current year
  const isBeforeApril = new Date() < financialYearStart;
  const financialYearRange = {
    from: isBeforeApril
      ? new Date(currentYear - 1, 3, 1) // Last year's April 1st
      : financialYearStart,
    to: new Date(),
  };

  return (
    <div>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <h2 className="text-3xl font-bold">Overview</h2>
        <div className="flex items-center gap-3">
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
      <div className="w-full container flex flex-col gap-2">
        <h3 className="text-xl font-bold mt-6">Lifetime Stats</h3>
        <StatsCards
          userSettings={userSettings}
          from={lifetimeRange.from}
          to={lifetimeRange.to}
        />

        {/* Stats for the current financial year */}
        <h3 className="text-xl font-bold mt-6">Financial Year Stats</h3>
        <StatsCards
          userSettings={userSettings}
          from={financialYearRange.from}
          to={financialYearRange.to}
        />

        {/* Stats for the selected date range */}
        <h3 className="text-xl font-bold mt-6">Selected Period Stats</h3>
        <StatsCards
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />

        <CategoriesStats
          userSettings={userSettings}
          from={dateRange.from}
          to={dateRange.to}
        />
        {/* Stats for the lifetime */}
      </div>
    </div>
  );
};

export default Overview;
