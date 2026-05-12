import type {
  TopicId,
  RuleCard,
  MultipleChoiceExercise,
  FillBlankExercise,
  TransformationExercise,
  ExerciseData,
} from "@/lib/grammarTypes";

// ── Rule cards (level 0 / spec level 1) ──────────────────────────────────────

export const RULE_CARDS: Record<TopicId, RuleCard> = {
  "present-perfect": {
    type: "rule",
    title: "Present Perfect vs Past Simple",
    formula:
      "Present Perfect: Subject + have/has + Past Participle\nPast Simple:      Subject + Verb (past form / -ed)",
    markers: [
      "already, just, yet, ever, never, recently, since, for, so far → Present Perfect",
      "yesterday, ago, last week/month/year, in [year], at [specific time] → Past Simple",
    ],
    examples: [
      {
        sentence: "The DevOps team has just deployed the hotfix — the site is back online.",
        note: "Present Perfect ('has deployed') — very recent action with an immediate result right now.",
      },
      {
        sentence: "We deployed version 2.0 last Tuesday at 3 PM.",
        note: "Past Simple ('deployed') — 'last Tuesday at 3 PM' pins the action to a specific past moment.",
      },
      {
        sentence: "I have never worked with a team so well-organized.",
        note: "Present Perfect ('have never worked') — life experience up to the present, no specific time.",
      },
    ],
    summary:
      "Use Present Perfect when the past action is still relevant now (recent result, experience, or ongoing state). Use Past Simple for completed actions at a specific past time.",
  },

  conditionals: {
    type: "rule",
    title: "Conditionals",
    formula:
      "Zero:  If + present simple, present simple  (facts/automatic results)\nFirst:  If + present simple, will + base verb  (real future)\nSecond: If + past simple, would + base verb    (hypothetical)\nThird:  If + past perfect, would have + V3     (past hypothetical)",
    markers: [
      "if, unless, provided that, as long as, in case — introduce the condition",
      "will (1st) / would (2nd) / would have (3rd) — signal the result clause",
    ],
    examples: [
      {
        sentence: "If the build fails, the pipeline stops automatically.",
        note: "Zero conditional — a factual, automatic system rule.",
      },
      {
        sentence: "If we add a caching layer, the API will respond in under 100 ms.",
        note: "First conditional — a real, planned improvement with a predictable result.",
      },
      {
        sentence: "If we had containerized the app earlier, scaling would have been much easier.",
        note: "Third conditional — past regret; we didn't containerize, so scaling was harder.",
      },
    ],
    summary:
      "Match the conditional type to how real the situation is: Zero for facts, First for real plans, Second for hypotheticals, Third for past regrets.",
  },

  "passive-voice": {
    type: "rule",
    title: "Passive Voice",
    formula:
      "Subject (receiver) + be (am/is/are/was/were/has been/will be) + Past Participle [+ by + agent]",
    markers: [
      "is/are + V3  (present passive — ongoing rule or state)",
      "was/were + V3  (past passive — completed action)",
      "has/have been + V3  (present perfect passive)",
      "will be + V3  (future passive)",
      "is/are being + V3  (present continuous passive — in progress)",
    ],
    examples: [
      {
        sentence: "All API requests are secured with TLS encryption by default.",
        note: "Present passive — focus on the API's state, not who configured the encryption.",
      },
      {
        sentence: "The production database was accidentally dropped during the migration.",
        note: "Past passive — agent omitted deliberately; more tactful in incident reports.",
      },
      {
        sentence: "A post-mortem must be submitted within 48 hours of any production incident.",
        note: "Modal passive ('must be + V3') — obligation without naming who must submit it.",
      },
    ],
    summary:
      "Use passive voice when the action or result matters more than who did it, when the agent is unknown, or in formal technical writing and incident reports.",
  },

  "modal-verbs": {
    type: "rule",
    title: "Modal Verbs",
    formula:
      "Subject + modal (can/could/may/might/must/should/would) + base verb\nNegative: Subject + modal + not + base verb",
    markers: [
      "can / could — ability, permission, possibility (could = past or polite)",
      "may / might — possibility (may = more likely; might = less certain)",
      "must / have to — necessity, strong obligation or logical deduction",
      "should — advice, recommendation, expectation",
      "would — conditional, polite requests, past habitual action",
    ],
    examples: [
      {
        sentence: "You must not share API credentials in Slack — use the secrets manager.",
        note: "'Must not' is a strict prohibition; the secrets manager is mandatory.",
      },
      {
        sentence: "The performance issues might be caused by an N+1 query problem.",
        note: "'Might be' expresses uncertainty while investigating a root cause.",
      },
      {
        sentence: "Could you review my pull request before the end of the day?",
        note: "'Could you...' is a polite request — more formal than 'Can you...'.",
      },
    ],
    summary:
      "Choose the modal based on certainty and intent: must for obligation, should for advice, can/could for ability or permission, may/might for possibility, would for conditionals and polite requests.",
  },
};

// ── Exercise item types ───────────────────────────────────────────────────────
// level field uses spec numbering: 2 = multiple-choice, 3 = fill-blank, 4 = transformation

interface MCItem {
  id: string;
  topic: TopicId;
  level: 2;
  type: "multiple-choice";
  sentence: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
}

interface FBItem {
  id: string;
  topic: TopicId;
  level: 3;
  type: "fill-blank";
  sentence: string;
  answer: string;
  hint: string;
  explanation: string;
}

interface TRItem {
  id: string;
  topic: TopicId;
  level: 4;
  type: "transformation";
  original: string;
  instruction: string;
  answer: string;
  explanation: string;
}

type GrammarItem = MCItem | FBItem | TRItem;

// ── PRESENT PERFECT vs PAST SIMPLE ───────────────────────────────────────────

