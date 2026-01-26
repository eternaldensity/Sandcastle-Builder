import { describe, it, expect } from 'vitest';
import {
  generateLogicatPuzzle,
  createLogicatState,
  startLogicatPuzzle,
  submitLogicatAnswer,
  tickLogicatTimer,
  cancelLogicatPuzzle,
  type LogicatPuzzle,
  type LogicatState,
} from './logicat.js';

describe('Logicat Puzzle System', () => {
  describe('generateLogicatPuzzle', () => {
    it('should generate a puzzle with all required fields', () => {
      const puzzle = generateLogicatPuzzle(1);

      expect(puzzle).toHaveProperty('premises');
      expect(puzzle).toHaveProperty('question');
      expect(puzzle).toHaveProperty('correctAnswer');
      expect(puzzle).toHaveProperty('difficulty');
      expect(puzzle).toHaveProperty('timeLimit');

      expect(Array.isArray(puzzle.premises)).toBe(true);
      expect(puzzle.premises.length).toBeGreaterThan(0);
      expect(typeof puzzle.question).toBe('string');
      expect(typeof puzzle.correctAnswer).toBe('boolean');
      expect(puzzle.difficulty).toBeGreaterThanOrEqual(1);
      expect(puzzle.difficulty).toBeLessThanOrEqual(10);
      expect(puzzle.timeLimit).toBeGreaterThan(0);
    });

    it('should generate difficulty 1 puzzles for low logicat levels', () => {
      const puzzle = generateLogicatPuzzle(1);
      expect(puzzle.difficulty).toBe(1);
    });

    it('should scale difficulty with logicat level', () => {
      const puzzle1 = generateLogicatPuzzle(1);
      const puzzle5 = generateLogicatPuzzle(25);
      const puzzle10 = generateLogicatPuzzle(50);

      expect(puzzle1.difficulty).toBeLessThanOrEqual(puzzle5.difficulty);
      expect(puzzle5.difficulty).toBeLessThanOrEqual(puzzle10.difficulty);
    });

    it('should cap difficulty at 10', () => {
      const puzzle = generateLogicatPuzzle(1000);
      expect(puzzle.difficulty).toBe(10);
    });

    it('should reduce time limit with higher difficulty', () => {
      const puzzle1 = generateLogicatPuzzle(1);
      const puzzle10 = generateLogicatPuzzle(50);

      expect(puzzle10.timeLimit).toBeLessThan(puzzle1.timeLimit);
    });

    it('should generate different puzzles on multiple calls', () => {
      const puzzle1 = generateLogicatPuzzle(5);
      const puzzle2 = generateLogicatPuzzle(5);

      // Not guaranteed to be different, but very likely
      // Check if at least the question or first premise differs
      const isDifferent =
        puzzle1.question !== puzzle2.question ||
        puzzle1.premises[0] !== puzzle2.premises[0];

      // Run multiple times to increase probability of difference
      const puzzles = Array.from({ length: 10 }, () => generateLogicatPuzzle(5));
      const questions = puzzles.map((p) => p.question);
      const uniqueQuestions = new Set(questions);

      expect(uniqueQuestions.size).toBeGreaterThan(1);
    });

    it('should have valid correct answers', () => {
      // Generate many puzzles and check they all have boolean answers
      for (let i = 0; i < 20; i++) {
        const puzzle = generateLogicatPuzzle(Math.floor(Math.random() * 10) + 1);
        expect(typeof puzzle.correctAnswer).toBe('boolean');
      }
    });
  });

  describe('createLogicatState', () => {
    it('should create initial state with no active puzzle', () => {
      const state = createLogicatState();

      expect(state.activePuzzle).toBeNull();
      expect(state.timeRemaining).toBe(0);
      expect(state.totalCorrect).toBe(0);
      expect(state.totalIncorrect).toBe(0);
      expect(state.currentStreak).toBe(0);
      expect(state.bestStreak).toBe(0);
    });
  });

  describe('startLogicatPuzzle', () => {
    it('should start a puzzle with correct difficulty', () => {
      const state = createLogicatState();
      const newState = startLogicatPuzzle(state, 5);

      expect(newState.activePuzzle).not.toBeNull();
      expect(newState.timeRemaining).toBeGreaterThan(0);
      expect(newState.timeRemaining).toBe(newState.activePuzzle!.timeLimit);
    });

    it('should scale difficulty with logicat level', () => {
      const state = createLogicatState();
      const newState1 = startLogicatPuzzle(state, 1);
      const newState2 = startLogicatPuzzle(state, 25);

      expect(newState1.activePuzzle!.difficulty).toBeLessThanOrEqual(
        newState2.activePuzzle!.difficulty
      );
    });

    it('should preserve stats when starting new puzzle', () => {
      const state: LogicatState = {
        activePuzzle: null,
        timeRemaining: 0,
        totalCorrect: 10,
        totalIncorrect: 5,
        currentStreak: 3,
        bestStreak: 8,
      };

      const newState = startLogicatPuzzle(state, 5);

      expect(newState.totalCorrect).toBe(10);
      expect(newState.totalIncorrect).toBe(5);
      expect(newState.currentStreak).toBe(3);
      expect(newState.bestStreak).toBe(8);
    });
  });

  describe('submitLogicatAnswer', () => {
    it('should return correct result when answer is right', () => {
      const state = createLogicatState();
      const stateWithPuzzle = startLogicatPuzzle(state, 5);
      const correctAnswer = stateWithPuzzle.activePuzzle!.correctAnswer;

      const result = submitLogicatAnswer(stateWithPuzzle, correctAnswer);

      expect(result.correct).toBe(true);
      expect(result.points).toBeGreaterThan(0);
      expect(result.state.activePuzzle).toBeNull();
      expect(result.state.totalCorrect).toBe(1);
      expect(result.state.totalIncorrect).toBe(0);
      expect(result.state.currentStreak).toBe(1);
      expect(result.state.bestStreak).toBe(1);
    });

    it('should return incorrect result when answer is wrong', () => {
      const state = createLogicatState();
      const stateWithPuzzle = startLogicatPuzzle(state, 5);
      const wrongAnswer = !stateWithPuzzle.activePuzzle!.correctAnswer;

      const result = submitLogicatAnswer(stateWithPuzzle, wrongAnswer);

      expect(result.correct).toBe(false);
      expect(result.points).toBe(0);
      expect(result.state.activePuzzle).toBeNull();
      expect(result.state.totalCorrect).toBe(0);
      expect(result.state.totalIncorrect).toBe(1);
      expect(result.state.currentStreak).toBe(0);
      expect(result.state.bestStreak).toBe(0);
    });

    it('should build streak on consecutive correct answers', () => {
      let state = createLogicatState();

      // Answer 3 puzzles correctly
      for (let i = 0; i < 3; i++) {
        state = startLogicatPuzzle(state, 5);
        const correctAnswer = state.activePuzzle!.correctAnswer;
        const result = submitLogicatAnswer(state, correctAnswer);
        state = result.state;
      }

      expect(state.totalCorrect).toBe(3);
      expect(state.currentStreak).toBe(3);
      expect(state.bestStreak).toBe(3);
    });

    it('should reset streak on wrong answer', () => {
      let state = createLogicatState();

      // Answer 2 correctly, then 1 wrong
      for (let i = 0; i < 2; i++) {
        state = startLogicatPuzzle(state, 5);
        const correctAnswer = state.activePuzzle!.correctAnswer;
        const result = submitLogicatAnswer(state, correctAnswer);
        state = result.state;
      }

      state = startLogicatPuzzle(state, 5);
      const wrongAnswer = !state.activePuzzle!.correctAnswer;
      const result = submitLogicatAnswer(state, wrongAnswer);
      state = result.state;

      expect(state.totalCorrect).toBe(2);
      expect(state.totalIncorrect).toBe(1);
      expect(state.currentStreak).toBe(0);
      expect(state.bestStreak).toBe(2);
    });

    it('should award more points for higher difficulty', () => {
      const state1 = startLogicatPuzzle(createLogicatState(), 1);
      const state10 = startLogicatPuzzle(createLogicatState(), 50);

      const result1 = submitLogicatAnswer(state1, state1.activePuzzle!.correctAnswer);
      const result10 = submitLogicatAnswer(state10, state10.activePuzzle!.correctAnswer);

      expect(result10.points).toBeGreaterThan(result1.points);
    });

    it('should award bonus points for faster answers', () => {
      let state = startLogicatPuzzle(createLogicatState(), 5);
      const correctAnswer = state.activePuzzle!.correctAnswer;

      // Fast answer (no time elapsed)
      const fastResult = submitLogicatAnswer(state, correctAnswer);

      // Slow answer (tick timer down)
      state = startLogicatPuzzle(createLogicatState(), 5);
      for (let i = 0; i < 15; i++) {
        state = tickLogicatTimer(state);
      }
      const slowResult = submitLogicatAnswer(state, state.activePuzzle!.correctAnswer);

      expect(fastResult.points).toBeGreaterThan(slowResult.points);
    });

    it('should do nothing if no active puzzle', () => {
      const state = createLogicatState();
      const result = submitLogicatAnswer(state, true);

      expect(result.correct).toBe(false);
      expect(result.points).toBe(0);
      expect(result.state).toEqual(state);
    });
  });

  describe('tickLogicatTimer', () => {
    it('should decrement time remaining', () => {
      const state = startLogicatPuzzle(createLogicatState(), 5);
      const initialTime = state.timeRemaining;

      const newState = tickLogicatTimer(state);

      expect(newState.timeRemaining).toBe(initialTime - 1);
      expect(newState.activePuzzle).not.toBeNull();
    });

    it('should do nothing if no active puzzle', () => {
      const state = createLogicatState();
      const newState = tickLogicatTimer(state);

      expect(newState).toEqual(state);
    });

    it('should fail puzzle when time runs out', () => {
      let state = startLogicatPuzzle(createLogicatState(), 5);

      // Tick until time runs out
      while (state.timeRemaining > 0) {
        state = tickLogicatTimer(state);
      }

      expect(state.activePuzzle).toBeNull();
      expect(state.timeRemaining).toBe(0);
      expect(state.totalIncorrect).toBe(1);
      expect(state.currentStreak).toBe(0);
    });

    it('should not decrement below 0', () => {
      let state = startLogicatPuzzle(createLogicatState(), 5);

      // Tick many times
      for (let i = 0; i < 100; i++) {
        state = tickLogicatTimer(state);
      }

      expect(state.timeRemaining).toBe(0);
    });
  });

  describe('cancelLogicatPuzzle', () => {
    it('should clear active puzzle without penalty', () => {
      const state = startLogicatPuzzle(createLogicatState(), 5);
      const newState = cancelLogicatPuzzle(state);

      expect(newState.activePuzzle).toBeNull();
      expect(newState.timeRemaining).toBe(0);
      expect(newState.totalCorrect).toBe(0);
      expect(newState.totalIncorrect).toBe(0);
      expect(newState.currentStreak).toBe(0);
    });

    it('should preserve stats when canceling', () => {
      let state = createLogicatState();

      // Build up some stats
      for (let i = 0; i < 3; i++) {
        state = startLogicatPuzzle(state, 5);
        const result = submitLogicatAnswer(state, state.activePuzzle!.correctAnswer);
        state = result.state;
      }

      // Start and cancel a puzzle
      state = startLogicatPuzzle(state, 5);
      state = cancelLogicatPuzzle(state);

      expect(state.totalCorrect).toBe(3);
      expect(state.totalIncorrect).toBe(0);
      expect(state.bestStreak).toBe(3);
    });

    it('should do nothing if no active puzzle', () => {
      const state = createLogicatState();
      const newState = cancelLogicatPuzzle(state);

      expect(newState).toEqual(state);
    });
  });

  describe('Logicat integration scenarios', () => {
    it('should handle complete puzzle lifecycle', () => {
      // Start with initial state
      let state = createLogicatState();

      // Start a puzzle
      state = startLogicatPuzzle(state, 10);
      expect(state.activePuzzle).not.toBeNull();

      // Tick timer a few times
      const initialTime = state.timeRemaining;
      state = tickLogicatTimer(state);
      state = tickLogicatTimer(state);
      expect(state.timeRemaining).toBe(initialTime - 2);

      // Submit correct answer
      const correctAnswer = state.activePuzzle!.correctAnswer;
      const result = submitLogicatAnswer(state, correctAnswer);
      state = result.state;

      expect(result.correct).toBe(true);
      expect(state.activePuzzle).toBeNull();
      expect(state.totalCorrect).toBe(1);
      expect(state.currentStreak).toBe(1);
    });

    it('should handle timeout scenario', () => {
      let state = createLogicatState();
      state = startLogicatPuzzle(state, 5);

      // Let puzzle timeout
      while (state.timeRemaining > 0) {
        state = tickLogicatTimer(state);
      }

      expect(state.activePuzzle).toBeNull();
      expect(state.totalIncorrect).toBe(1);
      expect(state.currentStreak).toBe(0);
    });

    it('should handle streak building and breaking', () => {
      let state = createLogicatState();

      // Build a streak of 5
      for (let i = 0; i < 5; i++) {
        state = startLogicatPuzzle(state, 5);
        const result = submitLogicatAnswer(state, state.activePuzzle!.correctAnswer);
        state = result.state;
      }

      expect(state.currentStreak).toBe(5);
      expect(state.bestStreak).toBe(5);

      // Break the streak
      state = startLogicatPuzzle(state, 5);
      const wrongResult = submitLogicatAnswer(state, !state.activePuzzle!.correctAnswer);
      state = wrongResult.state;

      expect(state.currentStreak).toBe(0);
      expect(state.bestStreak).toBe(5); // Best streak preserved

      // Build a smaller streak
      for (let i = 0; i < 3; i++) {
        state = startLogicatPuzzle(state, 5);
        const result = submitLogicatAnswer(state, state.activePuzzle!.correctAnswer);
        state = result.state;
      }

      expect(state.currentStreak).toBe(3);
      expect(state.bestStreak).toBe(5); // Still the best
    });
  });
});
