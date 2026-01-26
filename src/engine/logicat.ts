/**
 * Logicat Puzzle System
 *
 * The Logicat presents logic puzzles that must be solved for rewards.
 * Triggered by redundakitty clicks when Logicat boost is owned.
 *
 * Key mechanics:
 * - Puzzle generation with premises and a question
 * - Answer validation (boolean true/false)
 * - Rewards: Panther Poke accumulation, Logicat levels
 * - Difficulty scaling based on Logicat level
 */

export interface LogicatPuzzle {
  /** Array of logical premises */
  premises: string[];

  /** The question to be answered */
  question: string;

  /** The correct answer (true or false) */
  correctAnswer: boolean;

  /** Difficulty level (1-10) */
  difficulty: number;

  /** Time limit in seconds */
  timeLimit: number;
}

export interface LogicatState {
  /** Current active puzzle (null if none) */
  activePuzzle: LogicatPuzzle | null;

  /** Time remaining to solve puzzle (in seconds) */
  timeRemaining: number;

  /** Total correct answers across all sessions */
  totalCorrect: number;

  /** Total incorrect answers across all sessions */
  totalIncorrect: number;

  /** Current streak of correct answers */
  currentStreak: number;

  /** Best streak of correct answers */
  bestStreak: number;
}

/**
 * Puzzle templates for generation.
 * Each template contains patterns that can be filled with variables.
 */
interface PuzzleTemplate {
  /** Premise patterns (use {A}, {B}, {C} etc. as placeholders) */
  premises: string[];

  /** Question pattern */
  question: string;

  /** Function to determine if the answer is true based on substituted values */
  evaluator: (vars: Record<string, string>) => boolean;

  /** Minimum difficulty level for this template */
  minDifficulty: number;
}

/**
 * Pool of puzzle templates sorted by difficulty.
 */
const PUZZLE_TEMPLATES: PuzzleTemplate[] = [
  // Difficulty 1: Simple direct statements
  {
    premises: ['Statement A: {statement}.'],
    question: 'Is statement A true?',
    evaluator: (vars) => vars.truthValue === 'true',
    minDifficulty: 1,
  },
  {
    premises: [
      'If {condition1}, then {result1}.',
      '{condition1} is true.',
    ],
    question: 'Is {result1} true?',
    evaluator: () => true, // Modus ponens always true
    minDifficulty: 1,
  },

  // Difficulty 2: Simple negations
  {
    premises: [
      'Statement A: {statement}.',
      'Statement A is false.',
    ],
    question: 'Is {statement} true?',
    evaluator: () => false,
    minDifficulty: 2,
  },
  {
    premises: [
      'If {condition1}, then {result1}.',
      '{condition1} is false.',
    ],
    question: 'Is {result1} true?',
    evaluator: (vars) => vars.canDetermine === 'false', // Cannot determine
    minDifficulty: 2,
  },

  // Difficulty 3: Self-referential (paradoxes)
  {
    premises: ['Statement A: Statement A is false.'],
    question: 'Is statement A true?',
    evaluator: (vars) => vars.acceptParadox === 'false', // Paradox = false
    minDifficulty: 3,
  },
  {
    premises: [
      'Statement A: Statement B is true.',
      'Statement B: Statement A is false.',
    ],
    question: 'Is statement A true?',
    evaluator: () => false, // Paradoxical loop = false
    minDifficulty: 3,
  },

  // Difficulty 4: Conditional chains
  {
    premises: [
      'If {A}, then {B}.',
      'If {B}, then {C}.',
      '{A} is true.',
    ],
    question: 'Is {C} true?',
    evaluator: () => true, // Transitive property
    minDifficulty: 4,
  },
  {
    premises: [
      'If {A}, then {B}.',
      'If {B}, then {C}.',
      '{C} is false.',
    ],
    question: 'Is {A} true?',
    evaluator: () => false, // Modus tollens chain
    minDifficulty: 4,
  },

  // Difficulty 5: Multiple conditions (OR logic)
  {
    premises: [
      'Either {A} or {B} is true (or both).',
      '{A} is false.',
    ],
    question: 'Is {B} true?',
    evaluator: () => true, // Disjunctive syllogism
    minDifficulty: 5,
  },
  {
    premises: [
      'Either {A} or {B} is true (but not both).',
      '{A} is true.',
    ],
    question: 'Is {B} true?',
    evaluator: () => false, // Exclusive OR
    minDifficulty: 5,
  },

  // Difficulty 6: Negated conditionals
  {
    premises: [
      'If {A}, then {B}.',
      '{B} is false.',
    ],
    question: 'Is {A} true?',
    evaluator: () => false, // Modus tollens
    minDifficulty: 6,
  },
  {
    premises: [
      'If {A}, then not {B}.',
      '{B} is true.',
    ],
    question: 'Is {A} true?',
    evaluator: () => false, // Negated modus tollens
    minDifficulty: 6,
  },

  // Difficulty 7: Complex self-reference
  {
    premises: [
      'Statement A: Statement B is false.',
      'Statement B: Statement A is true.',
    ],
    question: 'Is statement A true?',
    evaluator: () => false, // Paradoxical loop
    minDifficulty: 7,
  },
  {
    premises: [
      'Statement A says: "If this statement is true, then {B} is true."',
      '{B} is false.',
    ],
    question: 'Is statement A true?',
    evaluator: () => false, // Self-referential conditional
    minDifficulty: 7,
  },

  // Difficulty 8: Multiple nested conditions
  {
    premises: [
      'If {A} and {B}, then {C}.',
      'If {C}, then {D}.',
      '{A} is true and {B} is true.',
    ],
    question: 'Is {D} true?',
    evaluator: () => true, // Compound conditional chain
    minDifficulty: 8,
  },
  {
    premises: [
      'If {A} or {B}, then {C}.',
      '{C} is false.',
    ],
    question: 'Is {A} true?',
    evaluator: () => false, // Both must be false
    minDifficulty: 8,
  },

  // Difficulty 9: Complex equivalences
  {
    premises: [
      '{A} is true if and only if {B} is true.',
      '{B} is true if and only if {C} is true.',
      '{C} is false.',
    ],
    question: 'Is {A} true?',
    evaluator: () => false, // Biconditional chain
    minDifficulty: 9,
  },
  {
    premises: [
      'Not both {A} and {B} can be true.',
      '{A} is true.',
      'If not {B}, then {C}.',
    ],
    question: 'Is {C} true?',
    evaluator: () => true, // NAND logic
    minDifficulty: 9,
  },

  // Difficulty 10: Advanced paradoxes and meta-logic
  {
    premises: [
      'Statement A: The number of false statements here is odd.',
      'Statement B: Statement A is true.',
    ],
    question: 'Is statement B true?',
    evaluator: () => false, // Meta-paradox
    minDifficulty: 10,
  },
  {
    premises: [
      'Every statement after this one is false.',
      'The previous statement is true.',
      'At least one statement here is true.',
    ],
    question: 'Is the first statement true?',
    evaluator: () => false, // Self-defeating statement
    minDifficulty: 10,
  },
];