const PP_MC: MCItem[] = [
  {
    id: "pp-mc-01", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "We ___ the deployment scripts last Friday.",
    options: ["have updated", "updated", "update", "had updated"],
    correct: 1,
    explanation: "'Last Friday' specifies a completed past time → Past Simple.",
  },
  {
    id: "pp-mc-02", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "The QA team ___ three critical bugs so far this sprint.",
    options: ["found", "has found", "finds", "had found"],
    correct: 1,
    explanation: "'So far this sprint' is an unfinished period → Present Perfect.",
  },
  {
    id: "pp-mc-03", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "Our cloud provider ___ two major outages since January.",
    options: ["had", "has had", "have had", "was having"],
    correct: 1,
    explanation: "'Since January' connects past to present → Present Perfect.",
  },
  {
    id: "pp-mc-04", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "I ___ just submitted the pull request — you can review it now.",
    options: ["had", "have", "did", "was going to"],
    correct: 1,
    explanation: "'Just' with an immediate present result → Present Perfect.",
  },
  {
    id: "pp-mc-05", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "When ___ the client send the final requirements?",
    options: ["has", "did", "have", "does"],
    correct: 1,
    explanation: "'When' asks about a specific past moment → Past Simple.",
  },
  {
    id: "pp-mc-06", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "The startup ___ three rounds of funding since its founding.",
    options: ["raised", "has raised", "raises", "had raised"],
    correct: 1,
    explanation: "'Since its founding' = ongoing relevance to now → Present Perfect.",
  },
  {
    id: "pp-mc-07", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "We ___ the server migration at midnight last night.",
    options: ["have completed", "completed", "complete", "had completed"],
    correct: 1,
    explanation: "'Last night at midnight' is a specific past time → Past Simple.",
  },
  {
    id: "pp-mc-08", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "She ___ in the tech industry for over ten years.",
    options: ["works", "worked", "has worked", "had worked"],
    correct: 2,
    explanation: "'For over ten years' with a still-ongoing state → Present Perfect.",
  },
  {
    id: "pp-mc-09", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "The engineering team ___ the architecture review in the Q2 planning session.",
    options: ["has conducted", "conducted", "conducts", "had conducted"],
    correct: 1,
    explanation: "'In the Q2 planning session' is a finished event → Past Simple.",
  },
  {
    id: "pp-mc-10", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "This is the most complex refactor we ___ ever attempted.",
    options: ["did", "have", "had", "do"],
    correct: 1,
    explanation: "Superlative + 'ever' → Present Perfect ('have ever attempted').",
  },
  {
    id: "pp-mc-11", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "___ you submitted the incident report yet?",
    options: ["Did", "Have", "Do", "Had"],
    correct: 1,
    explanation: "'Yet' in a question → Present Perfect.",
  },
  {
    id: "pp-mc-12", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "The platform ___ over a million API calls since the beta launched.",
    options: ["processed", "has processed", "processes", "had processed"],
    correct: 1,
    explanation: "'Since the beta launched' → Present Perfect.",
  },
  {
    id: "pp-mc-13", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "We ___ the vendor at the expo last October and signed a contract.",
    options: ["have met", "met", "meet", "had met"],
    correct: 1,
    explanation: "'Last October' is a specific past time → Past Simple.",
  },
  {
    id: "pp-mc-14", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "The platform ___ unstable since we deployed the new release.",
    options: ["was", "has been", "is being", "had been"],
    correct: 1,
    explanation: "'Since we deployed' → ongoing state from past to now → Present Perfect.",
  },
  {
    id: "pp-mc-15", topic: "present-perfect", level: 2, type: "multiple-choice",
    sentence: "Our lead developer ___ the company in 2019 after working at Google.",
    options: ["has joined", "joined", "joins", "had joined"],
    correct: 1,
    explanation: "'In 2019' is a specific past year → Past Simple.",
  },
];

const PP_FB: FBItem[] = [
  {
    id: "pp-fb-01", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "We ___ the feature to production yet — it's still in testing.",
    answer: "haven't released",
    hint: "use: release (Present Perfect negative)",
    explanation: "'Yet' in a negative sentence signals Present Perfect.",
  },
  {
    id: "pp-fb-02", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "The architect ___ the new system design at yesterday's all-hands meeting.",
    answer: "presented",
    hint: "use: present (Past Simple)",
    explanation: "'Yesterday's meeting' specifies a past event → Past Simple.",
  },
  {
    id: "pp-fb-03", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "I ___ never worked with a team so well-organized — this is impressive.",
    answer: "have",
    hint: "use: have (Present Perfect auxiliary)",
    explanation: "'Never' for experience up to the present moment → Present Perfect.",
  },
  {
    id: "pp-fb-04", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "The client ___ the final design mockups last Thursday.",
    answer: "approved",
    hint: "use: approve (Past Simple)",
    explanation: "'Last Thursday' specifies a past day → Past Simple.",
  },
  {
    id: "pp-fb-05", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "Our team ___ already integrated the payment gateway into the app.",
    answer: "has",
    hint: "use: has (Present Perfect auxiliary)",
    explanation: "'Already' signals Present Perfect — the action is complete and relevant now.",
  },
  {
    id: "pp-fb-06", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "The CTO ___ responded to my email since Monday.",
    answer: "hasn't",
    hint: "use: hasn't (Present Perfect negative auxiliary)",
    explanation: "'Since Monday' with ongoing absence → Present Perfect negative.",
  },
  {
    id: "pp-fb-07", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "This is the first time we ___ used Kubernetes in production.",
    answer: "have",
    hint: "use: have (Present Perfect auxiliary)",
    explanation: "'First time' construction always takes Present Perfect.",
  },
  {
    id: "pp-fb-08", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "The DevOps team ___ the CI/CD pipeline two hours ago.",
    answer: "fixed",
    hint: "use: fix (Past Simple)",
    explanation: "'Two hours ago' is a specific past time → Past Simple.",
  },
  {
    id: "pp-fb-09", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "She ___ the company in 2020 and has been promoted twice since.",
    answer: "joined",
    hint: "use: join (Past Simple)",
    explanation: "'In 2020' specifies a past year → Past Simple.",
  },
  {
    id: "pp-fb-10", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "The sales team ___ deals worth $2 million so far this quarter.",
    answer: "has closed",
    hint: "use: close (Present Perfect)",
    explanation: "'So far this quarter' = unfinished period → Present Perfect.",
  },
  {
    id: "pp-fb-11", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "The board ___ the expansion budget at last month's meeting.",
    answer: "approved",
    hint: "use: approve (Past Simple)",
    explanation: "'At last month's meeting' is a finished past event → Past Simple.",
  },
  {
    id: "pp-fb-12", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "We ___ to production five times since Monday — it's been a busy week.",
    answer: "have deployed",
    hint: "use: deploy (Present Perfect)",
    explanation: "'Since Monday' with continued relevance → Present Perfect.",
  },
  {
    id: "pp-fb-13", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "The engineering manager ___ my PR yet.",
    answer: "hasn't reviewed",
    hint: "use: review (Present Perfect negative)",
    explanation: "'Yet' in a negative sentence → Present Perfect.",
  },
  {
    id: "pp-fb-14", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "Our team ___ the internal hackathon last year and built a prototype.",
    answer: "won",
    hint: "use: win (Past Simple irregular)",
    explanation: "'Last year' is a specific past time → Past Simple.",
  },
  {
    id: "pp-fb-15", topic: "present-perfect", level: 3, type: "fill-blank",
    sentence: "I ___ just sent the meeting invitation to all stakeholders.",
    answer: "have",
    hint: "use: have (Present Perfect auxiliary)",
    explanation: "'Just' signals very recent completion with present relevance → Present Perfect.",
  },
];

