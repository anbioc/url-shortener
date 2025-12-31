"use client";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import { UrlAnalytics } from "@/types/analytics.model";
import { toast } from "sonner";

ChartJS.register(LineElement, PointElement, LinearScale, Title, CategoryScale);

export default function ChartComponent() {
  const [stats, setStats] = useState<UrlAnalytics | null>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getStats = async () => {
      const response = await fetch("api/external/url/analytics", {
        method: "post",
        body: JSON.stringify({
          from: "2025/12/08",
          to: "2025/12/10",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
        console.log("urls got");
      } else {
        const error = await response.json();
        setError(error.error! || "Failed to get url list");
        console.log("error getting urls");
        toast(error.error! || "Failed to get url list")
      }
    };

    getStats();
  }, []);

  return (
    <div className="ring-1 ring-gray-200 mt-8 rounded-xl h-200">
      {/* header */}
      <div className="flex items-center justify-center w-full bg-gray-50">
        <div className="w-1/3  h-50 rounded-tl-xl border-r hover:bg-gray-100 cursor-pointer px-16 py-16">
          <div className="flex items-center justify-center w-fit">
            <div className="bg-sky-400 h-3 w-3 me-2" />
            <h1 className="text-xl">Clicks</h1>
          </div>
          <h1 className="text-3xl font-semibold mt-2">
            {stats ? stats.total_clicks : 0}
          </h1>
        </div>

        <div className="-mx-4 flex rounded-full h-8 w-8 ring-1 ring-gray-300 bg-gray-50 items-center justify-center z-10">
          <ChevronRight className="text-gray-400" />
        </div>

        <div className="w-1/3  h-50 hover:bg-gray-100 cursor-pointer  px-16 py-16">
          <div className="flex items-center justify-center w-fit">
            <div className="bg-teal-400 h-3 w-3 me-2" />
            <h1 className="text-xl">Leads</h1>
          </div>
          <h1 className="text-3xl font-semibold mt-2">
            {stats ? stats.leads : 0}
          </h1>
        </div>

        <div className="-mx-4 z-10 flex rounded-full h-8 w-8 ring-1 ring-gray-300 bg-gray-50 items-center justify-center">
          <ChevronRight className="text-gray-400" />
        </div>
        <div className="w-1/3  h-50 rounded-tr-4xl border-l hover:bg-gray-100 cursor-pointer px-16 py-16">
          <div className="flex items-center justify-center w-fit">
            <div className="bg-violet-400 h-3 w-3 me-2" />
            <h1 className="text-xl">Sales</h1>
          </div>
          <h1 className="text-3xl font-semibold mt-2">
            {stats ? stats.sales : 0}
          </h1>
        </div>
      </div>

      {/* chart */}

      <span className="mt-20 block" />

      <AnalyticsChart input={stats?.stats}/>
    </div>
  );
}

function AnalyticsChart({input}: {input: Map<string, number> | undefined}) {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Users",
        data: [65, 59, 80, 81, 56],
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };

  return <Line data={data} options={{ responsive: true }} />;
}
