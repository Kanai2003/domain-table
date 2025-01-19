/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { DataRow } from "../types/type";
import * as XLSX from "xlsx";

export const useXLSXData = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/domains.xlsx");

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error("No sheets found in the workbook");
        }

        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const processedData = jsonData.map((row: any) => {
          console.log(row);
          if (!row.Domain) {
            console.warn("Row missing domain:", row);
          }

          return {
            domain: String(row.Domain || ""),
            niche1: String(row["Niche 1"] || ""),
            niche2: String(row["Niche 2"] || ""),
            traffic: isNaN(row.Traffic) ? 0 : Number(row.Traffic),
            dr: isNaN(row.DR) ? 0 : Number(row.DR),
            da: isNaN(row.DA) ? 0 : Number(row.DA),
            language: String(row.Language || ""),
            price: isNaN(row.Price) ? 0 : Number(row.Price),
            spamScore: isNaN(row["Spam Score"]) ? 0 : Number(row["Spam Score"]),
          };
        });

        setData(processedData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading XLSX file:", err);
        setError(
          err instanceof Error ? err.message : "Error loading data file"
        );
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};