const PP_TR: TRItem[] = [
  {
    id: "pp-tr-01", topic: "present-perfect", level: 4, type: "transformation",
    original: "The team released the hotfix two hours ago.",
    instruction: "Rewrite using 'just' to emphasise the action is very recent.",
    answer: "The team has just released the hotfix.",
    explanation: "'Has just + past participle' (Present Perfect) replaces a specific past time to show immediate relevance.",
  },
  {
    id: "pp-tr-02", topic: "present-perfect", level: 4, type: "transformation",
    original: "We have already reviewed all the candidates.",
    instruction: "Rewrite to say this happened last week.",
    answer: "We reviewed all the candidates last week.",
    explanation: "'Last week' (specific past time) requires Past Simple; 'have already' is dropped.",
  },
  {
    id: "pp-tr-03", topic: "present-perfect", level: 4, type: "transformation",
    original: "Did the client send the revised brief?",
    instruction: "Rewrite to ask about experience, using 'ever'.",
    answer: "Has the client ever sent a revised brief?",
    explanation: "'Ever' for life experience uses Present Perfect question form.",
  },
  {
    id: "pp-tr-04", topic: "present-perfect", level: 4, type: "transformation",
    original: "The developer joined our team in 2022.",
    instruction: "Rewrite to show she still works here. Use 'since'.",
    answer: "The developer has been on our team since 2022.",
    explanation: "'Since 2022' with an ongoing state → Present Perfect.",
  },
  {
    id: "pp-tr-05", topic: "present-perfect", level: 4, type: "transformation",
    original: "We have not deployed the update yet.",
    instruction: "Rewrite to say the update was not deployed last Friday.",
    answer: "We did not deploy the update last Friday.",
    explanation: "'Last Friday' (specific time) → Past Simple negative.",
  },
  {
    id: "pp-tr-06", topic: "present-perfect", level: 4, type: "transformation",
    original: "The project manager approved the scope change.",
    instruction: "Rewrite to show this was approved just now — no specific time.",
    answer: "The project manager has just approved the scope change.",
    explanation: "'Has just approved' expresses very recent action with current relevance.",
  },
  {
    id: "pp-tr-07", topic: "present-perfect", level: 4, type: "transformation",
    original: "We experienced three outages this month.",
    instruction: "Rewrite to say this happened last month.",
    answer: "We experienced three outages last month.",
    explanation: "'Last month' (finished period) keeps Past Simple; 'this month' would allow Present Perfect.",
  },
  {
    id: "pp-tr-08", topic: "present-perfect", level: 4, type: "transformation",
    original: "She worked at Google before joining our company.",
    instruction: "Ask about her experience. Start with 'Has she ever...'",
    answer: "Has she ever worked at Google?",
    explanation: "Experience questions without a specific time use Present Perfect.",
  },
  {
    id: "pp-tr-09", topic: "present-perfect", level: 4, type: "transformation",
    original: "The API has processed over a million requests.",
    instruction: "Rewrite to say this happened during the beta phase last year.",
    answer: "The API processed over a million requests during the beta phase last year.",
    explanation: "'Last year' + 'during the beta phase' = specific past period → Past Simple.",
  },
  {
    id: "pp-tr-10", topic: "present-perfect", level: 4, type: "transformation",
    original: "I sent the report to the stakeholders at 9 AM.",
    instruction: "Rewrite using 'already' to emphasise the report is done.",
    answer: "I have already sent the report to the stakeholders.",
    explanation: "'Already' with Present Perfect emphasises completion without a specific time.",
  },
  {
    id: "pp-tr-11", topic: "present-perfect", level: 4, type: "transformation",
    original: "Has the team finished the sprint retrospective?",
    instruction: "Rewrite to ask when it was finished.",
    answer: "When did the team finish the sprint retrospective?",
    explanation: "'When' asks for a specific past time → Past Simple question.",
  },
  {
    id: "pp-tr-12", topic: "present-perfect", level: 4, type: "transformation",
    original: "We launched the MVP last quarter.",
    instruction: "Rewrite using 'recently'.",
    answer: "We have recently launched the MVP.",
    explanation: "'Recently' signals a near-past action without a specific time → Present Perfect.",
  },
  {
    id: "pp-tr-13", topic: "present-perfect", level: 4, type: "transformation",
    original: "The system has not crashed since the last patch.",
    instruction: "Rewrite to say the system did not crash during last week's testing phase.",
    answer: "The system did not crash during last week's testing phase.",
    explanation: "'Last week' (specific period) → Past Simple negative.",
  },
  {
    id: "pp-tr-14", topic: "present-perfect", level: 4, type: "transformation",
    original: "I moved to the backend team three months ago.",
    instruction: "Rewrite to show you are still on the backend team. Use 'for'.",
    answer: "I have been on the backend team for three months.",
    explanation: "'For three months' with an ongoing state → Present Perfect.",
  },
  {
    id: "pp-tr-15", topic: "present-perfect", level: 4, type: "transformation",
    original: "The client has not approved the design yet.",
    instruction: "Ask if the client approved it yesterday.",
    answer: "Did the client approve the design yesterday?",
    explanation: "'Yesterday' → Past Simple question; 'has not / yet' are dropped.",
  },
];

// ── CONDITIONALS ──────────────────────────────────────────────────────────────

const COND_MC: MCItem[] = [
  {
    id: "co-mc-01", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If we ___ the server capacity now, we will avoid downtime during peak hours.",
    options: ["increase", "increased", "had increased", "would increase"],
    correct: 0,
    explanation: "First conditional: real future plan — 'If + present simple, will + base'.",
  },
  {
    id: "co-mc-02", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If the CI pipeline ___ more than 15 minutes, we would split the jobs.",
    options: ["takes", "took", "had taken", "would take"],
    correct: 1,
    explanation: "Second conditional: hypothetical — 'If + past simple, would + base'.",
  },
  {
    id: "co-mc-03", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If the client ___ approved the budget earlier, we would have launched on time.",
    options: ["has", "had", "would have", "will have"],
    correct: 1,
    explanation: "Third conditional: past hypothetical — 'If + past perfect, would have + V3'.",
  },
  {
    id: "co-mc-04", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If you restart the service, it ___ automatically reconnect to the database.",
    options: ["will", "would", "would have", "had"],
    correct: 0,
    explanation: "First conditional: predictable real outcome → 'will'.",
  },
  {
    id: "co-mc-05", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If I were the tech lead, I ___ prioritise refactoring over new features.",
    options: ["will", "would", "had", "have"],
    correct: 1,
    explanation: "Second conditional: hypothetical present ('If I were...') → 'would'.",
  },
  {
    id: "co-mc-06", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If memory usage ___ 90%, the auto-scaler triggers a new instance.",
    options: ["exceeds", "exceeded", "had exceeded", "would exceed"],
    correct: 0,
    explanation: "Zero conditional: automatic system rule — present simple in both clauses.",
  },
  {
    id: "co-mc-07", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If we had tested the integration thoroughly, we ___ the production incident.",
    options: ["avoid", "avoided", "would avoid", "would have avoided"],
    correct: 3,
    explanation: "Third conditional: past hypothetical consequence → 'would have + V3'.",
  },
  {
    id: "co-mc-08", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If the team ___ remote-first, we can hire globally.",
    options: ["goes", "went", "had gone", "would go"],
    correct: 0,
    explanation: "First conditional: real future condition → present simple in if-clause.",
  },
  {
    id: "co-mc-09", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "I could negotiate a better contract if I ___ the market rates.",
    options: ["know", "knew", "had known", "will know"],
    correct: 1,
    explanation: "Second conditional: hypothetical ('I don't know them') → past simple.",
  },
  {
    id: "co-mc-10", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If you ___ the API documentation, you would have found the endpoint.",
    options: ["check", "checked", "had checked", "have checked"],
    correct: 2,
    explanation: "Third conditional: past hypothetical action → 'had + past participle'.",
  },
  {
    id: "co-mc-11", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "Unless we ___ the scope, the project will exceed the deadline.",
    options: ["reduce", "reduced", "had reduced", "would reduce"],
    correct: 0,
    explanation: "'Unless' = 'if not'; first conditional real risk → present simple.",
  },
  {
    id: "co-mc-12", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If I ___ you, I would write more unit tests before the code review.",
    options: ["am", "were", "had been", "will be"],
    correct: 1,
    explanation: "'If I were you' is the standard second conditional for giving advice.",
  },
  {
    id: "co-mc-13", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "The app would run faster if we ___ to a more efficient database.",
    options: ["migrate", "migrated", "had migrated", "would migrate"],
    correct: 1,
    explanation: "Second conditional: hypothetical improvement → past simple in if-clause.",
  },
  {
    id: "co-mc-14", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "If the build ___, the deployment pipeline stops automatically.",
    options: ["fails", "failed", "had failed", "would fail"],
    correct: 0,
    explanation: "Zero conditional: automatic system behaviour → present simple in both clauses.",
  },
  {
    id: "co-mc-15", topic: "conditionals", level: 2, type: "multiple-choice",
    sentence: "We would have hit our Q3 targets if the enterprise deal ___ through.",
    options: ["goes", "went", "had gone", "would have gone"],
    correct: 2,
    explanation: "Third conditional: past regret → 'had + past participle' in if-clause.",
  },
];

