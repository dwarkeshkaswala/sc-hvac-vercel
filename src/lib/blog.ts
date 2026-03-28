export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "tip"; label: string; text: string };

export interface BlogPost {
  slug: string;
  tag: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
  author: { name: string; role: string };
  content: ContentBlock[];
}

export const posts: BlogPost[] = [
  {
    slug: "cut-ac-bill-30-percent",
    tag: "Energy Saving",
    date: "Mar 12, 2026",
    title: "How to Cut Your AC Bill by 30% This Summer",
    excerpt:
      "Simple changes — from thermostat scheduling to annual servicing — that consistently drop power consumption without sacrificing comfort.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    readTime: "4 min read",
    author: { name: "Rajesh Patel", role: "Lead HVAC Engineer" },
    content: [
      {
        type: "paragraph",
        text: "Electricity bills spike every summer, and your air conditioning system is almost always the biggest culprit. The good news: you don't need to upgrade your entire system to see a meaningful drop. In our 15 years of commissioning and servicing HVAC systems across Gujarat, we've seen the same handful of changes consistently deliver 25–35% reductions in power consumption.",
      },
      { type: "heading", text: "1. Set your thermostat to 24°C, not 18°C" },
      {
        type: "paragraph",
        text: "Every degree below 24°C increases energy consumption by approximately 6%. Most people don't actually feel the difference between 22°C and 24°C once the space has cooled down — the initial blast of cold air creates a perception of efficiency that isn't there. Set your thermostat to 24°C and enable auto mode so the compressor cycles off when the target is reached.",
      },
      { type: "heading", text: "2. Service your system before peak season" },
      {
        type: "paragraph",
        text: "A dirty evaporator coil can reduce efficiency by up to 30% on its own. Blocked air filters force the fan motor to work harder, consuming more power for less airflow. A proper pre-summer service includes coil cleaning, refrigerant level check, drain flushing, and capacitor inspection — all of which together restore the system to near-factory efficiency.",
      },
      {
        type: "tip",
        label: "Pro Tip",
        text: "Schedule your service in February or early March, before the rush. Service slots fill up quickly by April and emergency calls take priority.",
      },
      { type: "heading", text: "3. Use scheduling and zone control" },
      {
        type: "paragraph",
        text: "Programmable thermostats and smart controllers allow you to pre-cool spaces before occupancy and raise setpoints during unoccupied hours. For commercial spaces, integrating with a Building Management System (BMS) can automate this entirely. We've seen office complexes cut HVAC energy spend by 28% simply by enabling proper scheduling on their existing VRF systems.",
      },
      { type: "heading", text: "4. Seal your building envelope" },
      {
        type: "paragraph",
        text: "Even the most efficient AC system will overwork if conditioned air is leaking out. Check door seals, window gaps, and false ceiling penetrations. For large commercial spaces, an IR thermal camera survey can reveal heat ingress points that are invisible to the naked eye. Fixing these typically costs a fraction of what you'd spend on a new system.",
      },
      {
        type: "list",
        items: [
          "Seal gaps around electrical conduits passing through walls",
          "Install door closers on frequently used entrances",
          "Use reflective window films to reduce solar heat gain by up to 40%",
          "Insulate roof slabs — this alone can reduce cooling load by 15%",
        ],
      },
      { type: "heading", text: "5. Don't neglect the outdoor unit" },
      {
        type: "paragraph",
        text: "The condenser unit rejects heat to the outside air. If it's sitting in direct afternoon sun, surrounded by walls with no airflow, it has to work significantly harder. Where possible, shade the outdoor unit (without blocking airflow) and ensure there's at least 60cm of clearance on all sides. A shaded condenser can improve efficiency by 5–10% on its own.",
      },
      {
        type: "paragraph",
        text: "None of these changes require major capital expenditure. Most can be implemented in a single day with a qualified HVAC technician. If you'd like a formal energy audit for your facility, our team offers detailed assessments with a written report and ROI projections.",
      },
    ],
  },
  {
    slug: "vrf-vs-ducted",
    tag: "Technology",
    date: "Feb 28, 2026",
    title: "VRF vs. Ducted: Which System is Right for Your Building?",
    excerpt:
      "A no-nonsense breakdown of Variable Refrigerant Flow and central ducted systems — costs, use cases, and when each makes sense.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    readTime: "6 min read",
    author: { name: "Ankit Shah", role: "Projects Director" },
    content: [
      {
        type: "paragraph",
        text: "This is the question we get asked most often during project consultations. Both VRF and ducted systems are excellent — but they excel in very different scenarios. Getting this decision wrong early in a project leads to either overspending on infrastructure or living with operational headaches for years.",
      },
      { type: "heading", text: "Understanding VRF (Variable Refrigerant Flow)" },
      {
        type: "paragraph",
        text: "VRF systems use refrigerant — not chilled water or conditioned air — as the primary heat-transfer medium. A single outdoor unit connects to multiple indoor units via refrigerant piping, with each indoor unit operating independently. This means you can heat one zone while cooling another (heat-recovery VRF), and each room or area can be controlled individually.",
      },
      {
        type: "list",
        items: [
          "Ideal for buildings with varied occupancy patterns (IT parks, hospitals, hotels)",
          "No duct losses — refrigerant pipes are far more efficient than air ducts",
          "Modular: easy to expand or reconfigure as space needs change",
          "Higher upfront equipment cost but lower operational cost",
          "Requires skilled commissioning — poor setup negates efficiency gains",
        ],
      },
      { type: "heading", text: "Understanding Ducted / Central AHU Systems" },
      {
        type: "paragraph",
        text: "Central systems use an Air Handling Unit (AHU) that conditions air and distributes it through a network of GI ducts to all areas. A single chiller or DX unit drives the AHU. All zones get conditioned from one central point, with zone control achieved via VAV boxes or motorised dampers.",
      },
      {
        type: "list",
        items: [
          "Best for large open-plan spaces: warehouses, malls, auditoriums",
          "Easier to integrate HEPA filtration and fresh air ventilation",
          "Lower equipment cost, higher civil and installation cost",
          "Requires significant ceiling space for ductwork",
          "Easier and cheaper to maintain once commissioned",
        ],
      },
      {
        type: "tip",
        label: "Rule of Thumb",
        text: "If your space has more than 8 distinct zones with independent hours of operation, VRF will almost always deliver better lifecycle economics. If your space is large and open with uniform usage patterns, go ducted.",
      },
      { type: "heading", text: "The Hybrid Approach" },
      {
        type: "paragraph",
        text: "Many modern commercial projects use both. A hospital might use VRF for patient rooms and administrative areas (varied occupancy, individual control) while using a central AHU for OTs and ICUs (precise humidity and filtration requirements). A retail complex might use central chillers for the main floor and VRF for anchor tenant units.",
      },
      { type: "heading", text: "Cost Comparison (Indicative)" },
      {
        type: "paragraph",
        text: "For a 10,000 sq ft commercial space in Surat: a VRF system typically runs ₹18–24 lakhs installed, while a central ducted system comes in at ₹14–20 lakhs — but with ₹4–8 lakhs in additional civil work for duct shafts. Operational costs over 5 years tend to favour VRF by 15–20% for multi-zone spaces.",
      },
      {
        type: "paragraph",
        text: "If you're in the design stage of a project, the best time to consult is before the false ceiling and MEP layout is finalized — the choice of system has significant implications for ceiling heights, structural openings, and electrical load calculations.",
      },
    ],
  },
  {
    slug: "hvac-warning-signs",
    tag: "Maintenance",
    date: "Feb 10, 2026",
    title: "Signs Your HVAC System Needs Servicing Before It Breaks Down",
    excerpt:
      "Unusual sounds, uneven cooling, higher bills — early warning signs most building managers miss until it's too late.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    readTime: "5 min read",
    author: { name: "Rajesh Patel", role: "Lead HVAC Engineer" },
    content: [
      {
        type: "paragraph",
        text: "Most HVAC failures are not sudden. They're the result of weeks or months of warning signs that went unnoticed — or were noticed and ignored. In a commercial setting, an unexpected system failure doesn't just mean discomfort; it means lost productivity, potential equipment damage, and an emergency service call that costs three times what a scheduled visit would have.",
      },
      { type: "heading", text: "1. Unusual noises" },
      {
        type: "paragraph",
        text: "A healthy HVAC system runs quietly. Any new sound — rattling, grinding, squealing, or banging — is worth investigating immediately. Rattling often indicates loose components or debris in the air handler. Grinding usually means bearing wear in the fan motor. Squealing can indicate a slipping belt in an older AHU. Left unaddressed, each of these leads to a complete component failure.",
      },
      { type: "heading", text: "2. Uneven cooling across zones" },
      {
        type: "paragraph",
        text: "If some areas are too cold while others can't reach setpoint, the cause is almost always one of three things: blocked/dirty air filters restricting airflow, refrigerant leak causing reduced capacity, or a failed zone damper or VRF expansion valve. All three are straightforward fixes when caught early.",
      },
      {
        type: "tip",
        label: "Quick Check",
        text: "Walk your space at 11am on a hot day. Any area that feels significantly warmer than others despite the AC running is worth flagging to your service team.",
      },
      { type: "heading", text: "3. Electricity bill creeping up" },
      {
        type: "paragraph",
        text: "If your power consumption is rising but usage patterns haven't changed, your HVAC system is likely working harder than it should — usually because of dirty coils, low refrigerant, or a failing compressor drawing excess current. A 10–15% rise in the electricity bill with no obvious cause is a reliable indicator that a service visit is overdue.",
      },
      { type: "heading", text: "4. Water leaks or moisture around indoor units" },
      {
        type: "paragraph",
        text: "Condensate drain lines can clog with algae and debris, especially during monsoon season. When a drain blocks, water backs up and drips from the indoor unit. Beyond the water damage risk, a damp evaporator environment promotes mold growth inside the unit — which then gets distributed through the airstream into your occupied space.",
      },
      { type: "heading", text: "5. Frequent short cycling" },
      {
        type: "paragraph",
        text: "If your system is turning on and off rapidly (every few minutes), it's short cycling. This is hard on the compressor — the most expensive component in any system — and usually indicates an oversized system, refrigerant overcharge, or a failing thermostat. Compressors are rated for a minimum number of starts per hour; exceeding this dramatically shortens their lifespan.",
      },
      {
        type: "list",
        items: [
          "Log unusual events with date and time — patterns help diagnose root causes",
          "Check air filters monthly; replace or clean every 4–8 weeks in commercial spaces",
          "Ensure condensate drain pipes are checked at every service visit",
          "Ask your service provider for a written health report after each visit",
        ],
      },
      {
        type: "paragraph",
        text: "Preventive maintenance contracts (AMC) exist precisely to catch these issues before they become failures. Our AMC plans include bi-annual comprehensive servicing plus unlimited emergency response — reach out if you'd like to know what's right for your facility.",
      },
    ],
  },
  {
    slug: "bms-integration-hvac",
    tag: "Industry",
    date: "Jan 22, 2026",
    title: "Why BMS Integration is the Future of Commercial HVAC",
    excerpt:
      "Building Management Systems are transforming how large facilities manage climate control — here's what you need to know before your next project.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    readTime: "7 min read",
    author: { name: "Ankit Shah", role: "Projects Director" },
    content: [
      {
        type: "paragraph",
        text: "Walk into any modern corporate campus, hospital, or large hotel today, and there's a room — usually tucked near the security office — with a wall of screens showing floor plans lit up with real-time data: temperatures, occupancy, equipment status. That's the Building Management System (BMS), and it's changing how HVAC is designed, operated, and maintained.",
      },
      { type: "heading", text: "What is a BMS?" },
      {
        type: "paragraph",
        text: "A Building Management System is a software-based control system that integrates all of a building's mechanical and electrical systems — HVAC, lighting, fire safety, access control, lifts — into a single interface. For HVAC, this means real-time monitoring of every sensor, actuator, and piece of equipment, with automated control sequences that optimize comfort and efficiency simultaneously.",
      },
      { type: "heading", text: "The efficiency case" },
      {
        type: "paragraph",
        text: "The numbers are compelling. Studies across Indian commercial real estate consistently show 20–35% reduction in HVAC energy consumption when BMS is properly implemented and tuned. The key mechanisms are: demand-based ventilation (only ventilate what's occupied), optimized start/stop sequences that account for thermal mass, and fault detection algorithms that catch equipment degradation before it becomes energy waste.",
      },
      {
        type: "tip",
        label: "Real Example",
        text: "A 200,000 sq ft IT park we commissioned in Surat reduced its annual HVAC electricity spend from ₹1.2 crore to ₹78 lakh in the first year after BMS integration — a 35% reduction with the same equipment.",
      },
      { type: "heading", text: "What BMS integration actually involves" },
      {
        type: "paragraph",
        text: "Good BMS integration starts in the design phase. HVAC equipment needs to be specified as BACnet or Modbus compatible (the communication protocols that allow equipment to talk to the BMS). Sensors — temperature, CO2, occupancy, humidity — need to be planned into the layout. The BMS itself needs to be programmed with control sequences that reflect how the building will actually be used.",
      },
      {
        type: "list",
        items: [
          "Protocol compatibility: specify BACnet/IP or Modbus RTU at procurement stage",
          "Sensor density: plan for temperature and CO2 sensors in every occupied zone",
          "Control sequences: work with the HVAC engineer to define setpoints and schedules",
          "Dashboards: define what operators need to see — don't default to vendor templates",
          "Alarm management: configure meaningful alarms, not just equipment faults",
        ],
      },
      { type: "heading", text: "Retrofitting existing buildings" },
      {
        type: "paragraph",
        text: "You don't need to replace your HVAC equipment to get BMS benefits. Many modern BMS platforms can integrate with existing equipment through gateway devices that translate proprietary protocols. The cost of retrofitting BMS to an existing 50,000 sq ft commercial building typically runs ₹15–25 lakhs — with payback periods of 2–4 years based on energy savings alone.",
      },
      { type: "heading", text: "Choosing the right BMS platform" },
      {
        type: "paragraph",
        text: "The major platforms — Honeywell EBI, Siemens Desigo CC, Schneider EcoStruxure, Johnson Controls Metasys — are all mature, enterprise-grade systems. For smaller facilities, cloud-based solutions like Distech Controls or even purpose-built IoT platforms can deliver 80% of the benefit at 40% of the cost. The right choice depends on the scale of your facility, your IT infrastructure, and the technical capability of your facilities team.",
      },
      {
        type: "paragraph",
        text: "If you're planning a new commercial project or evaluating a BMS retrofit, we'd be happy to walk through what makes sense for your specific situation. This is a decision that's much easier to get right upfront than to correct later.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}
