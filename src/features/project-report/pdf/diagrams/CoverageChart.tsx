"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import { useEffect, useState } from "react";

// Attempt to fetch coverage JSON from public path at runtime (will be available if tests run and file copied to /public/coverage)
// This avoids bundling the JSON into the client build and prevents Turbopack import errors.
function useCoverage() {
  const [data, setData] = useState<Record<string, any> | null | undefined>(
    undefined,
  );
  useEffect(() => {
    let mounted = true;
    fetch("/coverage/coverage-final.json")
      .then((r) => (r.ok ? r.json() : Promise.reject("not found")))
      .then((j) => mounted && setData(j))
      .catch(() => mounted && setData(null));
    return () => {
      mounted = false;
    };
  }, []);
  return data;
}

export default function CoverageChart({
  initialData,
}: { initialData?: any } = {}) {
  const remoteData = useCoverage();
  const coverage = initialData !== undefined ? initialData : remoteData;

  if (coverage === undefined) {
    // Still loading
    return (
      <View>
        <Text
          style={{ fontSize: 11, fontFamily: "Times-Bold", marginBottom: 6 }}
        >
          Test Coverage
        </Text>
        <Text
          style={{ fontSize: 9, fontFamily: "Times-Italic", color: "#999999" }}
        >
          Loading coverage data...
        </Text>
      </View>
    );
  }

  if (!coverage || Object.keys(coverage).length === 0) {
    return (
      <View>
        <Text
          style={{ fontSize: 11, fontFamily: "Times-Bold", marginBottom: 6 }}
        >
          Test Coverage
        </Text>
        <Text
          style={{ fontSize: 9, fontFamily: "Times-Italic", color: "#999999" }}
        >
          Coverage data not available — run tests and copy the generated
          coverage/coverage-final.json to /public/coverage/
        </Text>
      </View>
    );
  }

  // Compute overall coverage (statements covered / total)
  let totalStatements = 0;
  let coveredStatements = 0;

  const fileEntries = Object.entries(coverage || {});
  const filesSummary = fileEntries.map(([file, data]: any) => {
    const s = data.s || {};
    const total = Object.keys(s).length;
    const covered = Object.values(s as Record<string, number>).filter(
      (v) => (v as number) > 0,
    ).length;
    totalStatements += total;
    coveredStatements += covered;
    const pct = total === 0 ? 100 : Math.round((covered / total) * 100);
    return { file, total, covered, pct };
  });

  const overallPct =
    totalStatements === 0
      ? 100
      : Math.round((coveredStatements / totalStatements) * 100);

  // Top 5 files by uncovered / highest lines missed (for quick visibility)
  const topFiles = filesSummary
    .map((f: any) => ({ file: f.file, pct: f.pct }))
    .sort((a: any, b: any) => a.pct - b.pct)
    .slice(0, 5);

  return (
    <View>
      <Text style={{ fontSize: 11, fontFamily: "Times-Bold", marginBottom: 6 }}>
        Test Coverage
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{
            width: "70%",
            height: 14,
            borderWidth: 1,
            borderColor: "#cccccc",
            marginRight: 8,
          }}
        >
          <View
            style={{
              width: `${overallPct}%`,
              height: "100%",
              backgroundColor: overallPct >= 80 ? "#4CAF50" : "#FF9800",
            }}
          />
        </View>
        <Text style={{ fontSize: 10, fontFamily: "Times-Roman" }}>
          {overallPct}% overall
        </Text>
      </View>

      {topFiles.length > 0 && (
        <View style={{ marginTop: 8 }}>
          <Text
            style={{
              fontSize: 9,
              fontFamily: "Times-Italic",
              color: "#666666",
              marginBottom: 4,
            }}
          >
            Top files (lowest coverage)
          </Text>
          {topFiles.map((t: any) => (
            <Text
              key={t.file}
              style={{
                fontSize: 8,
                fontFamily: "Times-Roman",
                marginBottom: 2,
              }}
            >
              • {t.file.replace(/^.*src\//, "src/")}: {t.pct}%
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