const COND_FB: FBItem[] = [
  {
    id: "co-fb-01", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "If we ___ a backup plan, we would be in serious trouble right now.",
    answer: "didn't have",
    hint: "use: have (Second conditional, if-clause negative)",
    explanation: "Second conditional: hypothetical present situation → past simple negative.",
  },
  {
    id: "co-fb-02", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "If the client ___ the spec tomorrow, we can start development immediately.",
    answer: "approves",
    hint: "use: approve (First conditional, if-clause)",
    explanation: "First conditional: real future plan → present simple in if-clause.",
  },
  {
    id: "co-fb-03", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "We ___ this outage if we had load-tested the system beforehand.",
    answer: "wouldn't have faced",
    hint: "use: face (Third conditional, main clause negative)",
    explanation: "Third conditional: past hypothetical → 'would not have + past participle'.",
  },
  {
    id: "co-fb-04", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "If you compress the images, the page ___ much faster.",
    answer: "will load",
    hint: "use: load (First conditional, main clause)",
    explanation: "First conditional: predictable real result → 'will + base verb'.",
  },
  {
    id: "co-fb-05", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "If I ___ the CTO, I would invest more in automated testing.",
    answer: "were",
    hint: "use: be (Second conditional, hypothetical — use 'were' for all persons)",
    explanation: "'If I were' is the formal subjunctive for all persons in second conditionals.",
  },
  {
    id: "co-fb-06", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "If the logs ___ any errors, the monitoring system sends an alert automatically.",
    answer: "show",
    hint: "use: show (Zero conditional, if-clause)",
    explanation: "Zero conditional: automatic rule → present simple in both clauses.",
  },
  {
    id: "co-fb-07", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "We ___ the product on time if the third-party API hadn't gone down.",
    answer: "would have launched",
    hint: "use: launch (Third conditional, main clause)",
    explanation: "Third conditional: past regret → 'would have + past participle'.",
  },
  {
    id: "co-fb-08", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "If we ___ two more engineers, we could deliver the project much faster.",
    answer: "hired",
    hint: "use: hire (Second conditional, if-clause)",
    explanation: "Second conditional: hypothetical resourcing → past simple in if-clause.",
  },
  {
    id: "co-fb-09", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "Unless you ___ the dependencies, the security audit will flag vulnerabilities.",
    answer: "update",
    hint: "use: update (First conditional with 'unless')",
    explanation: "'Unless' = 'if not'; first conditional → present simple in the condition.",
  },
  {
    id: "co-fb-10", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "If memory usage ___ the threshold, the pod restarts automatically.",
    answer: "exceeds",
    hint: "use: exceed (Zero conditional, if-clause)",
    explanation: "Zero conditional: automatic system behaviour → present simple.",
  },
  {
    id: "co-fb-11", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "She ___ the senior role if she had led the migration project.",
    answer: "would have got",
    hint: "use: get (Third conditional, main clause)",
    explanation: "Third conditional: past opportunity missed → 'would have + past participle'.",
  },
  {
    id: "co-fb-12", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "If you ___ the delay to the client, the relationship will suffer.",
    answer: "don't communicate",
    hint: "use: communicate (First conditional, if-clause negative)",
    explanation: "First conditional: real risk → present simple negative in if-clause.",
  },
  {
    id: "co-fb-13", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "I would refactor this module if I ___ more time in the sprint.",
    answer: "had",
    hint: "use: have (Second conditional, if-clause)",
    explanation: "Second conditional: hypothetical → past simple ('had') in if-clause.",
  },
  {
    id: "co-fb-14", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "If the server response time ___, users will start abandoning the checkout.",
    answer: "increases",
    hint: "use: increase (First conditional, if-clause)",
    explanation: "First conditional: predictable real future scenario → present simple.",
  },
  {
    id: "co-fb-15", topic: "conditionals", level: 3, type: "fill-blank",
    sentence: "The partnership ___ more successful if both teams had communicated better.",
    answer: "would have been",
    hint: "use: be (Third conditional, main clause)",
    explanation: "Third conditional: past hypothetical outcome → 'would have + past participle'.",
  },
];

const COND_TR: TRItem[] = [
  {
    id: "co-tr-01", topic: "conditionals", level: 4, type: "transformation",
    original: "If we upgrade the server, we will handle more traffic.",
    instruction: "Rewrite as a hypothetical (second conditional) — upgrading is just an idea.",
    answer: "If we upgraded the server, we would handle more traffic.",
    explanation: "Second conditional: past simple in if-clause + would in main clause for hypotheticals.",
  },
  {
    id: "co-tr-02", topic: "conditionals", level: 4, type: "transformation",
    original: "Unless the requirements are clear, we won't meet the deadline.",
    instruction: "Rewrite replacing 'unless' with 'if...not'.",
    answer: "If the requirements are not clear, we won't meet the deadline.",
    explanation: "'Unless' is equivalent to 'if...not' in first conditional sentences.",
  },
  {
    id: "co-tr-03", topic: "conditionals", level: 4, type: "transformation",
    original: "If you add caching, the API will respond faster.",
    instruction: "Rewrite as a general fact (zero conditional).",
    answer: "If you add caching, the API responds faster.",
    explanation: "Zero conditional: present simple in both clauses to express a technical fact.",
  },
  {
    id: "co-tr-04", topic: "conditionals", level: 4, type: "transformation",
    original: "If I am the project manager, I will set up daily stand-ups.",
    instruction: "Rewrite as a hypothetical — you are not actually the PM.",
    answer: "If I were the project manager, I would set up daily stand-ups.",
    explanation: "Second conditional: 'were' (not 'was') + 'would' for hypothetical advice.",
  },
  {
    id: "co-tr-05", topic: "conditionals", level: 4, type: "transformation",
    original: "Had we tested the failover mechanism, we could have avoided the downtime.",
    instruction: "Rewrite using a standard 'If' clause.",
    answer: "If we had tested the failover mechanism, we could have avoided the downtime.",
    explanation: "'Had we...' is an inverted third conditional — the standard form uses 'If + had + V3'.",
  },
  {
    id: "co-tr-06", topic: "conditionals", level: 4, type: "transformation",
    original: "If you run this report without filters, it crashes the server.",
    instruction: "Rewrite as a first conditional warning to a colleague.",
    answer: "If you run this report without filters, it will crash the server.",
    explanation: "'Will' in the main clause makes the warning stronger and more specific to a future event.",
  },
  {
    id: "co-tr-07", topic: "conditionals", level: 4, type: "transformation",
    original: "We would hire more QA engineers if we had a bigger budget.",
    instruction: "Rewrite as a third conditional — the budget decision was made last quarter.",
    answer: "We would have hired more QA engineers if we had had a bigger budget.",
    explanation: "Third conditional: both clauses shift to perfect forms for past hypotheticals.",
  },
  {
    id: "co-tr-08", topic: "conditionals", level: 4, type: "transformation",
    original: "If the team communicates better, the project will succeed.",
    instruction: "Give the same advice using 'If I were you...' (second conditional).",
    answer: "If I were you, I would make sure the team communicates better.",
    explanation: "'If I were you, I would...' is a standard structure for advice using second conditional.",
  },
  {
    id: "co-tr-09", topic: "conditionals", level: 4, type: "transformation",
    original: "We could release the feature sooner if we removed some scope.",
    instruction: "Rewrite as a first conditional — scope reduction is a confirmed plan.",
    answer: "If we remove some scope, we will release the feature sooner.",
    explanation: "First conditional: real plan → present simple in if-clause, will in main clause.",
  },
  {
    id: "co-tr-10", topic: "conditionals", level: 4, type: "transformation",
    original: "We would scale the team if we secured the Series B funding.",
    instruction: "Rewrite as a third conditional — the funding decision was made last year.",
    answer: "We would have scaled the team if we had secured the Series B funding.",
    explanation: "Third conditional: past opportunity → 'would have + V3' and 'had + V3'.",
  },
  {
    id: "co-tr-11", topic: "conditionals", level: 4, type: "transformation",
    original: "If I had known about the API rate limits, I would have built a queue.",
    instruction: "Rewrite as a second conditional — you still don't know about the limits.",
    answer: "If I knew about the API rate limits, I would build a queue.",
    explanation: "Second conditional: present hypothetical → past simple + would + base verb.",
  },
  {
    id: "co-tr-12", topic: "conditionals", level: 4, type: "transformation",
    original: "Unless we fix the memory leak, users will report crashes.",
    instruction: "Rewrite using 'if...not'.",
    answer: "If we don't fix the memory leak, users will report crashes.",
    explanation: "'Unless' = 'if not'; both form first conditional warnings.",
  },
  {
    id: "co-tr-13", topic: "conditionals", level: 4, type: "transformation",
    original: "If we integrate automated testing, bugs will be caught earlier.",
    instruction: "Rewrite as a hypothetical — the team has no plans to integrate it.",
    answer: "If we integrated automated testing, bugs would be caught earlier.",
    explanation: "Second conditional: past simple + would to express a hypothetical scenario.",
  },
  {
    id: "co-tr-14", topic: "conditionals", level: 4, type: "transformation",
    original: "You will get better sprint estimates if you break tickets into smaller tasks.",
    instruction: "Rewrite starting with 'If'.",
    answer: "If you break tickets into smaller tasks, you will get better sprint estimates.",
    explanation: "The if-clause and main clause can be swapped freely without changing meaning.",
  },
  {
    id: "co-tr-15", topic: "conditionals", level: 4, type: "transformation",
    original: "Provided that the load tests pass, we will deploy on Friday.",
    instruction: "Rewrite using a standard 'If' clause.",
    answer: "If the load tests pass, we will deploy on Friday.",
    explanation: "'Provided that' is a synonym for 'if' in first conditional sentences.",
  },
];

