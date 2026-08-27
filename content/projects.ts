export const categories = ["design", "reels", "product", "data"] as const;

export type Category = (typeof categories)[number];

export type Accent = "cyan" | "lime" | "aqua" | "meadow";

export type CoverShape = "portrait" | "landscape" | "square" | "tall";

export type ContributionIconName =
  | "pen-tool"
  | "palette"
  | "type"
  | "compass"
  | "clapperboard"
  | "scissors"
  | "megaphone"
  | "newspaper"
  | "app-window"
  | "code-2"
  | "brain"
  | "layout-dashboard"
  | "search"
  | "search-check"
  | "rocket";

export type ContributionId =
  | "ux"
  | "visual"
  | "copy"
  | "strategy"
  | "video"
  | "edit"
  | "ads"
  | "print"
  | "product"
  | "code"
  | "ml"
  | "dashboard"
  | "research"
  | "seo"
  | "gtm";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  body: string[];
  year: string;
  org: string;
  categories: Category[];
  contributions: ContributionId[];
  links?: { label: string; href: string }[];
  coverShape: CoverShape;
  accent: Accent;
  featured?: boolean;
};

export const categoryMeta: Record<
  Category,
  { label: string; blurb: string }
> = {
  design: {
    label: "Design",
    blurb: "UX, brand systems, print, and the surfaces people actually touch.",
  },
  reels: {
    label: "Reels",
    blurb: "Promo films, OVC craft, and cuts that have to land in six seconds.",
  },
  product: {
    label: "Product",
    blurb: "MVPs, websites, and tools that had to work on a deadline.",
  },
  data: {
    label: "Data",
    blurb: "Dashboards, models, and the receipts behind the campaign.",
  },
};

export const contributionMeta: Record<
  ContributionId,
  { label: string; icon: ContributionIconName }
> = {
  ux: { label: "UX", icon: "pen-tool" },
  visual: { label: "Visual", icon: "palette" },
  copy: { label: "Copy", icon: "type" },
  strategy: { label: "Strategy", icon: "compass" },
  video: { label: "Video", icon: "clapperboard" },
  edit: { label: "Edit", icon: "scissors" },
  ads: { label: "Ad spend", icon: "megaphone" },
  print: { label: "Print", icon: "newspaper" },
  product: { label: "Product", icon: "app-window" },
  code: { label: "Build", icon: "code-2" },
  ml: { label: "ML", icon: "brain" },
  dashboard: { label: "Dashboard", icon: "layout-dashboard" },
  research: { label: "Research", icon: "search" },
  seo: { label: "SEO", icon: "search-check" },
  gtm: { label: "GTM", icon: "rocket" },
};

