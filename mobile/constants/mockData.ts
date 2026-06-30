import { MoodType } from './theme';

export interface JournalEntry {
  id: string;
  dayNumber: number;
  title: string;
  content: string;
  mood: MoodType;
  tags: string[];
  imageUrls: string[];
  location?: string;
  privacy: 'private' | 'friends' | 'public';
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  privacyDefault: 'private' | 'friends' | 'public';
  reminderTime: string;
  createdAt: string;
}

export type LevelStatus = 'completed' | 'active' | 'locked' | 'missed';

export interface LevelNode {
  dayNumber: number;
  status: LevelStatus;
  journal?: JournalEntry;
  date: string;
}

// --- Mock User ---
export const mockUser: UserProfile = {
  id: 'user-001',
  username: 'adventurer',
  email: 'adventurer@lifelevels.app',
  currentStreak: 12,
  longestStreak: 34,
  totalDays: 47,
  privacyDefault: 'private',
  reminderTime: '21:00',
  createdAt: '2025-01-15T10:00:00Z',
};

// --- Mock Journal Entries ---
export const mockJournals: JournalEntry[] = [
  {
    id: 'j-001',
    dayNumber: 1,
    title: 'The Beginning',
    content:
      "Today I decided to start documenting my life. Every single day. Not because I have to, but because I want to remember what it felt like to be here, right now. The air is cool, the coffee is warm, and I feel like something good is about to happen.",
    mood: 'excited',
    tags: ['beginning', 'motivation'],
    imageUrls: [],
    privacy: 'private',
    isComplete: true,
    createdAt: '2025-01-15T21:30:00Z',
    updatedAt: '2025-01-15T21:30:00Z',
  },
  {
    id: 'j-002',
    dayNumber: 2,
    title: 'Morning Clarity',
    content:
      "Woke up early for the first time in weeks. The sunrise was incredible - pink and gold stretching across the sky. Made breakfast, went for a walk, and felt genuinely peaceful. These small moments are what this journal is for.",
    mood: 'grateful',
    tags: ['morning', 'nature', 'peace'],
    imageUrls: [],
    privacy: 'private',
    isComplete: true,
    createdAt: '2025-01-16T08:15:00Z',
    updatedAt: '2025-01-16T08:15:00Z',
  },
  {
    id: 'j-003',
    dayNumber: 3,
    title: 'Hard conversations',
    content:
      "Had a tough conversation with an old friend today. We haven't talked in months and there was a lot unsaid. It went better than I expected. Sometimes the things you dread turn out to be the ones you needed most.",
    mood: 'neutral',
    tags: ['friends', 'growth'],
    imageUrls: [],
    privacy: 'private',
    isComplete: true,
    createdAt: '2025-01-17T22:00:00Z',
    updatedAt: '2025-01-17T22:00:00Z',
  },
  {
    id: 'j-004',
    dayNumber: 4,
    title: '',
    content:
      "Nothing special happened today and that's okay. Read a book, cooked dinner, watched the rain. Not every day needs to be extraordinary to be worth remembering.",
    mood: 'neutral',
    tags: ['routine', 'calm'],
    imageUrls: [],
    privacy: 'private',
    isComplete: true,
    createdAt: '2025-01-18T20:45:00Z',
    updatedAt: '2025-01-18T20:45:00Z',
  },
  {
    id: 'j-005',
    dayNumber: 5,
    title: 'Breakthrough at work',
    content:
      "Finally cracked the problem I've been stuck on for a week. The solution was embarrassingly simple once I saw it. Celebrated with tacos. Life is good.",
    mood: 'happy',
    tags: ['work', 'win', 'celebration'],
    imageUrls: [],
    privacy: 'friends',
    isComplete: true,
    createdAt: '2025-01-20T19:30:00Z',
    updatedAt: '2025-01-20T19:30:00Z',
  },
  {
    id: 'j-006',
    dayNumber: 6,
    title: 'Anxiety creeping in',
    content:
      "Couldn't sleep last night. Mind racing about the future - career, relationships, whether I'm doing enough. Writing it down helps. Getting it out of my head and onto a page makes it smaller somehow.",
    mood: 'anxious',
    tags: ['mental-health', 'reflection'],
    imageUrls: [],
    privacy: 'private',
    isComplete: true,
    createdAt: '2025-01-21T23:15:00Z',
    updatedAt: '2025-01-21T23:15:00Z',
  },
  {
    id: 'j-007',
    dayNumber: 7,
    title: 'One week done',
    content:
      "Seven days of journaling. A week of actually showing up for myself. Looking at the level map and seeing those seven glowing nodes feels incredible. It's such a small thing but it makes me want to keep going.",
    mood: 'excited',
    tags: ['milestone', 'streak', 'motivation'],
    imageUrls: [],
    privacy: 'public',
    isComplete: true,
    createdAt: '2025-01-22T21:00:00Z',
    updatedAt: '2025-01-22T21:00:00Z',
  },
];

// --- Mock Level Map ---
export const mockLevels: LevelNode[] = [
  ...mockJournals.map((j) => ({
    dayNumber: j.dayNumber,
    status: 'completed' as LevelStatus,
    journal: j,
    date: j.createdAt.split('T')[0],
  })),
  // Day 8 - missed
  { dayNumber: 8, status: 'missed' as LevelStatus, date: '2025-01-23' },
  // Days 9-47 - completed (summary nodes)
  ...Array.from({ length: 39 }, (_, i) => ({
    dayNumber: i + 9,
    status: 'completed' as LevelStatus,
    date: new Date(2025, 0, 24 + i).toISOString().split('T')[0],
  })),
  // Day 48 - today (active)
  { dayNumber: 48, status: 'active' as LevelStatus, date: '2025-03-05' },
  // Days 49-55 - locked
  ...Array.from({ length: 7 }, (_, i) => ({
    dayNumber: i + 49,
    status: 'locked' as LevelStatus,
    date: '',
  })),
];

// --- Onboarding slides ---
export const onboardingSlides = [
  {
    id: '1',
    title: 'Every Day is a Level',
    subtitle: 'Write your daily journal and watch your life unfold like a game - one level at a time.',
    icon: '🗺️',
  },
  {
    id: '2',
    title: 'Build Your Streak',
    subtitle: 'Show up daily. Level up consistently. See your progress on a beautiful winding path.',
    icon: '🔥',
  },
  {
    id: '3',
    title: 'Your Story, Your Map',
    subtitle: "Look back at every level you've unlocked - each one a memory worth keeping.",
    icon: '✨',
  },
];