// ── PASSIVE VOICE ─────────────────────────────────────────────────────────────

const PV_MC: MCItem[] = [
  {
    id: "pv-mc-01", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The new microservice architecture ___ by the senior engineer last quarter.",
    options: ["designed", "was designed", "has designed", "is designed"],
    correct: 1,
    explanation: "Past passive: 'was + past participle' — specific past time, agent named with 'by'.",
  },
  {
    id: "pv-mc-02", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "All API requests ___ with TLS encryption by default.",
    options: ["are secured", "secure", "secured", "were securing"],
    correct: 0,
    explanation: "Present passive: 'are + past participle' — ongoing rule or state.",
  },
  {
    id: "pv-mc-03", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The production database ___ every night at midnight.",
    options: ["backs up", "backed up", "is backed up", "has backed up"],
    correct: 2,
    explanation: "Present passive: routine scheduled action → 'is + past participle'.",
  },
  {
    id: "pv-mc-04", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The critical bug ___ before the client demo tomorrow.",
    options: ["must fix", "must be fixed", "must have fixed", "must fixed"],
    correct: 1,
    explanation: "Modal passive: 'must be + past participle' for obligations.",
  },
  {
    id: "pv-mc-05", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The release notes ___ to all stakeholders before the product launch.",
    options: ["have sent", "have been sent", "are sending", "were sending"],
    correct: 1,
    explanation: "Present perfect passive: 'have been + past participle'.",
  },
  {
    id: "pv-mc-06", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The new developer ___ about the deployment process during onboarding.",
    options: ["informed", "was informed", "has informed", "is informing"],
    correct: 1,
    explanation: "Past passive: 'was + past participle' — the developer received information.",
  },
  {
    id: "pv-mc-07", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "A solution to the performance issue ___ by our lead architect.",
    options: ["has proposed", "has been proposed", "proposed", "is proposing"],
    correct: 1,
    explanation: "Present perfect passive: 'has been + past participle'.",
  },
  {
    id: "pv-mc-08", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "Infrastructure costs ___ significantly after migrating to the cloud.",
    options: ["reduced", "were reduced", "have reducing", "are reduce"],
    correct: 1,
    explanation: "Past passive: 'were + past participle' — costs were reduced (by the migration).",
  },
  {
    id: "pv-mc-09", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "All code changes ___ through pull requests before being merged.",
    options: ["are reviewed", "review", "are reviewing", "reviewed"],
    correct: 0,
    explanation: "Present passive: standard process → 'are + past participle'.",
  },
  {
    id: "pv-mc-10", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The meeting agenda ___ at least 24 hours before the call.",
    options: ["should send", "should be sent", "should have sent", "should be sending"],
    correct: 1,
    explanation: "Modal passive: 'should be + past participle' — expressing expectation.",
  },
  {
    id: "pv-mc-11", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The API ___ by over 10,000 developers worldwide.",
    options: ["uses", "is used", "used", "has using"],
    correct: 1,
    explanation: "Present passive: current fact about usage → 'is + past participle'.",
  },
  {
    id: "pv-mc-12", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The sprint backlog ___ during the planning session yesterday.",
    options: ["has been refined", "was refined", "is refined", "refined"],
    correct: 1,
    explanation: "Past passive: completed past action → 'was + past participle'.",
  },
  {
    id: "pv-mc-13", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The security patch ___ to all servers by tomorrow morning.",
    options: ["will apply", "will be applied", "applied", "is applying"],
    correct: 1,
    explanation: "Future passive: 'will be + past participle' for planned future actions.",
  },
  {
    id: "pv-mc-14", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The client portal ___ using React and TypeScript.",
    options: ["builds", "built", "was built", "is building"],
    correct: 2,
    explanation: "Past passive: 'was + past participle' — describing how it was created.",
  },
  {
    id: "pv-mc-15", topic: "passive-voice", level: 2, type: "multiple-choice",
    sentence: "The vendor proposal ___ by our legal team right now.",
    options: ["reviews", "is being reviewed", "has reviewed", "was reviewing"],
    correct: 1,
    explanation: "Present continuous passive: 'is being + past participle' for in-progress actions.",
  },
];