/**
 * Variable pools for substitution into puzzle templates.
 */
const VARIABLE_POOLS = {
  statement: [
    'cats are mammals',
    'water is wet',
    'the sky is blue',
    'sandcastles are made of sand',
    'time moves forward',
    'glass is transparent',
    'dragons exist',
    'numbers are infinite',
  ],
  condition1: [
    'it is raining',
    'the cat meows',
    'you have a bucket',
    'the newpix advances',
    'glass is produced',
  ],
  result1: [
    'the ground gets wet',
    'the cat is hungry',
    'you can carry sand',
    'time progresses',
    'blocks can be made',
  ],
  A: [
    'you have sand',
    'castles exist',
    'the beach is clickable',
    'time passes',
    'glass is valuable',
    'dragons dig',
    'boosts are active',
  ],
  B: [
    'you can build',
    'the game continues',
    'tools are useful',
    'progress is made',
    'chips accumulate',
    'gold is found',
    'rewards are given',
  ],
  C: [
    'you advance',
    'achievements unlock',
    'power increases',
    'resources multiply',
    'blocks are created',
    'levels are gained',
    'bonuses apply',
  ],
  D: [
    'victory is possible',
    'the game evolves',
    'complexity increases',
    'mastery is achieved',
  ],
  truthValue: ['true', 'false'],
  canDetermine: ['true', 'false'],
  acceptParadox: ['false'], // Paradoxes default to false
};

/**
 * Generate a random logicat puzzle based on the specified difficulty.
 *
 * @param difficulty Difficulty level (1-10), typically based on Logicat Level
 * @returns A generated puzzle
 */
