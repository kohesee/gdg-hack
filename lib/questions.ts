import { PersonalityType } from './supabase';

export interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    personality: PersonalityType;
  }[];
}

export const personalityQuestions: Question[] = [
  {
    id: 1,
    question: "In a hackathon, you prefer to...",
    options: [
      { text: "Lead the team and coordinate tasks", personality: "leader" },
      { text: "Design the UI/UX and make it beautiful", personality: "creative" },
      { text: "Work on the backend and optimize performance", personality: "analytical" },
      { text: "Network and pitch the idea", personality: "social" },
      { text: "Build the core functionality that works", personality: "practical" }
    ]
  },
  {
    id: 2,
    question: "When faced with a problem, you first...",
    options: [
      { text: "Delegate tasks and create a plan", personality: "leader" },
      { text: "Brainstorm creative solutions", personality: "creative" },
      { text: "Analyze data and research solutions", personality: "analytical" },
      { text: "Discuss with teammates for ideas", personality: "social" },
      { text: "Start building a prototype immediately", personality: "practical" }
    ]
  },
  {
    id: 3,
    question: "Your ideal role in a project is...",
    options: [
      { text: "Project manager or team lead", personality: "leader" },
      { text: "Designer or front-end developer", personality: "creative" },
      { text: "Data scientist or backend engineer", personality: "analytical" },
      { text: "Community manager or marketer", personality: "social" },
      { text: "Full-stack developer", personality: "practical" }
    ]
  },
  {
    id: 4,
    question: "You feel most satisfied when...",
    options: [
      { text: "The team achieves its goals together", personality: "leader" },
      { text: "You create something visually stunning", personality: "creative" },
      { text: "You solve a complex technical problem", personality: "analytical" },
      { text: "Users love and engage with your product", personality: "social" },
      { text: "The product works flawlessly", personality: "practical" }
    ]
  },
  {
    id: 5,
    question: "During brainstorming sessions, you...",
    options: [
      { text: "Facilitate and keep everyone focused", personality: "leader" },
      { text: "Come up with wild, innovative ideas", personality: "creative" },
      { text: "Evaluate feasibility of each idea", personality: "analytical" },
      { text: "Build on others' ideas enthusiastically", personality: "social" },
      { text: "Focus on what can be built quickly", personality: "practical" }
    ]
  },
  {
    id: 6,
    question: "Your favorite part of building a product is...",
    options: [
      { text: "Setting the vision and strategy", personality: "leader" },
      { text: "Crafting the user experience", personality: "creative" },
      { text: "Implementing complex algorithms", personality: "analytical" },
      { text: "Getting user feedback", personality: "social" },
      { text: "Shipping features that work", personality: "practical" }
    ]
  },
  {
    id: 7,
    question: "When learning something new, you prefer to...",
    options: [
      { text: "Teach others while learning", personality: "leader" },
      { text: "Experiment and explore freely", personality: "creative" },
      { text: "Read documentation thoroughly", personality: "analytical" },
      { text: "Learn together with peers", personality: "social" },
      { text: "Build something with it immediately", personality: "practical" }
    ]
  },
  {
    id: 8,
    question: "Your approach to deadlines is...",
    options: [
      { text: "Create milestones and track progress", personality: "leader" },
      { text: "Work in bursts of creative inspiration", personality: "creative" },
      { text: "Plan meticulously and execute", personality: "analytical" },
      { text: "Motivate the team to push through", personality: "social" },
      { text: "Focus on MVP and iterate", personality: "practical" }
    ]
  },
  {
    id: 9,
    question: "In conflicts, you typically...",
    options: [
      { text: "Mediate and find common ground", personality: "leader" },
      { text: "Propose alternative creative solutions", personality: "creative" },
      { text: "Analyze the root cause objectively", personality: "analytical" },
      { text: "Focus on maintaining team harmony", personality: "social" },
      { text: "Focus on what gets the job done", personality: "practical" }
    ]
  },
  {
    id: 10,
    question: "Your dream hackathon project would...",
    options: [
      { text: "Solve a major societal problem", personality: "leader" },
      { text: "Be beautifully designed and innovative", personality: "creative" },
      { text: "Use cutting-edge technology", personality: "analytical" },
      { text: "Connect and help many people", personality: "social" },
      { text: "Be useful and work perfectly", personality: "practical" }
    ]
  }
];

export function calculatePersonality(answers: PersonalityType[]): { type: PersonalityType; score: number } {
  const counts: Record<PersonalityType, number> = {
    leader: 0,
    creative: 0,
    analytical: 0,
    social: 0,
    practical: 0
  };

  answers.forEach(answer => {
    counts[answer]++;
  });

  let maxType: PersonalityType = 'practical';
  let maxCount = 0;

  (Object.keys(counts) as PersonalityType[]).forEach(type => {
    if (counts[type] > maxCount) {
      maxCount = counts[type];
      maxType = type;
    }
  });

  // Score is percentage of dominant personality (0-100)
  const score = Math.round((maxCount / answers.length) * 100);

  return { type: maxType, score };
}

export const personalityDescriptions: Record<PersonalityType, string> = {
  leader: "The Visionary Leader - You excel at guiding teams and turning ideas into reality.",
  creative: "The Creative Innovator - You bring fresh perspectives and stunning designs.",
  analytical: "The Analytical Mind - You solve complex problems with data-driven solutions.",
  social: "The Social Connector - You build bridges between people and ideas.",
  practical: "The Practical Builder - You focus on shipping quality products that work."
};
