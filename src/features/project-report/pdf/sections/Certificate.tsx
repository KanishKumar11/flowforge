"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import PreliminaryPageLayout from "../components/PreliminaryPageLayout";

interface CertificateProps {
  pageNumber: number;
}

/**
 * Certificate Page with double border frame
 * Uses PreliminaryPageLayout for consistent margins
 */
export default function Certificate({ pageNumber }: CertificateProps) {
  return (
    <PreliminaryPageLayout pageNumber={pageNumber}>
      {/* Content Container */}
      <View style={{ flex: 1 }}>
        {/* Title */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Text style={styles.h1}>CERTIFICATE</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{ width: 64, height: 2, backgroundColor: "#000000" }}
            />
            <Text style={{ marginHorizontal: 16 }}>*</Text>
            <View
              style={{ width: 64, height: 2, backgroundColor: "#000000" }}
            />
          </View>
        </View>

        {/* Certificate Text */}
        <View>
          <Text style={styles.paragraph}>
            This is to certify that the project entitled <Text style={styles.bold}>“FLOWGENT 1.0 – Visual Workflow Automation Platform”</Text> submitted to <Text style={styles.bold}>PG Department of Computer Science and Application, Hindu College, Amritsar</Text>, for the partial fulfillment of the requirements of the degree <Text style={styles.bold}>Bachelor of Computer Applications (BCA)</Text> 6th semester, is a bonafide work carried out by <Text style={styles.bold}>Kanish Kumar</Text> (Roll No: <Text style={styles.bold}>11792312331</Text>) under our supervision and guidance.
          </Text>


          <Text style={[styles.paragraph, { marginTop: 16 }]}>The work has been completed by the candidate under our supervision, and the student is solely responsible for the content and any project plagiarism.</Text>
        </View>

        {/* Signatures - Row 1 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 80,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 140,
                borderTopWidth: 2,
                borderTopColor: "#000000",
                marginBottom: 4,
              }}
            />
            <Text style={{ fontSize: 12, fontFamily: "Times-Bold" }}>
              Mr. Anshuman Sharma
            </Text>
            <Text style={{ fontSize: 10, color: "#666666" }}>
              Project Guide
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 140,
                borderTopWidth: 2,
                borderTopColor: "#000000",
                marginBottom: 4,
              }}
            />
            <Text style={{ fontSize: 12, fontFamily: "Times-Bold" }}>
              Dr. Sunny Sharma
            </Text>
            <Text style={{ fontSize: 10, color: "#666666" }}>
              Project Guide
            </Text>
          </View>
        </View>

        {/* Signatures - Row 2 */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 56,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 140,
                borderTopWidth: 2,
                borderTopColor: "#000000",
                marginBottom: 8,
              }}
            />
            <Text style={{ fontSize: 12, fontFamily: "Times-Bold" }}>
              Dr. Rama Sharma
            </Text>
            <Text style={{ fontSize: 10, color: "#666666", marginTop: 2 }}>
              Head of Department
            </Text>
            <Text style={{ fontSize: 9, color: "#666666", marginTop: 2 }}>
              PG Department of
            </Text>
            <Text style={{ fontSize: 9, color: "#888888", marginTop: 2 }}>
              Computer Science & Applications
            </Text>
          </View>

          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 140,
                borderTopWidth: 2,
                borderTopColor: "#000000",
                marginBottom: 8,
              }}
            />
            <Text
              style={{ fontSize: 12, fontFamily: "Times-Bold", marginTop: 16 }}
            >
              External Examiner
            </Text>
          </View>
        </View>
      </View>
    </PreliminaryPageLayout>
  );
}
