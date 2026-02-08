"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import PreliminaryPageLayout from "../components/PreliminaryPageLayout";

interface AcknowledgementProps {
  pageNumber: number;
}

/**
 * Acknowledgement Page
 * Uses PreliminaryPageLayout for consistent margins
 */
export default function Acknowledgement({ pageNumber }: AcknowledgementProps) {
  return (
    <PreliminaryPageLayout pageNumber={pageNumber}>
      {/* Title */}
      <View style={{ alignItems: "center", marginBottom: 28 }}>
        <Text style={styles.h1}>ACKNOWLEDGEMENT</Text>
        <View style={{ width: 80, height: 4, backgroundColor: "#000000" }} />
      </View>

      {/* Content */}
      <View>
        <Text style={styles.paragraphIndent}>
          The success and final outcome of this project required a lot of
          guidance and assistance from many people, and I am extremely
          privileged to have got this all along the completion of my project.
          All that I have done is only due to such supervision and assistance,
          and I would not forget to thank them.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 14 }]}>
          I express my heartfelt gratitude to my project guides{" "}
          <Text style={styles.bold}>Mr. Anshuman Sharma</Text> and{" "}
          <Text style={styles.bold}>Dr. Sunny Sharma</Text> for their valuable
          guidance, constant encouragement, and constructive criticism
          throughout the development of this project. Their expertise and
          insights have been instrumental in shaping this work.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 14 }]}>
          I would like to express my sincere thanks to the Head of Department,{" "}
          <Text style={styles.bold}>Dr. Rama Sharma</Text>, Department of
          Computer Applications, for providing this opportunity and for the
          necessary support and facilities during the project work.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 14 }]}>
          I am also thankful to the Principal,{" "}
          <Text style={styles.bold}>Dr. Rakesh Kumar</Text>, Hindu College,
          Amritsar, for providing the required infrastructure and resources that
          made this project possible.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 14 }]}>
          Special thanks to all the faculty members of the Department of
          Computer Applications for their support and encouragement. Their
          teaching and knowledge throughout the BCA program have laid the
          foundation for this project.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 14 }]}>
          I extend my appreciation to my classmates and friends for their
          cooperation, suggestions, and moral support during the entire project
          period.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 14 }]}>
          Last but not least, I would like to express my deepest gratitude to my{" "}
          <Text style={styles.bold}>family</Text> for their unconditional love,
          support, and encouragement. Their belief in me has been my greatest
          strength throughout this journey.
        </Text>
      </View>

      {/* Signature */}
      <View style={{ alignItems: "flex-end", marginTop: 40 }}>
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
        </View>
      </View>
    </PreliminaryPageLayout>
  );
}