const PV_FB: FBItem[] = [
  {
    id: "pv-fb-01", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "The security audit ___ by an external firm every year.",
    answer: "is conducted",
    hint: "use: conduct (Present passive)",
    explanation: "Present passive for recurring actions: 'is + past participle'.",
  },
  {
    id: "pv-fb-02", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "The bug report ___ to the QA team last night.",
    answer: "was submitted",
    hint: "use: submit (Past passive)",
    explanation: "Past passive: 'was + past participle' for a completed past action.",
  },
  {
    id: "pv-fb-03", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "API response times ___ in real time by the observability platform.",
    answer: "are monitored",
    hint: "use: monitor (Present passive)",
    explanation: "Present passive for continuous processes: 'are + past participle'.",
  },
  {
    id: "pv-fb-04", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "The contract ___ yet — we're still in negotiation.",
    answer: "hasn't been signed",
    hint: "use: sign (Present perfect passive negative)",
    explanation: "Present perfect passive negative: 'hasn't been + past participle'.",
  },
  {
    id: "pv-fb-05", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "The deployment pipeline ___ significantly over the last quarter.",
    answer: "has been improved",
    hint: "use: improve (Present perfect passive)",
    explanation: "Present perfect passive: 'has been + past participle' with current relevance.",
  },
  {
    id: "pv-fb-06", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "All user passwords ___ before storing in the database.",
    answer: "are hashed",
    hint: "use: hash (Present passive)",
    explanation: "Present passive for standard security practice: 'are + past participle'.",
  },
  {
    id: "pv-fb-07", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "The project scope ___ after the client's feedback last month.",
    answer: "was redefined",
    hint: "use: redefine (Past passive)",
    explanation: "Past passive: 'was + past participle' — the scope received the change.",
  },
  {
    id: "pv-fb-08", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "The roadmap ___ by the team last week, just in time for the board meeting.",
    answer: "was prepared",
    hint: "use: prepare (Past passive)",
    explanation: "Past passive: 'was + past participle' for a completed team action.",
  },
  {
    id: "pv-fb-09", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "Three new features ___ in the upcoming sprint.",
    answer: "will be released",
    hint: "use: release (Future passive)",
    explanation: "Future passive: 'will be + past participle' for planned future actions.",
  },
  {
    id: "pv-fb-10", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "The vendor proposal ___ by our legal team right now.",
    answer: "is being reviewed",
    hint: "use: review (Present continuous passive)",
    explanation: "Present continuous passive: 'is being + past participle' for actions in progress.",
  },
  {
    id: "pv-fb-11", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "The entire codebase ___ to TypeScript over the next two sprints.",
    answer: "will be migrated",
    hint: "use: migrate (Future passive)",
    explanation: "Future passive: 'will be + past participle' for a planned future action.",
  },
  {
    id: "pv-fb-12", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "All data ___ using AES-256 before transmission.",
    answer: "is encrypted",
    hint: "use: encrypt (Present passive)",
    explanation: "Present passive for a standard technical process: 'is + past participle'.",
  },
  {
    id: "pv-fb-13", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "The performance metrics ___ by the team last Friday before the retrospective.",
    answer: "were analyzed",
    hint: "use: analyze (Past passive)",
    explanation: "Past passive: 'were + past participle' for a group action last Friday.",
  },
  {
    id: "pv-fb-14", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "The new engineer ___ to the payments team on her first day.",
    answer: "was assigned",
    hint: "use: assign (Past passive)",
    explanation: "Past passive: 'was + past participle' — she received the assignment.",
  },
  {
    id: "pv-fb-15", topic: "passive-voice", level: 3, type: "fill-blank",
    sentence: "A detailed post-mortem report ___ after every production incident.",
    answer: "is written",
    hint: "use: write (Present passive)",
    explanation: "Present passive for company policy: 'is + past participle'.",
  },
];

const PV_TR: TRItem[] = [
  {
    id: "pv-tr-01", topic: "passive-voice", level: 4, type: "transformation",
    original: "The DevOps team deployed the new version last night.",
    instruction: "Rewrite in passive voice.",
    answer: "The new version was deployed by the DevOps team last night.",
    explanation: "Past passive: object → subject, 'deployed' → 'was deployed', agent in 'by' phrase.",
  },
  {
    id: "pv-tr-02", topic: "passive-voice", level: 4, type: "transformation",
    original: "The server validates every API request.",
    instruction: "Rewrite in passive voice.",
    answer: "Every API request is validated by the server.",
    explanation: "Present passive: 'validates' → 'is validated'; object becomes subject.",
  },
  {
    id: "pv-tr-03", topic: "passive-voice", level: 4, type: "transformation",
    original: "Someone has leaked the client's confidential data.",
    instruction: "Rewrite in passive voice, omitting the unknown agent.",
    answer: "The client's confidential data has been leaked.",
    explanation: "Present perfect passive: 'has been + past participle'; agent dropped when unknown.",
  },
  {
    id: "pv-tr-04", topic: "passive-voice", level: 4, type: "transformation",
    original: "The team will complete the migration by Friday.",
    instruction: "Rewrite in passive voice.",
    answer: "The migration will be completed by the team by Friday.",
    explanation: "Future passive: 'will be + past participle'.",
  },
  {
    id: "pv-tr-05", topic: "passive-voice", level: 4, type: "transformation",
    original: "Our engineers are fixing the production issue right now.",
    instruction: "Rewrite in passive voice.",
    answer: "The production issue is being fixed by our engineers right now.",
    explanation: "Present continuous passive: 'is being + past participle'.",
  },
  {
    id: "pv-tr-06", topic: "passive-voice", level: 4, type: "transformation",
    original: "The bug was introduced in the latest commit.",
    instruction: "Rewrite in active voice. Subject: 'The developer'.",
    answer: "The developer introduced the bug in the latest commit.",
    explanation: "Active voice: subject (developer) + verb (introduced) + object (bug).",
  },
  {
    id: "pv-tr-07", topic: "passive-voice", level: 4, type: "transformation",
    original: "The security team must review all third-party libraries.",
    instruction: "Rewrite in passive voice.",
    answer: "All third-party libraries must be reviewed by the security team.",
    explanation: "Modal passive: 'must be + past participle'.",
  },
  {
    id: "pv-tr-08", topic: "passive-voice", level: 4, type: "transformation",
    original: "The company trained the new engineers on the internal tools.",
    instruction: "Rewrite in passive voice.",
    answer: "The new engineers were trained on the internal tools by the company.",
    explanation: "Past passive: 'were + past participle'.",
  },
  {
    id: "pv-tr-09", topic: "passive-voice", level: 4, type: "transformation",
    original: "The system has processed over a million requests today.",
    instruction: "Rewrite in passive voice.",
    answer: "Over a million requests have been processed by the system today.",
    explanation: "Present perfect passive: 'have been + past participle'.",
  },
  {
    id: "pv-tr-10", topic: "passive-voice", level: 4, type: "transformation",
    original: "The contract has been signed by both parties.",
    instruction: "Rewrite in active voice.",
    answer: "Both parties have signed the contract.",
    explanation: "Active voice: subject (both parties) + 'have signed' + object.",
  },
  {
    id: "pv-tr-11", topic: "passive-voice", level: 4, type: "transformation",
    original: "We should update the API documentation after every release.",
    instruction: "Rewrite in passive voice.",
    answer: "The API documentation should be updated after every release.",
    explanation: "Modal passive: 'should be + past participle'; agent removed for a general obligation.",
  },
  {
    id: "pv-tr-12", topic: "passive-voice", level: 4, type: "transformation",
    original: "The architect designed the database schema three years ago.",
    instruction: "Rewrite in passive voice.",
    answer: "The database schema was designed by the architect three years ago.",
    explanation: "Past passive: 'was + past participle'.",
  },
  {
    id: "pv-tr-13", topic: "passive-voice", level: 4, type: "transformation",
    original: "Developers are testing the new authentication flow.",
    instruction: "Rewrite in passive voice.",
    answer: "The new authentication flow is being tested by developers.",
    explanation: "Present continuous passive: 'is being + past participle'.",
  },
  {
    id: "pv-tr-14", topic: "passive-voice", level: 4, type: "transformation",
    original: "The stakeholders have not approved the revised timeline.",
    instruction: "Rewrite in passive voice.",
    answer: "The revised timeline has not been approved by the stakeholders.",
    explanation: "Present perfect passive negative: 'has not been + past participle'.",
  },
  {
    id: "pv-tr-15", topic: "passive-voice", level: 4, type: "transformation",
    original: "The product team will launch three new features next quarter.",
    instruction: "Rewrite in passive voice.",
    answer: "Three new features will be launched by the product team next quarter.",
    explanation: "Future passive: 'will be + past participle'.",
  },
];

