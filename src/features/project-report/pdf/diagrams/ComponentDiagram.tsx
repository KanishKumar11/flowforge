/**
 * Component Hierarchy Diagram
 * Shows React/Next.js component architecture
 * For Chapter 6 (System Design) - Component section
 */
import {
  Svg,
  Rect,
  Text as SvgText,
  Line,
  G,
  Circle,
} from "@react-pdf/renderer";

export default function ComponentDiagram() {
  const width = 495;
  const height = 440;

  const colors = {
    text: "#1a1a1a",
    label: "#666666",
    page: "#1565C0",
    pageLight: "#E3F2FD",
    layout: "#2E7D32",
    layoutLight: "#E8F5E9",
    feature: "#E65100",
    featureLight: "#FFF3E0",
    ui: "#6A1B9A",
    uiLight: "#F3E5F5",
    hook: "#00695C",
    hookLight: "#E0F2F1",
    provider: "#C62828",
    providerLight: "#FFEBEE",
    connector: "#aaaaaa",
  };

  // Component box helper
  const Comp = ({
    x,
    y,
    w,
    h,
    label,
    sublabel,
    color,
    lightColor,
    stereotype,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    label: string;
    sublabel?: string;
    color: string;
    lightColor: string;
    stereotype?: string;
  }) => (
    <G>
      <Rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={3}
        fill={lightColor}
        stroke={color}
        strokeWidth={1.2}
      />
      {stereotype && (
        <SvgText
          x={x + w / 2}
          y={y + 9}
          textAnchor="middle"
          style={{ fontSize: 5, fontFamily: "Times-Italic", fill: color }}
        >
          {"<<" + stereotype + ">>"}
        </SvgText>
      )}
      <SvgText
        x={x + w / 2}
        y={stereotype ? y + 19 : y + 12}
        textAnchor="middle"
        style={{ fontSize: 6.5, fontFamily: "Times-Bold", fill: color }}
      >
        {label}
      </SvgText>
      {sublabel && (
        <SvgText
          x={x + w / 2}
          y={stereotype ? y + 28 : y + 22}
          textAnchor="middle"
          style={{ fontSize: 5, fontFamily: "Times-Roman", fill: colors.label }}
        >
          {sublabel}
        </SvgText>
      )}
    </G>
  );

  // Vertical connector
  const VLine = ({ x, y1, y2 }: { x: number; y1: number; y2: number }) => (
    <Line
      x1={x}
      y1={y1}
      x2={x}
      y2={y2}
      stroke={colors.connector}
      strokeWidth={0.8}
    />
  );

  // Horizontal connector
  const HLine = ({ x1, x2, y }: { x1: number; x2: number; y: number }) => (
    <Line
      x1={x1}
      y1={y}
      x2={x2}
      y2={y}
      stroke={colors.connector}
      strokeWidth={0.8}
    />
  );

  // Connector dot
  const Dot = ({ x, y }: { x: number; y: number }) => (
    <Circle cx={x} cy={y} r={1.5} fill={colors.connector} />
  );

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Title */}
      <SvgText
        x={width / 2}
        y={14}
        textAnchor="middle"
        style={{ fontSize: 10, fontFamily: "Times-Bold", fill: colors.text }}
      >
        Component Hierarchy Diagram
      </SvgText>

      {/* Level 0: Root Layout */}
      <Comp
        x={190}
        y={30}
        w={115}
        h={30}
        label="RootLayout"
        sublabel="app/layout.tsx"
        color={colors.layout}
        lightColor={colors.layoutLight}
        stereotype="layout"
      />

      {/* Providers row */}
      <VLine x={247} y1={60} y2={75} />
      <HLine x1={80} x2={420} y={75} />

      {/* Level 1: Providers */}
      <Comp
        x={30}
        y={80}
        w={100}
        h={28}
        label="ThemeProvider"
        sublabel="next-themes"
        color={colors.provider}
        lightColor={colors.providerLight}
        stereotype="provider"
      />
      <Comp
        x={150}
        y={80}
        w={100}
        h={28}
        label="TRPCProvider"
        sublabel="@trpc/react-query"
        color={colors.provider}
        lightColor={colors.providerLight}
        stereotype="provider"
      />
      <Comp
        x={270}
        y={80}
        w={100}
        h={28}
        label="SessionProvider"
        sublabel="better-auth"
        color={colors.provider}
        lightColor={colors.providerLight}
        stereotype="provider"
      />
      <Comp
        x={390}
        y={80}
        w={100}
        h={28}
        label="Toaster"
        sublabel="sonner"
        color={colors.provider}
        lightColor={colors.providerLight}
        stereotype="provider"
      />

      <VLine x={80} y1={75} y2={80} />
      <VLine x={200} y1={75} y2={80} />
      <VLine x={320} y1={75} y2={80} />
      <VLine x={440} y1={75} y2={80} />

      {/* Level 2: Layout Groups */}
      <VLine x={247} y1={108} y2={125} />
      <HLine x1={100} x2={400} y={125} />

      <Comp
        x={40}
        y={130}
        w={120}
        h={30}
        label="(auth)/layout"
        sublabel="Authentication Pages"
        color={colors.page}
        lightColor={colors.pageLight}
        stereotype="group"
      />
      <Comp
        x={188}
        y={130}
        w={120}
        h={30}
        label="(dashboard)/layout"
        sublabel="Main App Layout"
        color={colors.page}
        lightColor={colors.pageLight}
        stereotype="group"
      />
      <Comp
        x={340}
        y={130}
        w={120}
        h={30}
        label="(print)/layout"
        sublabel="PDF Generation"
        color={colors.page}
        lightColor={colors.pageLight}
        stereotype="group"
      />

      <VLine x={100} y1={125} y2={130} />
      <VLine x={248} y1={125} y2={130} />
      <VLine x={400} y1={125} y2={130} />

      {/* Level 3: Dashboard sub-components */}
      <VLine x={248} y1={160} y2={175} />
      <HLine x1={60} x2={440} y={175} />

      {/* Dashboard children */}
      <Comp
        x={10}
        y={180}
        w={100}
        h={28}
        label="AppSidebar"
        sublabel="Navigation"
        color={colors.feature}
        lightColor={colors.featureLight}
        stereotype="component"
      />
      <Comp
        x={120}
        y={180}
        w={100}
        h={28}
        label="AppHeader"
        sublabel="Top Bar"
        color={colors.feature}
        lightColor={colors.featureLight}
        stereotype="component"
      />
      <Comp
        x={230}
        y={180}
        w={100}
        h={28}
        label="DashboardHeader"
        sublabel="Page Header"
        color={colors.feature}
        lightColor={colors.featureLight}
        stereotype="component"
      />
      <Comp
        x={340}
        y={180}
        w={100}
        h={28}
        label="NotificationCenter"
        sublabel="Alerts"
        color={colors.feature}
        lightColor={colors.featureLight}
        stereotype="component"
      />

      <VLine x={60} y1={175} y2={180} />
      <VLine x={170} y1={175} y2={180} />
      <VLine x={280} y1={175} y2={180} />
      <VLine x={390} y1={175} y2={180} />

      {/* Level 4: Feature Pages */}
      <VLine x={248} y1={208} y2={225} />
      <HLine x1={50} x2={450} y={225} />

      <Comp
        x={10}
        y={230}
        w={85}
        h={32}
        label="DashboardPage"
        sublabel="Overview Stats"
        color={colors.page}
        lightColor={colors.pageLight}
        stereotype="page"
      />
      <Comp
        x={105}
        y={230}
        w={85}
        h={32}
        label="WorkflowsPage"
        sublabel="CRUD Workflows"
        color={colors.page}
        lightColor={colors.pageLight}
        stereotype="page"
      />
      <Comp
        x={200}
        y={230}
        w={85}
        h={32}
        label="EditorPage"
        sublabel="Visual Editor"
        color={colors.page}
        lightColor={colors.pageLight}
        stereotype="page"
      />
      <Comp
        x={295}
        y={230}
        w={85}
        h={32}
        label="ExecutionsPage"
        sublabel="Run History"
        color={colors.page}
        lightColor={colors.pageLight}
        stereotype="page"
      />
      <Comp
        x={390}
        y={230}
        w={85}
        h={32}
        label="SettingsPage"
        sublabel="Teams/Creds"
        color={colors.page}
        lightColor={colors.pageLight}
        stereotype="page"
      />

      <VLine x={50} y1={225} y2={230} />
      <VLine x={147} y1={225} y2={230} />
      <VLine x={243} y1={225} y2={230} />
      <VLine x={337} y1={225} y2={230} />
      <VLine x={432} y1={225} y2={230} />

      {/* Level 5: Editor Sub-components (detailed) */}
      <VLine x={243} y1={262} y2={278} />
      <HLine x1={80} x2={420} y={278} />

      <Comp
        x={30}
        y={282}
        w={100}
        h={32}
        label="ReactFlowCanvas"
        sublabel="Node Graph Editor"
        color={colors.feature}
        lightColor={colors.featureLight}
        stereotype="component"
      />
      <Comp
        x={145}
        y={282}
        w={100}
        h={32}
        label="NodePanel"
        sublabel="Add/Configure Nodes"
        color={colors.feature}
        lightColor={colors.featureLight}
        stereotype="component"
      />
      <Comp
        x={260}
        y={282}
        w={100}
        h={32}
        label="ExecutionPanel"
        sublabel="Run Results"
        color={colors.feature}
        lightColor={colors.featureLight}
        stereotype="component"
      />
      <Comp
        x={375}
        y={282}
        w={100}
        h={32}
        label="VersionHistory"
        sublabel="Workflow Versions"
        color={colors.feature}
        lightColor={colors.featureLight}
        stereotype="component"
      />

      <VLine x={80} y1={278} y2={282} />
      <VLine x={195} y1={278} y2={282} />
      <VLine x={310} y1={278} y2={282} />
      <VLine x={425} y1={278} y2={282} />

      {/* Level 6: UI Components */}
      <SvgText
        x={width / 2}
        y={335}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: colors.ui }}
      >
        Shared UI Component Library (shadcn/ui)
      </SvgText>
      <Line
        x1={30}
        y1={340}
        x2={465}
        y2={340}
        stroke={colors.ui}
        strokeWidth={0.5}
        strokeDasharray="4,2"
      />

      {/* UI components row */}
      {[
        "Button",
        "Dialog",
        "Card",
        "Table",
        "Input",
        "Select",
        "Tabs",
        "Badge",
        "Sheet",
        "Tooltip",
      ].map((name, i) => {
        const bx = 15 + i * 47;
        return (
          <G key={i}>
            <Rect
              x={bx}
              y={346}
              width={42}
              height={18}
              rx={2}
              fill={colors.uiLight}
              stroke={colors.ui}
              strokeWidth={0.5}
            />
            <SvgText
              x={bx + 21}
              y={357}
              textAnchor="middle"
              style={{
                fontSize: 5.5,
                fontFamily: "Times-Roman",
                fill: colors.ui,
              }}
            >
              {name}
            </SvgText>
          </G>
        );
      })}

      {/* Hooks row */}
      <SvgText
        x={width / 2}
        y={383}
        textAnchor="middle"
        style={{ fontSize: 7, fontFamily: "Times-Bold", fill: colors.hook }}
      >
        Custom Hooks
      </SvgText>
      <Line
        x1={30}
        y1={388}
        x2={465}
        y2={388}
        stroke={colors.hook}
        strokeWidth={0.5}
        strokeDasharray="4,2"
      />

      {[
        "useMobile",
        "useDebounce",
        "useSession",
        "useWorkflow",
        "useExecution",
        "useTRPC",
      ].map((name, i) => {
        const bx = 25 + i * 75;
        return (
          <G key={i}>
            <Rect
              x={bx}
              y={394}
              width={68}
              height={18}
              rx={2}
              fill={colors.hookLight}
              stroke={colors.hook}
              strokeWidth={0.5}
            />
            <SvgText
              x={bx + 34}
              y={405}
              textAnchor="middle"
              style={{
                fontSize: 5.5,
                fontFamily: "Times-Roman",
                fill: colors.hook,
              }}
            >
              {name}
            </SvgText>
          </G>
        );
      })}

      {/* Legend */}
      <SvgText
        x={15}
        y={430}
        style={{ fontSize: 5.5, fontFamily: "Times-Bold", fill: colors.label }}
      >
        Legend:
      </SvgText>
      {[
        { x: 45, color: colors.layout, label: "Layout" },
        { x: 95, color: colors.provider, label: "Provider" },
        { x: 150, color: colors.page, label: "Page" },
        { x: 195, color: colors.feature, label: "Feature" },
        { x: 250, color: colors.ui, label: "UI" },
        { x: 285, color: colors.hook, label: "Hook" },
      ].map((item, i) => (
        <G key={i}>
          <Rect
            x={item.x}
            y={423}
            width={10}
            height={10}
            rx={1}
            fill="none"
            stroke={item.color}
            strokeWidth={1}
          />
          <SvgText
            x={item.x + 14}
            y={431}
            style={{
              fontSize: 5.5,
              fontFamily: "Times-Roman",
              fill: colors.label,
            }}
          >
            {item.label}
          </SvgText>
        </G>
      ))}
    </Svg>
  );
}
