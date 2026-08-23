export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const ACCESS_TOKEN_KEY = "hba_access_token";

export const EXPERIENCE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

export const EXPERIENCE_LABELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  EXPERT: "Expert",
};

export const GAME_STATUS = {
  WAITING: "WAITING",
  TEAM_FORMING: "TEAM_FORMING",
  READY: "READY",
  RUNNING: "RUNNING",
  SUBMISSION: "SUBMISSION",
  EVALUATING: "EVALUATING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const GAME_STATUS_LABELS = {
  WAITING: "Waiting",
  TEAM_FORMING: "Forming Teams",
  READY: "Ready Check",
  RUNNING: "In Progress",
  SUBMISSION: "Submission Open",
  EVALUATING: "Evaluating",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const MATCH_PLAYERS_REQUIRED = 4;
export const MATCH_TEAM_SIZE = 2;
export const GAME_DURATION_MINUTES = 30;

// Mirrors backend src/config/gameModes.ts — kept in sync manually since the
// frontend needs these numbers before ever calling the API (to render the
// mode-selection cards and the "players required" copy on each entry page).
export const GAME_MODES = {
  BATTLE: { label: "Battle Arena", playersRequired: 4, teamSize: 2, durationMinutes: 30 },
  BUG_FIX: { label: "Bug Fixing Duel", playersRequired: 2, teamSize: 1, durationMinutes: 15 },
  PRACTICE: { label: "Solo Practice", playersRequired: 1, teamSize: 1, durationMinutes: 30 },
  FRIEND_CHALLENGE: { label: "Friend Challenge", playersRequired: 2, teamSize: 1, durationMinutes: 15 },
};

export const BADGES = [
  { code: "FIRST_WIN", name: "First Win", description: "Won your first hackathon battle." },
  { code: "FIVE_WINS", name: "Five-Time Champion", description: "Won five hackathon battles." },
  { code: "WIN_STREAK", name: "On Fire", description: "Won three games in a row." },
  { code: "SPEED_CODER", name: "Speed Coder", description: "Submitted with time to spare." },
  { code: "AI_MASTER", name: "AI Master", description: "Built an outstanding AI-powered feature." },
  { code: "TEAM_PLAYER", name: "Team Player", description: "Consistently high team collaboration." },
  { code: "HACKATHON_CHAMPION", name: "Hackathon Champion", description: "Reached double-digit wins." },
];

export const ERROR_MESSAGES = {
  GAME_ENDED: "This game has already ended.",
  ALREADY_IN_GAME: "You are already in another game.",
  NOT_MEMBER: "You are not a member of this game.",
  DEADLINE_PASSED: "The submission deadline has passed.",
  ALREADY_SUBMITTED: "Your team has already submitted a final solution.",
  ALREADY_QUEUED: "You are already searching for a match.",
  EMAIL_TAKEN: "An account with this email already exists.",
  UNAUTHORIZED: "You need to sign in to continue.",
  VALIDATION_ERROR: "Please check the highlighted fields.",
  SUBMISSIONS_CLOSED: "Submissions are not open for this game.",
  GAME_NOT_COMPLETED: "This game has not finished yet.",
  RATE_LIMITED: "Too many requests. Please slow down and try again.",
};