export function generateLogicatPuzzle(difficulty: number): LogicatPuzzle {
  // Clamp difficulty to 1-10 range
  const clampedDifficulty = Math.max(1, Math.min(10, Math.floor(difficulty)));

  // Filter templates appropriate for this difficulty
  const availableTemplates = PUZZLE_TEMPLATES.filter(
    (t) => t.minDifficulty <= clampedDifficulty
  );

  // Pick a random template
  const template =
    availableTemplates[Math.floor(Math.random() * availableTemplates.length)];

  // Substitute variables
  const vars: Record<string, string> = {};
  const varPattern = /\{(\w+)\}/g;

  // Find all unique variable names in the template
  const allText = [...template.premises, template.question].join(' ');
  const matches = allText.matchAll(varPattern);
  const uniqueVars = new Set<string>();
  for (const match of matches) {
    uniqueVars.add(match[1]);
  }

  // Assign random values to each variable
  for (const varName of uniqueVars) {
    const pool =
      VARIABLE_POOLS[varName as keyof typeof VARIABLE_POOLS] || ['X'];
    vars[varName] = pool[Math.floor(Math.random() * pool.length)];
  }

  // Substitute variables in premises and question
  const substitutedPremises = template.premises.map((p) =>
    p.replace(varPattern, (_, varName) => vars[varName] || varName)
  );
  const substitutedQuestion = template.question.replace(
    varPattern,
    (_, varName) => vars[varName] || varName
  );

  // Evaluate the correct answer
  const correctAnswer = template.evaluator(vars);

  // Calculate time limit based on difficulty (30s base - 2s per difficulty level)
  const timeLimit = Math.max(10, 30 - clampedDifficulty * 2);

  return {
    premises: substitutedPremises,
    question: substitutedQuestion,
    correctAnswer,
    difficulty: clampedDifficulty,
    timeLimit,
  };
}

/**
 * Create initial logicat state.
 */
export function createLogicatState(): LogicatState {
  return {
    activePuzzle: null,
    timeRemaining: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    currentStreak: 0,
    bestStreak: 0,
  };
}

/**
 * Start a new logicat puzzle.
 *
 * @param state Current logicat state
 * @param logicatLevel Current Logicat Level (determines difficulty)
 * @returns Updated state with new puzzle
 */
export function startLogicatPuzzle(
  state: LogicatState,
  logicatLevel: number
): LogicatState {
  // Generate difficulty based on logicat level (1-10 scale)
  const difficulty = Math.min(10, Math.floor(logicatLevel / 5) + 1);

  const puzzle = generateLogicatPuzzle(difficulty);

  return {
    ...state,
    activePuzzle: puzzle,
    timeRemaining: puzzle.timeLimit,
  };
}

/**
 * Submit an answer to the current puzzle.
 *
 * @param state Current logicat state
 * @param answer Player's answer (true or false)
 * @returns Object with updated state and whether answer was correct
 */
export function submitLogicatAnswer(
  state: LogicatState,
  answer: boolean
): { state: LogicatState; correct: boolean; points: number } {
  if (!state.activePuzzle) {
    return { state, correct: false, points: 0 };
  }

  const correct = answer === state.activePuzzle.correctAnswer;
  const difficulty = state.activePuzzle.difficulty;

  // Calculate points based on difficulty and time remaining
  // Base: difficulty points, bonus for speed
  const timeBonus = Math.floor(state.timeRemaining / 5);
  const points = correct ? difficulty + timeBonus : 0;

  const newState: LogicatState = {
    ...state,
    activePuzzle: null,
    timeRemaining: 0,
    totalCorrect: state.totalCorrect + (correct ? 1 : 0),
    totalIncorrect: state.totalIncorrect + (correct ? 0 : 1),
    currentStreak: correct ? state.currentStreak + 1 : 0,
    bestStreak: correct
      ? Math.max(state.bestStreak, state.currentStreak + 1)
      : state.bestStreak,
  };

  return { state: newState, correct, points };
}

/**
 * Tick the puzzle timer (called each second).
 *
 * @param state Current logicat state
 * @returns Updated state with decremented timer
 */
export function tickLogicatTimer(state: LogicatState): LogicatState {
  if (!state.activePuzzle || state.timeRemaining <= 0) {
    return state;
  }

  const newTimeRemaining = state.timeRemaining - 1;

  // If time runs out, treat as incorrect
  if (newTimeRemaining <= 0) {
    return {
      ...state,
      activePuzzle: null,
      timeRemaining: 0,
      totalIncorrect: state.totalIncorrect + 1,
      currentStreak: 0,
    };
  }

  return {
    ...state,
    timeRemaining: newTimeRemaining,
  };
}

/**
 * Cancel the current puzzle (player chose not to solve it).
 *
 * @param state Current logicat state
 * @returns Updated state with cleared puzzle
 */
export function cancelLogicatPuzzle(state: LogicatState): LogicatState {
  return {
    ...state,
    activePuzzle: null,
    timeRemaining: 0,
    // No penalty for canceling
  };
}