// ── MODAL VERBS ───────────────────────────────────────────────────────────────

const MV_MC: MCItem[] = [
  {
    id: "mv-mc-01", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "You ___ bring your laptop to the client site — it's mandatory.",
    options: ["should", "could", "must", "might"],
    correct: 2,
    explanation: "'Must' expresses strong obligation — the laptop is required.",
  },
  {
    id: "mv-mc-02", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "The server ___ be overloaded — the response times are unusually high.",
    options: ["must", "should", "would", "can"],
    correct: 0,
    explanation: "'Must' expresses logical deduction based on evidence.",
  },
  {
    id: "mv-mc-03", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "You ___ share client data with third parties without a signed NDA.",
    options: ["should not", "must not", "could not", "might not"],
    correct: 1,
    explanation: "'Must not' expresses a strict prohibition — it is not allowed.",
  },
  {
    id: "mv-mc-04", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "___ you please review my pull request before the end of the day?",
    options: ["Can", "Must", "Should", "Would"],
    correct: 3,
    explanation: "'Would you...' is the most polite and formal way to make a request.",
  },
  {
    id: "mv-mc-05", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "I'm not sure, but the root cause ___ be a race condition.",
    options: ["must", "should", "might", "would"],
    correct: 2,
    explanation: "'Might' expresses uncertainty — we have a possible explanation but aren't sure.",
  },
  {
    id: "mv-mc-06", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "When I was a junior developer, I ___ debug code for hours without a break.",
    options: ["can", "could", "might", "would"],
    correct: 1,
    explanation: "'Could' expresses past ability.",
  },
  {
    id: "mv-mc-07", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "You ___ have told the client about the delay — they're very unhappy now.",
    options: ["should", "could", "must", "might"],
    correct: 0,
    explanation: "'Should have + past participle' expresses past regret or criticism.",
  },
  {
    id: "mv-mc-08", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "The team ___ migrate to the new framework — it's optional but recommended.",
    options: ["must", "should", "would", "may"],
    correct: 1,
    explanation: "'Should' expresses a recommendation, not a strict requirement.",
  },
  {
    id: "mv-mc-09", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "___ I access the production environment during the incident?",
    options: ["Would", "Should", "May", "Must"],
    correct: 2,
    explanation: "'May I...' is a formal way to ask for permission.",
  },
  {
    id: "mv-mc-10", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "The system ___ handle up to 10,000 concurrent users after the scaling work.",
    options: ["should", "might", "can", "would"],
    correct: 2,
    explanation: "'Can' expresses confirmed capability or ability.",
  },
  {
    id: "mv-mc-11", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "We ___ have tested the integration earlier — now we're debugging in production.",
    options: ["should", "could", "must", "may"],
    correct: 0,
    explanation: "'Should have + past participle' expresses regret about a past mistake.",
  },
  {
    id: "mv-mc-12", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "If you have questions during onboarding, you ___ ask your buddy at any time.",
    options: ["must", "should", "can", "would"],
    correct: 2,
    explanation: "'Can' expresses permission — asking questions is allowed.",
  },
  {
    id: "mv-mc-13", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "The project ___ be completed by Q3, but we're not 100% certain yet.",
    options: ["must", "will", "might", "should"],
    correct: 2,
    explanation: "'Might' expresses uncertainty about a future outcome.",
  },
  {
    id: "mv-mc-14", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "In my previous company, we ___ deploy every Friday — it was the team's routine.",
    options: ["could", "would", "should", "might"],
    correct: 1,
    explanation: "'Would' expresses a regular past habit or routine.",
  },
  {
    id: "mv-mc-15", topic: "modal-verbs", level: 2, type: "multiple-choice",
    sentence: "The documentation ___ be reviewed by the tech writer before publishing.",
    options: ["can", "might", "must", "would"],
    correct: 2,
    explanation: "'Must' expresses a required step in the publishing process.",
  },
];

const MV_FB: FBItem[] = [
  {
    id: "mv-fb-01", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "We ___ finish the sprint review before 4 PM — it's already quarter to.",
    answer: "should",
    hint: "use: should (recommendation / expectation)",
    explanation: "'Should' expresses that finishing on time is expected or recommended.",
  },
  {
    id: "mv-fb-02", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "I ___ write a single unit test when I joined — I had no prior experience.",
    answer: "couldn't",
    hint: "use: couldn't (past inability)",
    explanation: "'Couldn't' expresses a past inability.",
  },
  {
    id: "mv-fb-03", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "We ___ miss the sprint deadline — we're already two days behind schedule.",
    answer: "might",
    hint: "use: might (possibility / uncertainty)",
    explanation: "'Might' expresses a real possibility that is not yet certain.",
  },
  {
    id: "mv-fb-04", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "___ you please review this pull request? I've been waiting for two days.",
    answer: "Could",
    hint: "use: Could (polite request)",
    explanation: "'Could you please...' is a polite way to make a request.",
  },
  {
    id: "mv-fb-05", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "All team members ___ complete the security training by Friday.",
    answer: "must",
    hint: "use: must (obligation / mandatory requirement)",
    explanation: "'Must' expresses a mandatory requirement.",
  },
  {
    id: "mv-fb-06", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "The API ___ handle 500 requests per second after load testing confirmed it.",
    answer: "can",
    hint: "use: can (confirmed ability / capability)",
    explanation: "'Can' expresses a confirmed capability.",
  },
  {
    id: "mv-fb-07", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "You ___ share your login credentials with anyone — use the secrets manager.",
    answer: "shouldn't",
    hint: "use: shouldn't (strong advice against)",
    explanation: "'Shouldn't' expresses strong advice not to do something.",
  },
  {
    id: "mv-fb-08", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "We ___ have weekly all-hands when the team was smaller — everyone attended.",
    answer: "would",
    hint: "use: would (past habit / regular routine)",
    explanation: "'Would' expresses a regular past habit.",
  },
  {
    id: "mv-fb-09", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "The performance issue ___ be caused by unoptimised SQL queries.",
    answer: "may",
    hint: "use: may (reasonable possibility)",
    explanation: "'May' expresses a reasonable possibility when investigating.",
  },
  {
    id: "mv-fb-10", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "You ___ deploy to production without running the full test suite.",
    answer: "must not",
    hint: "use: must not (strict prohibition)",
    explanation: "'Must not' is a strict prohibition — deploying without tests is forbidden.",
  },
  {
    id: "mv-fb-11", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "If we work overtime this week, we ___ deliver the MVP on time.",
    answer: "could",
    hint: "use: could (conditional possibility / ability)",
    explanation: "'Could' expresses a possible outcome given a condition.",
  },
  {
    id: "mv-fb-12", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "I'm sorry — I ___ informed you about the delay sooner.",
    answer: "should have",
    hint: "use: should have (past regret)",
    explanation: "'Should have + past participle' expresses regret about something not done.",
  },
  {
    id: "mv-fb-13", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "The junior developer ___ understand the codebase yet — it's very complex.",
    answer: "might not",
    hint: "use: might not (uncertainty / possibility of not)",
    explanation: "'Might not' expresses uncertainty — it's possible they don't understand.",
  },
  {
    id: "mv-fb-14", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "You ___ take Monday off — you've worked extra hours all week.",
    answer: "can",
    hint: "use: can (permission being granted)",
    explanation: "'Can' expresses permission being granted.",
  },
  {
    id: "mv-fb-15", topic: "modal-verbs", level: 3, type: "fill-blank",
    sentence: "The client ___ prefer a phased rollout over a big-bang release.",
    answer: "would",
    hint: "use: would (conditional preference / polite expression)",
    explanation: "'Would prefer' expresses a preference, often in polite or conditional contexts.",
  },
];

