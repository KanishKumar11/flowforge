"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import PreliminaryPageLayout from "../components/PreliminaryPageLayout";

interface DeclarationProps {
  pageNumber: number;
}

/**
 * Declaration Page - Clean academic layout
 * Uses PreliminaryPageLayout for consistent margins
 */
export default function Declaration({ pageNumber }: DeclarationProps) {
  return (
    <PreliminaryPageLayout pageNumber={pageNumber}>
      {/* Title */}
      <View style={{ alignItems: "center", marginBottom: 32 }}>
        <Text style={styles.h1}>DECLARATION</Text>
        <View style={{ width: 80, height: 4, backgroundColor: "#000000", marginTop: 8 }} />
      </View>

      {/* Content */}
      <View>
        <Text style={styles.paragraphIndent}>
          I hereby declare that this project report entitled{" "}
          <Text style={styles.bold}>
            "FLOWGENT 1.0 - Visual Workflow Automation Platform"
          </Text>{" "}
          submitted by me to{" "}
          <Text style={styles.bold}>Hindu College, Amritsar</Text> in partial
          fulfillment of the requirements for the award of the degree of{" "}
          <Text style={styles.bold}>
            Bachelor of Computer Applications (BCA)
          </Text>{" "}
          is a bonafide record of work carried out by me under the supervision
          and guidance of{" "}
          <Text style={styles.bold}>Mr. Anshuman Sharma</Text> and{" "}
          <Text style={styles.bold}>Dr. Sunny Sharma</Text>.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 16 }]}>
          I further declare that this project work is the result of my own
          effort and that it has not been submitted anywhere else for any other
          degree or diploma. All the sources of information and help received
          during the work have been duly acknowledged.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 16 }]}>
          The work presented in this project report is original and has not been
          copied from any source without proper citation. I understand that any
          violation of this declaration may be treated as plagiarism.
        </Text>
      </View>

      {/* Signature Section */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "auto",
          paddingTop: 48,
        }}
      >
        <View>
          <Text style={{ fontSize: 11, color: "#666666", marginBottom: 40 }}>
            Place: Amritsar
          </Text>
          <Text style={{ fontSize: 11, color: "#666666" }}>
            Date: ________________
          </Text>
        </View>

        <View style={{ alignItems: "center" }}>
          <View
            style={{
              width: 160,
              borderTopWidth: 2,
              borderTopColor: "#000000",
              marginBottom: 4,
            }}
          />
          <Text style={{ fontSize: 14, fontFamily: "Times-Bold" }}>
            Kanish Kumar
          </Text>
          <Text style={{ fontSize: 11, color: "#666666" }}>
            Roll No: 11792312331
          </Text>
          <Text style={{ fontSize: 10, color: "#888888" }}>BCA Final Year</Text>
        </View>
      </View>
    </PreliminaryPageLayout>
  );
}