export const projects: Project[] = [
  {
    slug: "bida-matchmaking",
    title: "BIDA Investment Matchmaking",
    tagline: "The country's first investor–entrepreneur matchmaking desk, built end to end.",
    summary:
      "UX and MVP for BIDA's matchmaking portal, plus promo films, national print, ad spend, and the dashboard that proved the launch actually filled.",
    body: [
      "Bangladesh launched its first investment matchmaking platform so local founders and foreign capital could find each other without a hallway introduction. I worked the stack, not a slice: interface, film, media, and measurement.",
      "On the product side that meant designing the entrepreneur and project profiles, the All Projects browse, and a follow-up lane so conversations did not vanish into inboxes. On the go-to-market side it meant planning and editing promo videos, placing print in national dailies, and running paid.",
      "The first two weeks pulled in more than a hundred projects. The dashboard was not a vanity layer — it was how we knew the launch was a market, not a ceremony.",
    ],
    year: "2025",
    org: "Bangladesh Investment Development Authority",
    categories: ["design", "product", "reels", "data"],
    contributions: ["ux", "product", "video", "edit", "ads", "print", "dashboard"],
    featured: true,
    coverShape: "landscape",
    accent: "cyan",
    links: [
      {
        label: "How to join",
        href: "https://www.tbsnews.net/explainer/how-join-bangladeshs-new-investment-matchmaking-platform-1301646",
      },
    ],
  },
  {
    slug: "lekh-ai",
    title: "Lekh.AI",
    tagline: "A Bangla ad-script generator that pitches like a creative, not a chatbot.",
    summary:
      "Machine-learning coursework aimed at a real creative brief: generate Bangla advertising scripts, then sell the idea like a studio would.",
    body: [
      "The brief was not 'train a model.' It was: can this thing write a Bangla ad that a creative director would not immediately bin?",
      "Lekh.AI sits at the uncomfortable joint of language models and advertising craft. The generator had to respect idiom, product truth, and the shape of a script — hook, body, sting — instead of dumping paragraphs.",
      "I treated the pitch as part of the product. A model nobody can brief is a demo. A model a marketer can steal from is a tool.",
    ],
    year: "2025",
    org: "IBA, University of Dhaka",
    categories: ["product", "design"],
    contributions: ["ml", "product", "copy", "strategy"],
    coverShape: "portrait",
    accent: "aqua",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Shudipta-Dip/Lekh.AI---Bangla-Ad-Script-Generator",
      },
    ],
  },
  {
    slug: "dhaka-billboards",
    title: "Dhaka Billboard Placement",
    tagline: "An OSINT engine for out-of-home in a city that does not sit still.",
    summary:
      "Open-source intelligence for strategic OOH placement in Dhaka — where the board sits matters more than how glossy the artwork is.",
    body: [
      "Dhaka's outdoor inventory is noisy, political, and unevenly documented. Buying a board by instinct is how budgets go to die on a flyover nobody walks under.",
      "This engine treats placement as a research problem: where attention actually pools, which corridors are oversold, and how a brand should pick sites if it wants reach instead of folklore.",
      "The output is not a pretty heat map for a slide. It is a placement argument a media lead can take into a buy.",
    ],
    year: "2025",
    org: "Independent",
    categories: ["data", "design"],
    contributions: ["research", "dashboard", "strategy", "code"],
    coverShape: "tall",
    accent: "lime",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Shudipta-Dip/dhaka-billboard-placement-optimization",
      },
    ],
  },
  {
    slug: "cluster-mapping",
    title: "Bangladesh Cluster Mapping",
    tagline: "Industrial clusters drawn as a map investors can actually use.",
    summary:
      "Sectoral specialization mapped across Bangladesh — a BIDA collaboration with ADB that turns 'the country has industry' into 'here is the cluster.'",
    body: [
      "Investors do not buy a country. They buy a cluster: leather in one belt, light engineering in another, agro-processing somewhere the roads actually work.",
      "The mapping work was about making specialization visible — not as a PDF annex, but as a spatial argument. Where does the density live, and what does that mean for a site visit?",
      "I care about this kind of data because branding a destination without a map is just tourism copy.",
    ],
    year: "2025",
    org: "BIDA × ADB",
    categories: ["data", "design"],
    contributions: ["research", "visual", "dashboard", "strategy"],
    coverShape: "square",
    accent: "meadow",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Shudipta-Dip/bd-cluster-mapping",
      },
    ],
  },
  {
    slug: "love-doughs",
    title: "Love Doughs",
    tagline: "A cookie-dough brand site that had to rank, not just look edible.",
    summary:
      "Product site and SEO pass for a dessert brand — craft on the surface, search intent underneath.",
    body: [
      "Dessert brands die in the gap between a beautiful hero image and a search query nobody mapped. Love Doughs needed both: a site that felt like the product, and pages that could actually be found.",
      "The work mixed front-end craft with an SEO audit — titles, intent, and the unglamorous architecture that keeps a small brand from being invisible.",
      "Pretty is table stakes. Discoverable is the job.",
    ],
    year: "2025",
    org: "Love Doughs",
    categories: ["product", "design"],
    contributions: ["product", "code", "seo", "visual"],
    coverShape: "portrait",
    accent: "cyan",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Shudipta-Dip/Love-Doughs-Website",
      },
    ],
  },
  {
    slug: "ovc-ad-film",
    title: "OVC & Ad Film",
    tagline: "Podium in the country's biggest ad-making competition — and notes for the next brief.",
    summary:
      "On-screen video craft from case competitions and agency floors: the round people dread, and the one I keep volunteering for.",
    body: [
      "OVC rounds are where marketing case competitions stop being a deck and start being a film. My team podiumed in the country's biggest ad-making competition. I liked that round. I still do.",
      "At LIE TO EYE the same muscle applied: contagious creativity with a brief, a cut, and a client who would know if the joke landed.",
      "A reel is a strategy document that happens to have a soundtrack. If the idea cannot survive six seconds, it was never an idea.",
    ],
    year: "2024–2025",
    org: "LIE TO EYE · competitions",
    categories: ["reels", "design"],
    contributions: ["strategy", "video", "edit", "copy"],
    featured: true,
    coverShape: "tall",
    accent: "aqua",
  },
  {
    slug: "lie-to-eye",
    title: "LIE TO EYE",
    tagline: "Strategy inside an independent shop for branding, ads, and film.",
    summary:
      "Eleven months as a strategy associate — briefs, narratives, and the unromantic work of making a campaign hold together.",
    body: [
      "LIE TO EYE is an independent creative shop spanning branding, advertising, and film. I sat on the strategy side: turning a client's anxiety into a brief a creative team could actually shoot.",
      "The useful skill was not 'having ideas.' It was sequencing them — what the film says, what the stills say, what the media buy is even for.",
      "I left with a stubborn bias: if the strategy cannot be cut into a frame, it is still a memo.",
    ],
    year: "2024–2025",
    org: "LIE TO EYE",
    categories: ["design", "reels"],
    contributions: ["strategy", "copy", "video", "visual"],
    coverShape: "portrait",
    accent: "lime",
  },
  {
    slug: "moncho-gtm",
    title: "Moncho AI · GTM",
    tagline: "Data ops and go-to-market for an AI product that has to earn its next meeting.",
    summary:
      "Market research, scoring, and GTM systems — the unglamorous spine that keeps a young AI company from pitching on vibes.",
    body: [
      "At Moncho AI I work Data Ops and GTM: landscapes, org scoring, and the operating rhythm that turns a messy market into a sequence of conversations.",
      "The job is translation. Engineers need a market that is structured. Sales needs a market that is human. I write the layer in between so neither side has to guess.",
      "I like this work because it is marketing with a spine. If the ICP is wrong, no reel will save you.",
    ],
    year: "2026",
    org: "Moncho AI",
    categories: ["data", "product"],
    contributions: ["gtm", "research", "dashboard", "strategy"],
    coverShape: "landscape",
    accent: "meadow",
  },
  {
    slug: "biman-analysis",
    title: "Biman Bangladesh Analysis",
    tagline: "A national carrier read as a dataset, not a press release.",
    summary:
      "Airline analysis work that treats routes, service, and public narrative as something you can actually inspect.",
    body: [
      "National carriers accumulate mythology. The useful move is to put the operation next to the story and see where they diverge.",
      "This analysis pack looks at Biman as a system: what the numbers say, what the public conversation says, and where a marketer or operator should not bluff.",
      "I keep this in the portfolio because it is the same muscle I use on brands — separate the campaign from the facts, then decide.",
    ],
    year: "2025",
    org: "Independent",
    categories: ["data"],
    contributions: ["research", "dashboard", "strategy"],
    coverShape: "landscape",
    accent: "cyan",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Shudipta-Dip/biman-bangladesh-analysis",
      },
    ],
  },
  {
    slug: "bank-social-listening",
    title: "Bank Social Listening",
    tagline: "What people actually say about banks when the campaign is not in the room.",
    summary:
      "Social listening on Bangladeshi banking brands — public conversation as a competitive dataset, not a sentiment smiley.",
    body: [
      "Banks spend like they are loved. Comment sections are less polite. This project listens to that gap.",
      "The work is a pipeline plus a lean dashboard: collect, clean, compare. The point is not a word cloud. The point is which brand owns which anxiety.",
      "I built it as a reminder that performance marketing without listening is just louder guessing.",
    ],
    year: "2025",
    org: "Independent",
    categories: ["data"],
    contributions: ["research", "code", "dashboard"],
    coverShape: "square",
    accent: "aqua",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Shudipta-Dip/bibm-bank-social-listening",
      },
    ],
  },
  {
    slug: "investment-newsfeed",
    title: "BD Investment Newsfeed",
    tagline: "A live pulse for Bangladesh investment news, not a clipping service.",
    summary:
      "A TypeScript newsfeed that treats investment coverage as a product: timely, scannable, and built for people who have to brief someone at 9am.",
    body: [
      "Investment narratives move faster than quarterly PDFs. This feed is an attempt to put the day's signal in one place without the noise of a generic news app.",
      "I care about the product texture: what a briefing looks like when you only have four minutes, and which stories actually change a pipeline.",
      "If matchmaking is the handshake, the newsfeed is the room tone.",
    ],
    year: "2025",
    org: "Independent",
    categories: ["product", "data"],
    contributions: ["product", "code", "research"],
    coverShape: "square",
    accent: "lime",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Shudipta-Dip/bd-investment-newsfeed",
      },
    ],
  },
  {
    slug: "looker-storytelling",
    title: "Looker Studio Storytelling",
    tagline: "One KPI card, a small mountain of data prep, and a story that survives a client.",
    summary:
      "Advanced visualization coursework on a live education-product dataset — including how much janitorial work sits behind a 'simple' metric.",
    body: [
      "The course was Advanced Visualization and Data Storytelling. The lesson was unglamorous: a KPI card is a political object. Someone chose the numerator.",
      "Working a Shikho-adjacent dataset, I learned how much preparation hides behind a single number, and how Looker Studio can sit in a Google workflow instead of a one-off export.",
      "I still start dashboards by arguing with the metric. If we cannot defend the card, we should not put it on a slide.",
    ],
    year: "2025",
    org: "IBA, University of Dhaka",
    categories: ["data"],
    contributions: ["dashboard", "research", "visual"],
    coverShape: "square",
    accent: "meadow",
  },
  {
    slug: "lead-generator-mvp",
    title: "Prompt-to-Lead MVP",
    tagline: "A hackathon product: click, prompt, and a lead drops out the other side.",
    summary:
      "A one-day PM hackathon spanning PRD, Miro, front end, Cursor, Postman, and Supabase — an AI lead generator aimed at real BIDA legwork.",
    body: [
      "The brief was the whole stack in a day: PRD, user flow, interface, backend, live database. I built an AI-powered, prompt-and-click lead generator.",
      "The fantasy use case was close to home — automating some of the hunting an investment desk still does by hand. Vibecoding is only interesting if the MVP could embarrass a spreadsheet.",
      "I kept the scar tissue: product management is not slides. It is a thing a stranger can click.",
    ],
    year: "2025",
    org: "Product management hackathon",
    categories: ["product"],
    contributions: ["product", "ux", "code", "gtm"],
    coverShape: "portrait",
    accent: "cyan",
  },
  {
    slug: "avatar-box-office",
    title: "Avatar 3 Box Office",
    tagline: "A film opening treated as a forecasting problem, not a fan argument.",
    summary:
      "K401 coursework: box-office performance as a dataset — because even a spectacle has a demand curve.",
    body: [
      "Everybody has an opinion about a Cameron opening. Fewer people will sit with the time series.",
      "This notebook was a course deliverable, but the habit stuck: entertainment marketing is still marketing. Windows, territories, and the week-two cliff are the plot.",
      "I keep it here as a small proof that I will quantify a hype cycle if you let me.",
    ],
    year: "2024",
    org: "IBA, University of Dhaka",
    categories: ["data"],
    contributions: ["research", "dashboard"],
    coverShape: "landscape",
    accent: "aqua",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Shudipta-Dip/Avatar-3-Box-Office-Performance",
      },
    ],
  },
];