const MV_TR: TRItem[] = [
  {
    id: "mv-tr-01", topic: "modal-verbs", level: 4, type: "transformation",
    original: "It is mandatory to use two-factor authentication.",
    instruction: "Rewrite using 'must'.",
    answer: "You must use two-factor authentication.",
    explanation: "'Must' expresses a strong obligation or mandatory rule.",
  },
  {
    id: "mv-tr-02", topic: "modal-verbs", level: 4, type: "transformation",
    original: "It is possible that the server is experiencing high load.",
    instruction: "Rewrite using 'might be'.",
    answer: "The server might be experiencing high load.",
    explanation: "'Might be + -ing' expresses a present possibility.",
  },
  {
    id: "mv-tr-03", topic: "modal-verbs", level: 4, type: "transformation",
    original: "It would be a good idea to write integration tests.",
    instruction: "Rewrite using 'should'.",
    answer: "You should write integration tests.",
    explanation: "'Should' expresses advice or recommendation.",
  },
  {
    id: "mv-tr-04", topic: "modal-verbs", level: 4, type: "transformation",
    original: "It is not allowed to access client data without authorisation.",
    instruction: "Rewrite using 'must not'.",
    answer: "You must not access client data without authorisation.",
    explanation: "'Must not' expresses a strict prohibition.",
  },
  {
    id: "mv-tr-05", topic: "modal-verbs", level: 4, type: "transformation",
    original: "The team had the ability to scale the infrastructure automatically.",
    instruction: "Rewrite using 'could'.",
    answer: "The team could scale the infrastructure automatically.",
    explanation: "'Could' expresses past ability.",
  },
  {
    id: "mv-tr-06", topic: "modal-verbs", level: 4, type: "transformation",
    original: "I regret not reviewing the code before it was merged.",
    instruction: "Rewrite using 'should have'.",
    answer: "I should have reviewed the code before it was merged.",
    explanation: "'Should have + past participle' expresses past regret.",
  },
  {
    id: "mv-tr-07", topic: "modal-verbs", level: 4, type: "transformation",
    original: "Is it OK if I work from home on Friday?",
    instruction: "Rewrite as a formal permission request using 'May I'.",
    answer: "May I work from home on Friday?",
    explanation: "'May I...' is a formal way to request permission.",
  },
  {
    id: "mv-tr-08", topic: "modal-verbs", level: 4, type: "transformation",
    original: "The root cause is almost certainly a memory leak.",
    instruction: "Rewrite using 'must be' to show logical deduction.",
    answer: "The root cause must be a memory leak.",
    explanation: "'Must be' expresses strong logical deduction based on available evidence.",
  },
  {
    id: "mv-tr-09", topic: "modal-verbs", level: 4, type: "transformation",
    original: "Perhaps the client will request additional features.",
    instruction: "Rewrite using 'might'.",
    answer: "The client might request additional features.",
    explanation: "'Might' expresses a future possibility that is uncertain.",
  },
  {
    id: "mv-tr-10", topic: "modal-verbs", level: 4, type: "transformation",
    original: "Our team used to deploy every two weeks.",
    instruction: "Rewrite using 'would' to describe a past habit.",
    answer: "Our team would deploy every two weeks.",
    explanation: "'Would' describes a habitual past action or regular routine.",
  },
  {
    id: "mv-tr-11", topic: "modal-verbs", level: 4, type: "transformation",
    original: "You are not allowed to share the API keys in Slack.",
    instruction: "Rewrite using 'must not'.",
    answer: "You must not share the API keys in Slack.",
    explanation: "'Must not' expresses a strict prohibition.",
  },
  {
    id: "mv-tr-12", topic: "modal-verbs", level: 4, type: "transformation",
    original: "It is possible for you to request access to the staging environment.",
    instruction: "Rewrite using 'can'.",
    answer: "You can request access to the staging environment.",
    explanation: "'Can' expresses permission or possibility.",
  },
  {
    id: "mv-tr-13", topic: "modal-verbs", level: 4, type: "transformation",
    original: "It was a mistake not to back up the database before the migration.",
    instruction: "Rewrite using 'should have'.",
    answer: "We should have backed up the database before the migration.",
    explanation: "'Should have + past participle' expresses criticism or regret about a past omission.",
  },
  {
    id: "mv-tr-14", topic: "modal-verbs", level: 4, type: "transformation",
    original: "I think it is probable that the new architecture will reduce costs.",
    instruction: "Rewrite using 'should' to express expectation.",
    answer: "The new architecture should reduce costs.",
    explanation: "'Should' expresses expectation or probability, not just advice.",
  },
  {
    id: "mv-tr-15", topic: "modal-verbs", level: 4, type: "transformation",
    original: "Please review this before submitting.",
    instruction: "Rewrite as a polite request using 'Could you'.",
    answer: "Could you review this before submitting?",
    explanation: "'Could you...' is a polite way to make a request, more formal than 'Can you'.",
  },
];

// ── Combined exercise pool ────────────────────────────────────────────────────

export const EXERCISES: GrammarItem[] = [
  ...PP_MC, ...PP_FB, ...PP_TR,
  ...COND_MC, ...COND_FB, ...COND_TR,
  ...PV_MC, ...PV_FB, ...PV_TR,
  ...MV_MC, ...MV_FB, ...MV_TR,
];

// ── Session builder ───────────────────────────────────────────────────────────
// codeLevel: 0 = rule card, 1 = multiple-choice, 2 = fill-blank, 3 = transformation

function sample<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export function getSessionExercise(topicId: TopicId, codeLevel: number): ExerciseData {
  if (codeLevel === 0) return RULE_CARDS[topicId];

  const specLevel = (codeLevel + 1) as 2 | 3 | 4;
  const pool = EXERCISES.filter((e) => e.topic === topicId && e.level === specLevel);
  const chosen = sample(pool, 5);

  if (codeLevel === 1) {
    return {
      type: "multiple-choice",
      questions: (chosen as MCItem[]).map((e) => ({
        sentence: e.sentence,
        options: [...e.options],
        correct: e.correct,
        explanation: e.explanation,
      })),
    } as MultipleChoiceExercise;
  }

  if (codeLevel === 2) {
    return {
      type: "fill-blank",
      questions: (chosen as FBItem[]).map((e) => ({
        sentence: e.sentence,
        answer: e.answer,
        hint: e.hint,
        explanation: e.explanation,
      })),
    } as FillBlankExercise;
  }

  return {
    type: "transformation",
    questions: (chosen as TRItem[]).map((e) => ({
      original: e.original,
      instruction: e.instruction,
      answer: e.answer,
      explanation: e.explanation,
    })),
  } as TransformationExercise;
}
