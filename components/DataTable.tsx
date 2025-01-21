"use client";
import React, { useState, useMemo, useEffect } from "react";
import { ChevronUp, ChevronDown, Search, ChevronsUpDown } from "lucide-react";
import { useXLSXData } from "../hooks/useXLSXData";
import { DataRow, SortConfig } from "@/types/type";
import { useRouter } from "next/navigation";
import DomainModal from "./ModalComponent";

const ROW_HEIGHT = 40;
const VISIBLE_ROWS = 20;

const DataTable = () => {
  const router = useRouter();
  const { data, loading, error } = useXLSXData();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "asc",
  });
  const [selectedDomain, setSelectedDomain] = useState<DataRow | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.push("/");
    }
  }, [router]);

  const processedData = useMemo(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter((row) =>
        row.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig]);

  const totalHeight = processedData.length * ROW_HEIGHT;
  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const visibleData = processedData.slice(
    startIndex,
    startIndex + VISIBLE_ROWS
  );

  const handleSort = (key: keyof DataRow) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleRowClick = (row: DataRow) => {
    setSelectedDomain(row);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 p-4 bg-red-50 rounded">{error}</div>;
  }

  const headerElement = () => (
    <div className="mb-4 flex items-center gap-4 justify-between">
      <div className="relative flex-1 max-w-md">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search domains..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        className="bg-red-700 p-2 rounded-lg "
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          router.push("/");
        }}
      >
        Log Out
      </button>
    </div>
  );

  const tableElement = () => {
    const columns = isSmallScreen
      ? ["Domain", "Traffic", "Price"]
      : [
          "Domain",
          "Niche 1",
          "Niche 2",
          "Traffic",
          "DR",
          "DA",
          "Language",
          "Price",
          "Spam Score",
        ];

    return (
      <div className="border rounded-lg bg-white text-black">
        <div className="overflow-x-auto">
          <div className="bg-blue-100 sticky top-0">
            <div className="flex">
              {columns.map((header, index) => {
                const key =
                  header === "Spam Score"
                    ? "spamScore"
                    : (header.toLowerCase().replace(" ", "") as keyof DataRow);
                return (
                  <div
                    key={index}
                    className="px-4 py-2 flex-1 cursor-pointer hover:bg-blue-300 flex items-center"
                    onClick={() => handleSort(key)}
                  >
                    {header}
                    {sortConfig.key === key ? (
                      <span className="ml-1">
                        {sortConfig.direction === "asc" ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </span>
                    ) : (
                      <ChevronsUpDown
                        size={16}
                        style={{ marginLeft: "16px" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="overflow-y-auto"
            style={{ height: `${VISIBLE_ROWS * ROW_HEIGHT}px` }}
            onScroll={handleScroll}
          >
            <div style={{ height: `${totalHeight}px`, position: "relative" }}>
              <div
                style={{
                  transform: `translateY(${startIndex * ROW_HEIGHT}px)`,
                }}
              >
                {visibleData.map((row, index) => (
                  <div
                    key={index}
                    className="flex border-t hover:bg-gray-200 hover:cursor-pointer"
                    style={{ height: `${ROW_HEIGHT}px` }}
                    onClick={() => handleRowClick(row)}
                  >
                    {columns.map((col, colIndex) => (
                      <div key={colIndex} className="flex-1 px-4 py-2 truncate">
                        {col === "Spam Score"
                          ? row["spamScore" as keyof DataRow]
                          : row[
                              col
                                .toLowerCase()
                                .replace(" ", "") as keyof DataRow
                            ]}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 text-black">
      {headerElement()}
      {tableElement()}
      {selectedDomain && (
        <DomainModal
          domain={selectedDomain}
          onClose={() => setSelectedDomain(null)}
        />
      )}
    </div>
  );
};

export default DataTable;
