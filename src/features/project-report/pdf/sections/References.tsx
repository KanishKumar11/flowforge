"use client";

import { View, Text } from "@react-pdf/renderer";
import { styles } from "../styles";
import BookPageLayout from "../components/BookPageLayout";

/**
 * References Section (2 pages)
 */
export default function References() {
  const books = [
    {
      num: 1,
      text: `Sommerville, I. (2016). Software Engineering (10th ed.). Pearson Education. ISBN: 978-0133943030.`,
    },
    {
      num: 2,
      text: `Pressman, R. S. & Maxim, B. R. (2014). Software Engineering: A Practitioner's Approach (8th ed.). McGraw-Hill Education. ISBN: 978-0078022128.`,
    },
    {
      num: 3,
      text: `Boehm, B. W. (1981). Software Engineering Economics. Prentice-Hall. ISBN: 978-0138221225.`,
    },
    {
      num: 4,
      text: `Fowler, M. (2018). Refactoring: Improving the Design of Existing Code (2nd ed.). Addison-Wesley. ISBN: 978-0134757599.`,
    },
    {
      num: 5,
      text: `Martin, R. C. (2017). Clean Architecture: A Craftsman's Guide to Software Structure and Design. Prentice Hall. ISBN: 978-0134494166.`,
    },
    {
      num: 6,
      text: `Beck, K. et al. (2001). Manifesto for Agile Software Development. agilemanifesto.org.`,
    },
    {
      num: 7,
      text: `Fowler, M. (2002). Patterns of Enterprise Application Architecture. Addison-Wesley. ISBN: 978-0321127426.`,
    },
    {
      num: 8,
      text: `IEEE Standard 830-1998. IEEE Recommended Practice for Software Requirements Specifications. IEEE Computer Society.`,
    },
  ];

  const webResources = [
    {
      num: 9,
      text: `Next.js Documentation. Vercel Inc. Available at: https://nextjs.org/docs [Accessed: February 2026]`,
    },
    {
      num: 10,
      text: `React Documentation. Meta Platforms, Inc. Available at: https://react.dev [Accessed: February 2026]`,
    },
    {
      num: 11,
      text: `React Flow - Node-Based UI Library. xyflow. Available at: https://reactflow.dev [Accessed: February 2026]`,
    },
    {
      num: 12,
      text: `Inngest Documentation - Durable Execution Engine. Available at: https://www.inngest.com/docs [Accessed: February 2026]`,
    },
    {
      num: 13,
      text: `Prisma ORM Documentation. Prisma Data, Inc. Available at: https://www.prisma.io/docs [Accessed: February 2026]`,
    },
    {
      num: 14,
      text: `tRPC Documentation - End-to-end Typesafe APIs. Available at: https://trpc.io/docs [Accessed: February 2026]`,
    },
    {
      num: 15,
      text: `Better Auth - TypeScript Authentication Library. Available at: https://www.better-auth.com [Accessed: February 2026]`,
    },
    {
      num: 16,
      text: `Tailwind CSS Documentation. Tailwind Labs Inc. Available at: https://tailwindcss.com [Accessed: February 2026]`,
    },
    {
      num: 17,
      text: `TypeScript Handbook. Microsoft Corporation. Available at: https://www.typescriptlang.org/docs [Accessed: February 2026]`,
    },
    {
      num: 18,
      text: `Sentry Error Monitoring Documentation. Functional Software, Inc. Available at: https://docs.sentry.io [Accessed: February 2026]`,
    },
    {
      num: 19,
      text: `Polar - Open Source Monetization Platform. Available at: https://polar.sh/docs [Accessed: February 2026]`,
    },
    {
      num: 20,
      text: `Neon Serverless PostgreSQL Documentation. Neon Inc. Available at: https://neon.tech/docs [Accessed: February 2026]`,
    },
    {
      num: 21,
      text: `Grand View Research. (2023). Workflow Automation Market Size Report. Available at: https://www.grandviewresearch.com [Accessed: February 2026]`,
    },
    {
      num: 22,
      text: `Gartner. (2023). Magic Quadrant for Integration Platform as a Service. Available at: https://www.gartner.com [Accessed: February 2026]`,
    },
  ];

  const apiDocs = [
    {
      num: 23,
      text: `OpenAI API Documentation. OpenAI. Available at: https://platform.openai.com/docs [Accessed: February 2026]`,
    },
    {
      num: 24,
      text: `Anthropic Claude API Documentation. Anthropic. Available at: https://docs.anthropic.com [Accessed: February 2026]`,
    },
    {
      num: 25,
      text: `Google AI Studio - Gemini API. Google. Available at: https://ai.google.dev/docs [Accessed: February 2026]`,
    },
    {
      num: 26,
      text: `Slack Web API Documentation. Salesforce. Available at: https://api.slack.com/web [Accessed: February 2026]`,
    },
    {
      num: 27,
      text: `Notion API Documentation. Notion Labs, Inc. Available at: https://developers.notion.com [Accessed: February 2026]`,
    },
    {
      num: 28,
      text: `PostgreSQL Documentation (Version 16). The PostgreSQL Global Development Group. Available at: https://www.postgresql.org/docs [Accessed: February 2026]`,
    },
  ];

  const papers = [
    {
      num: 29,
      text: `Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures. Doctoral dissertation, University of California, Irvine.`,
    },
    {
      num: 30,
      text: `Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). Design Patterns: Elements of Reusable Object-Oriented Software. Addison-Wesley.`,
    },
    {
      num: 31,
      text: `Dekel, U. & Herbsleb, J. D. (2007). Notation and Representation in Collaborative Object-Oriented Design. Proc. ACM SIGPLAN.`,
    },
    {
      num: 32,
      text: `van der Aalst, W. M. P. (2013). Business Process Management: A Comprehensive Survey. ISRN Software Engineering.`,
    },
  ];

  return (
    <BookPageLayout chapterTitle="References" chapterNum="">
      <View style={{ alignItems: "center", marginTop: 16, marginBottom: 24 }}>
        <Text style={styles.h1}>REFERENCES</Text>
        <View
          style={{
            width: 60,
            height: 3,
            backgroundColor: "#000000",
            marginTop: 8,
          }}
        />
      </View>

      <Text
        style={{ fontSize: 12, fontFamily: "Times-Bold", marginBottom: 12 }}
      >
        Books
      </Text>
      {books.map((ref) => (
        <View key={ref.num} style={{ flexDirection: "row", marginBottom: 10 }}>
          <Text style={{ width: 30, fontSize: 10 }}>[{ref.num}]</Text>
          <Text style={{ flex: 1, fontSize: 10, lineHeight: 1.5 }}>
            {ref.text}
          </Text>
        </View>
      ))}

      <Text
        style={{
          fontSize: 12,
          fontFamily: "Times-Bold",
          marginTop: 16,
          marginBottom: 12,
        }}
      >
        Web Resources & Documentation
      </Text>
      {webResources.map((ref) => (
        <View key={ref.num} style={{ flexDirection: "row", marginBottom: 10 }}>
          <Text style={{ width: 30, fontSize: 10 }}>[{ref.num}]</Text>
          <Text style={{ flex: 1, fontSize: 10, lineHeight: 1.5 }}>
            {ref.text}
          </Text>
        </View>
      ))}

      <Text
        style={{ fontSize: 12, fontFamily: "Times-Bold", marginBottom: 12 }}
      >
        API Documentation
      </Text>
      {apiDocs.map((ref) => (
        <View key={ref.num} style={{ flexDirection: "row", marginBottom: 10 }}>
          <Text style={{ width: 30, fontSize: 10 }}>[{ref.num}]</Text>
          <Text style={{ flex: 1, fontSize: 10, lineHeight: 1.5 }}>
            {ref.text}
          </Text>
        </View>
      ))}

      <Text
        style={{
          fontSize: 12,
          fontFamily: "Times-Bold",
          marginTop: 16,
          marginBottom: 12,
        }}
      >
        Research Papers & Standards
      </Text>
      {papers.map((ref) => (
        <View key={ref.num} style={{ flexDirection: "row", marginBottom: 10 }}>
          <Text style={{ width: 30, fontSize: 10 }}>[{ref.num}]</Text>
          <Text style={{ flex: 1, fontSize: 10, lineHeight: 1.5 }}>
            {ref.text}
          </Text>
        </View>
      ))}

      <View
        style={{
          marginTop: 24,
          padding: 12,
          backgroundColor: "#f8f8f8",
          borderWidth: 1,
          borderColor: "#cccccc",
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Times-Italic",
            textAlign: "center",
          }}
        >
          All web resources were accessed between January and March 2026.
        </Text>
      </View>
    </BookPageLayout>
  );
}
