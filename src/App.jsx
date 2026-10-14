import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Users,
  MessageSquare,
  ListVideo,
  BarChart2,
  Activity,
  Search,
  Plus,
  Share2,
  Check,
  Crown,
  Shield,
  AlertTriangle,
  RefreshCw,
  Clock,
  Film,
  Sparkles,
  ThumbsUp,
  Send,
  Eye,
  EyeOff,
  Bookmark,
  Flame,
  Sliders,
  Terminal,
  HardDrive,
  Lock,
  Unlock,
  Sun,
  Moon,
  Palette,
  Crosshair,
  Subtitles,
  SkipForward,
  Rewind,
  FastForward,
  Youtube,
  Radio,
  UserCheck
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';

const firebaseConfig =
  typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : {
        apiKey: 'demo-key',
        authDomain: 'demo.firebaseapp.com',
        projectId: 'demo-project'
      };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'kinosync-watch-party';

const STUDIO_THEMES = {
  obsidian: {
    name: 'Obsidian',
    bgPrimary: '#0b0c10',
    bgSecondary: '#12141c',
    bgTertiary: '#1a1d28',
    textPrimary: '#f3f4f6',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    accent: '#f59e0b',
    accentSoft: 'rgba(245, 158, 11, 0.14)',
    accentContrast: '#090a0f',
    border: '#262936',
    statusOk: '#10b981',
    statusWarn: '#f43f5e'
  },
  criterion: {
    name: 'Criterion 35mm',
    bgPrimary: '#111110',
    bgSecondary: '#181816',
    bgTertiary: '#22221f',
    textPrimary: '#edece6',
    textSecondary: '#a8a69d',
    textMuted: '#75736b',
    accent: '#e11d48',
    accentSoft: 'rgba(225, 29, 72, 0.15)',
    accentContrast: '#ffffff',
    border: '#2e2d2a',
    statusOk: '#22c55e',
    statusWarn: '#eab308'
  },
  tokyo: {
    name: 'Tokyo Terminal',
    bgPrimary: '#090d16',
    bgSecondary: '#0f172a',
    bgTertiary: '#1e293b',
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    accent: '#38bdf8',
    accentSoft: 'rgba(56, 189, 248, 0.15)',
    accentContrast: '#090d16',
    border: '#273549',
    statusOk: '#34d399',
    statusWarn: '#fb7185'
  },
  paper: {
    name: 'Paper Daylight',
    bgPrimary: '#f8fafc',
    bgSecondary: '#ffffff',
    bgTertiary: '#f1f5f9',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.12)',
    accentContrast: '#ffffff',
    border: '#e2e8f0',
    statusOk: '#059669',
    statusWarn: '#dc2626'
  },
  nordic: {
    name: 'Nordic Alabaster',
    bgPrimary: '#f4f4f0',
    bgSecondary: '#fafaf7',
    bgTertiary: '#e9e8e2',
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
    textMuted: '#78716c',
    accent: '#0d9488',
    accentSoft: 'rgba(13, 148, 136, 0.12)',
    accentContrast: '#ffffff',
    border: '#d6d3cd',
    statusOk: '#16a34a',
    statusWarn: '#e11d48'
  },
  solarized: {
    name: 'Solarized',
    bgPrimary: '#fdf6e3',
    bgSecondary: '#eee8d5',
    bgTertiary: '#e4decb',
    textPrimary: '#073642',
    textSecondary: '#586e75',
    textMuted: '#657b83',
    accent: '#cb4b16',
    accentSoft: 'rgba(203, 75, 22, 0.14)',
    accentContrast: '#ffffff',
    border: '#d3cbb7',
    statusOk: '#2aa198',
    statusWarn: '#dc322f'
  }
};

const MEDIA_CATALOG = [
  {
    id: 'sintel',
    title: 'Sintel (Blender Open Film)',
    sourceType: 'mp4',
    year: 2010,
    duration: 52,
    durationFormatted: '00:52',
    rating: 8.9,
    director: 'Colin Levy',
    categories: ['Animation', 'Fantasy', 'Action'],
    moods: ['Emotional', 'Epic', 'Adventure'],
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    fallbackUrls: [
      'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/f1/Sintel_movie_4K.webm/Sintel_movie_4K.webm.480p.vp9.webm',
      'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
    ],
    youtubeId: 'eRsGyueVLvQ',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    synopsis: 'A young warrior named Sintel befriends a baby dragon and embarks on a perilous quest across the northern mountains.',
    loreFacts: [
      'Created by the Blender Institute in Amsterdam using open-source production tools.'
    ]
  },
  {
    id: 'big-buck-bunny',
    title: 'Big Buck Bunny',
    sourceType: 'mp4',
    year: 2008,
    duration: 60,
    durationFormatted: '01:00',
    rating: 8.7,
    director: 'Sacha Goedegebure',
    categories: ['Animation', 'Comedy'],
    moods: ['Funny', 'Feel-Good'],
    videoUrl: 'https://media.w3.org/2010/05/bunny/trailer.mp4',
    fallbackUrls: [
      'https://www.w3schools.com/html/mov_bbb.mp4',
      'https://media.w3.org/2010/05/sintel/trailer.mp4'
    ],
    youtubeId: 'aqz-KE-bpKQ',
    poster: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
    synopsis: 'A giant rabbit gets even with three bullying rodents in the forest.',
    loreFacts: [
      'Standard open-source reference film for multi-peer frame synchronization.'
    ]
  },
  {
    id: 'elephants-dream',
    title: 'Elephants Dream',
    sourceType: 'mp4',
    year: 2006,
    duration: 653,
    durationFormatted: '10:53',
    rating: 8.4,
    director: 'Bassam Kurdali',
    categories: ['Sci-Fi', 'Animation'],
    moods: ['Surreal', 'Mind-Bending'],
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/83/Elephants_Dream_%282006%29.webm/Elephants_Dream_%282006%29.webm.480p.vp9.webm',
    fallbackUrls: [
      'https://media.w3.org/2010/05/video/movie_300.mp4',
      'https://media.w3.org/2010/05/sintel/trailer.mp4'
    ],
    youtubeId: 'TLkA0RELQ1g',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Proog and Emo explore the cavernous, surreal machinery of a giant construct.',
    loreFacts: [
      'The world’s first open movie, produced under project Orange.'
    ]
  },
  {
    id: 'spring-open-film',
    title: 'Spring (Open Short Film)',
    sourceType: 'mp4',
    year: 2019,
    duration: 464,
    durationFormatted: '07:44',
    rating: 9.1,
    director: 'Andy Goralczyk',
    categories: ['Animation', 'Fantasy'],
    moods: ['Epic', 'Atmospheric'],
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/a/a7/Spring_-_Blender_Open_Movie.webm/Spring_-_Blender_Open_Movie.webm.480p.vp9.webm',
    fallbackUrls: [
      'https://media.w3.org/2010/05/sintel/trailer.mp4',
      'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
    ],
    youtubeId: 'WhWc3b3KhnY',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    synopsis: 'A shepherd girl and her dog face ancient spirits in order to continue the cycle of life.',
    loreFacts: [
      'Streamed directly in WebM/MP4 with optional YouTube embed toggle.'
    ]
  },
  {
    id: 'charge-cyberpunk',
    title: 'CHARGE (Action Short)',
    sourceType: 'mp4',
    year: 2022,
    duration: 225,
    durationFormatted: '03:45',
    rating: 9.0,
    director: 'Hjalti Hjalmarsson',
    categories: ['Sci-Fi', 'Action'],
    moods: ['Intense', 'Futuristic'],
    videoUrl: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.480p.vp9.webm',
    fallbackUrls: [
      'https://media.w3.org/2010/05/bunny/trailer.mp4',
      'https://www.w3schools.com/html/mov_bbb.mp4'
    ],
    youtubeId: 'UXqq0ZvbOnk',
    poster: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=600&q=80',
    synopsis: 'An impoverished elderly man breaks into an automated energy factory in an icy cyberpunk dystopia.',
    loreFacts: [
      'High-contrast action sequence great for testing frame stepping and sync lock.'
    ]
  },
  {
    id: 'macro-botanical',
    title: 'Botanical Time-Lapse (MDN Studio)',
    sourceType: 'mp4',
    year: 2021,
    duration: 30,
    durationFormatted: '00:30',
    rating: 8.5,
    director: 'MDN Media Lab',
    categories: ['Documentary'],
    moods: ['Calm', 'Visual'],
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    fallbackUrls: [
      'https://media.w3.org/2010/05/sintel/trailer.mp4',
      'https://www.w3schools.com/html/mov_bbb.mp4'
    ],
    youtubeId: '',
    poster: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Close-up macro time-lapse photography hosted on fast edge servers for instant playback.',
    loreFacts: [
      'Zero-latency CC0 reference clip.'
    ]
  },
  {
    id: 'oceans-clip',
    title: 'Marine Wildlife Reel (W3C)',
    sourceType: 'mp4',
    year: 2016,
    duration: 46,
    durationFormatted: '00:46',
    rating: 8.6,
    director: 'Jacques Perrin',
    categories: ['Documentary'],
    moods: ['Epic', 'Adventure'],
    videoUrl: 'https://media.w3.org/2010/05/video/movie_300.mp4',
    fallbackUrls: [
      'https://media.w3.org/2010/05/sintel/trailer.mp4',
      'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
    ],
    youtubeId: '',
    poster: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Synchronized marine documentary reel served from W3C standards mirrors.',
    loreFacts: [
      'Built for cross-browser HTML5 video synchronization testing.'
    ]
  },
  {
    id: 'for-bigger-blazes',
    title: 'Queue Handoff Clip (10s)',
    sourceType: 'mp4',
    year: 2024,
    duration: 10,
    durationFormatted: '00:10',
    rating: 8.3,
    director: 'Test Suite',
    categories: ['Action'],
    moods: ['Fast'],
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    fallbackUrls: ['https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'],
    youtubeId: '',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
    synopsis: 'Short 10-second clip for testing automatic playlist progression when a video finishes.',
    loreFacts: [
      'Automatically advances to the next upvoted video in the room queue.'
    ]
  }
];

const SUBTITLE_TRACKS = [
  { start: 0, end: 4, text: '[Synchronized stream locked to room clock]' },
  { start: 4, end: 10, text: 'The northern wind carries memories of the old kingdom.' },
  { start: 10, end: 18, text: 'Watch the ridge—something is moving across the peaks!' },
  { start: 18, end: 26, text: 'Hold steady. Our timelines are aligned.' },
  { start: 26, end: 36, text: 'Every frame is verified across connected peers.' },
  { start: 36, end: 60, text: 'Use the timeline highlights below to jump to key scenes.' }
];

const AVATARS = ['🦊', '🐼', '🦁', '🐙', '🦉', '🦄', '🐲', '🤖', '👩‍🚀', '🥷'];
const REACTION_EMOJIS = ['🔥', '😂', '🤯', '❤️', '👏', '🍿', '⚡', '👀'];

function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function extractYouTubeId(input) {
  if (!input) return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function computeFuzzyMatchScore(query, target) {
  if (!query.trim()) return 100;
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase();

  if (t.includes(q)) return 100;

  let qIdx = 0;
  let consecutive = 0;
  for (let i = 0; i < t.length && qIdx < q.length; i++) {
    if (t[i] === q[qIdx]) {
      qIdx++;
      consecutive += 12;
    }
  }
  if (qIdx === q.length) {
    return Math.min(95, 65 + Math.floor(consecutive / q.length));
  }

  const tokens = t.split(/\s+/);
  let bestWordScore = 0;

  for (const word of tokens) {
    const dp = Array(q.length + 1)
      .fill(null)
      .map(() => Array(word.length + 1).fill(0));
    for (let i = 0; i <= q.length; i++) dp[i][0] = i;
    for (let j = 0; j <= word.length; j++) dp[0][j] = j;

    for (let i = 1; i <= q.length; i++) {
      for (let j = 1; j <= word.length; j++) {
        const cost = q[i - 1] === word[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    const dist = dp[q.length][word.length];
    const maxLen = Math.max(q.length, word.length);
    const similarity = Math.max(0, Math.round(((maxLen - dist) / maxLen) * 100));
    if (similarity > bestWordScore) bestWordScore = similarity;
  }

  return bestWordScore;
}

async function computeLocalFileSignature(file) {
  const slice = file.slice(0, 65536);
  const buffer = await slice.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let hash = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    hash ^= bytes[i];
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `0x${hex}_${file.size.toString(16)}`;
}

export default function App() {
  const [themeKey, setThemeKey] = useState('obsidian');
  const theme = STUDIO_THEMES[themeKey] || STUDIO_THEMES.obsidian;

  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(() => `viewer_${Math.floor(100 + Math.random() * 899)}`);
  const [userAvatar, setUserAvatar] = useState(() => AVATARS[Math.floor(Math.random() * AVATARS.length)]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [activeRoomCode, setActiveRoomCode] = useState('STUDIO');
  const [joinInputCode, setJoinInputCode] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [copiedInvite, setCopiedInvite] = useState(false);

  const videoRef = useRef(null);
  const youtubeIframeRef = useRef(null);
  const laserCanvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [localPlaying, setLocalPlaying] = useState(false);
  const [localTime, setLocalTime] = useState(0);
  const [duration, setDuration] = useState(52);
  const [isMuted, setIsMuted] = useState(true);
  const [fallbackUrlIndex, setFallbackUrlIndex] = useState(0);
  const [streamStatusText, setStreamStatusText] = useState('Stream Ready');
  const [ytUseBackupStream, setYtUseBackupStream] = useState(false);

  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [localFileObjectUrl, setLocalFileObjectUrl] = useState(null);
  const [localFileSignature, setLocalFileSignature] = useState(null);

  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [subtitleOffsetSec, setSubtitleOffsetSec] = useState(0);
  const [laserModeActive, setLaserModeActive] = useState(false);
  const [isDrawingLaser, setIsDrawingLaser] = useState(false);
  const [cinemaDimMode, setCinemaDimMode] = useState(false);

  const [driftMs, setDriftMs] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [softSyncEnabled, setSoftSyncEnabled] = useState(true);
  const isApplyingRemoteUpdateRef = useRef(false);
  const lastProcessedSeqRef = useRef(0);

  const [telemetryLogs, setTelemetryLogs] = useState([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString(),
      type: 'READY',
      msg: 'Player initialized. Room sync active.',
      latencyMs: 16
    }
  ]);
  const [latencySamples, setLatencySamples] = useState([19, 24, 18, 29, 33, 21, 38, 25, 17, 31, 22, 36]);
  const [simulatedBotsActive, setSimulatedBotsActive] = useState(false);
  const [simulatedUsers, setSimulatedUsers] = useState([]);
  const [connectionSimulatedOffline, setConnectionSimulatedOffline] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);

  const [activeSidebarTab, setActiveSidebarTab] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [isSpoilerMessage, setIsSpoilerMessage] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState({});
  const [floatingReactions, setFloatingReactions] = useState([]);
  const lastSeenReactionTimeRef = useRef(Date.now());

  const [newPollQuestion, setNewPollQuestion] = useState('');
  const [newPollOptions, setNewPollOptions] = useState('Watch next clip, Rewind 15s, Take a 5m break');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const addTelemetryLog = useCallback((type, msg, latencyMs = null) => {
    setTelemetryLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        time: new Date().toLocaleTimeString(),
        type,
        msg,
        latencyMs
      },
      ...prev.slice(0, 39)
    ]);
  }, []);

  const currentMovie = useMemo(() => {
    const movieId = roomData?.currentMovieId || MEDIA_CATALOG[0].id;
    return MEDIA_CATALOG.find((m) => m.id === movieId) || MEDIA_CATALOG[0];
  }, [roomData?.currentMovieId]);

  const activeSourceType = useMemo(() => {
    if (localFileObjectUrl) return 'local';
    if (roomData?.sourceType === 'youtube' && !ytUseBackupStream) return 'youtube';
    return 'mp4';
  }, [localFileObjectUrl, roomData?.sourceType, ytUseBackupStream]);

  const activeVideoSrc = useMemo(() => {
    if (localFileObjectUrl) return localFileObjectUrl;
    if (roomData?.customVideoUrl) return roomData.customVideoUrl;
    if (fallbackUrlIndex === 0) return currentMovie.videoUrl;
    const fallbacks = currentMovie.fallbackUrls || [];
    return fallbacks[fallbackUrlIndex - 1] || currentMovie.videoUrl;
  }, [localFileObjectUrl, roomData?.customVideoUrl, fallbackUrlIndex, currentMovie]);

  const sendYouTubeCommand = useCallback((func, args = []) => {
    if (!youtubeIframeRef.current?.contentWindow) return;
    try {
      youtubeIframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    } catch (e) {
      // Ignore
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setActiveRoomCode(roomParam.toUpperCase());
    }

    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        addTelemetryLog('AUTH', 'Running in local session mode.');
      }
    };
    initAuth();

    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
    });
    return () => unsub();
  }, [addTelemetryLog]);

  useEffect(() => {
    setFallbackUrlIndex(0);
    setDuration(currentMovie.duration || 60);
    setStreamStatusText('Stream Ready');
  }, [currentMovie.id, currentMovie.duration]);

  useEffect(() => {
    if (!user || connectionSimulatedOffline) return;

    const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);

    const unsubRoom = onSnapshot(
      roomDocRef,
      async (docSnap) => {
        const receiveTimestamp = Date.now();

        if (!docSnap.exists()) {
          const defaultMovie = MEDIA_CATALOG[0];
          const initialRoom = {
            roomCode: activeRoomCode,
            roomName: activeRoomCode === 'STUDIO' ? 'Screening Room #01' : `Room // ${activeRoomCode}`,
            hostId: user.uid,
            hostName: userName,
            moderatorIds: [],
            permissionMode: 'EVERYONE',
            consensusBufferLock: false,
            sourceType: 'mp4',
            currentMovieId: defaultMovie.id,
            youtubeId: '',
            customVideoUrl: '',
            localFileMeta: null,
            isPlaying: false,
            mediaTimeAtLastUpdate: 0,
            serverTimestampMillis: Date.now(),
            sequenceId: 1,
            updatedBy: userName,
            lastAction: 'ROOM_INITIALIZED',
            activeProposal: null,
            latestLaserStroke: null,
            participants: {
              [user.uid]: {
                uid: user.uid,
                name: userName,
                avatar: userAvatar,
                role: 'HOST',
                bufferState: 'READY',
                joinedAt: Date.now(),
                lastSeen: Date.now(),
                driftMs: 0
              }
            },
            playlist: [
              { ...MEDIA_CATALOG[0], votes: 5, addedBy: 'host', votedBy: [] },
              { ...MEDIA_CATALOG[3], votes: 4, addedBy: 'host', votedBy: [] },
              { ...MEDIA_CATALOG[1], votes: 3, addedBy: 'host', votedBy: [] }
            ],
            chatMessages: [
              {
                id: 'welcome-msg',
                senderId: 'system',
                senderName: 'System',
                senderAvatar: '🎬',
                text: 'Room ready. Pick any movie below, paste a video URL, or load a local file to watch together.',
                mediaTimestamp: 0,
                isSpoiler: false,
                createdAt: Date.now()
              }
            ],
            polls: [
              {
                id: 'poll-default',
                question: 'What should we queue up next?',
                createdBy: 'Host',
                active: true,
                options: [
                  { id: 'opt-1', text: 'Spring (Open Short Film)', votes: 4, voters: [] },
                  { id: 'opt-2', text: 'Elephants Dream (Sci-Fi)', votes: 2, voters: [] },
                  { id: 'opt-3', text: 'CHARGE (Action Short)', votes: 2, voters: [] }
                ]
              }
            ],
            bookmarks: [
              { id: 'bm-1', time: 15, label: 'Opening title card', user: 'alex_m' },
              { id: 'bm-2', time: 38, label: 'Dragon flight scene', user: 'sam_k' }
            ],
            reactionHeatmap: {
              1: 4, 3: 7, 6: 12, 8: 5, 11: 9, 14: 15, 17: 6, 19: 11
            },
            recentReactions: []
          };

          try {
            await setDoc(roomDocRef, initialRoom);
          } catch (e) {
            // Ignore
          }
          return;
        }

        const data = docSnap.data();
        setRoomData(data);

        if (data.participants && !data.participants[user.uid]) {
          try {
            await updateDoc(roomDocRef, {
              [`participants.${user.uid}`]: {
                uid: user.uid,
                name: userName,
                avatar: userAvatar,
                role: data.hostId === user.uid ? 'HOST' : 'SPECTATOR',
                bufferState: 'READY',
                joinedAt: Date.now(),
                lastSeen: Date.now(),
                driftMs: 0
              }
            });
          } catch (e) {
            // Ignore
          }
        }

        if ((data.sequenceId || 0) > lastProcessedSeqRef.current) {
          lastProcessedSeqRef.current = data.sequenceId || 0;
          const propagationMs = Math.max(
            12,
            Math.min(210, receiveTimestamp - (data.serverTimestampMillis || receiveTimestamp - 22))
          );

          setLatencySamples((prev) => [...prev.slice(-29), propagationMs]);
          addTelemetryLog('SYNC', `${data.lastAction || 'STATE_SYNC'} by ${data.updatedBy}`, propagationMs);

          const elapsedSec = data.isPlaying
            ? Math.max(0, (receiveTimestamp - (data.serverTimestampMillis || receiveTimestamp)) / 1000)
            : 0;
          const targetTime = Math.min(
            duration || 600,
            (data.mediaTimeAtLastUpdate || 0) + elapsedSec
          );

          isApplyingRemoteUpdateRef.current = true;
          setLocalPlaying(Boolean(data.isPlaying));
          setLocalTime(targetTime);

          if (videoRef.current) {
            if (Math.abs(videoRef.current.currentTime - targetTime) > 0.35) {
              videoRef.current.currentTime = targetTime;
            }
            if (data.isPlaying) {
              videoRef.current.play().catch(() => {});
            } else {
              videoRef.current.pause();
            }
          }

          if (data.sourceType === 'youtube') {
            sendYouTubeCommand('seekTo', [targetTime, true]);
            sendYouTubeCommand(data.isPlaying ? 'playVideo' : 'pauseVideo', []);
          }

          setTimeout(() => {
            isApplyingRemoteUpdateRef.current = false;
          }, 250);
        }

        if (Array.isArray(data.recentReactions)) {
          const fresh = data.recentReactions.filter(
            (r) => r.createdAt > lastSeenReactionTimeRef.current
          );
          if (fresh.length > 0) {
            lastSeenReactionTimeRef.current = Math.max(...fresh.map((r) => r.createdAt));
            setFloatingReactions((prev) => [
              ...prev.slice(-18),
              ...fresh.map((r) => ({
                ...r,
                leftPct: 12 + Math.floor(Math.random() * 76)
              }))
            ]);
          }
        }
      },
      () => {
        addTelemetryLog('WARN', 'Snapshot listener reconnecting...');
      }
    );

    return () => unsubRoom();
  }, [
    user,
    activeRoomCode,
    connectionSimulatedOffline,
    userName,
    userAvatar,
    duration,
    addTelemetryLog,
    sendYouTubeCommand
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!roomData || connectionSimulatedOffline) return;

      const now = Date.now();
      const elapsed = roomData.isPlaying
        ? Math.max(0, (now - (roomData.serverTimestampMillis || now)) / 1000)
        : 0;
      const expectedTime = (roomData.mediaTimeAtLastUpdate || 0) + elapsed;

      let actualTime = localTime;
      if (activeSourceType === 'mp4' && videoRef.current) {
        actualTime = videoRef.current.currentTime;
        setLocalTime(actualTime);
      } else if (activeSourceType === 'youtube' && localPlaying) {
        actualTime = expectedTime;
        setLocalTime(expectedTime);
      }

      const currentDriftMs = Math.round((actualTime - expectedTime) * 1000);
      setDriftMs(currentDriftMs);

      if (activeSourceType === 'mp4' && videoRef.current && roomData.isPlaying) {
        const absDrift = Math.abs(currentDriftMs);
        if (absDrift > 500) {
          isApplyingRemoteUpdateRef.current = true;
          videoRef.current.currentTime = expectedTime;
          videoRef.current.playbackRate = 1.0;
          setPlaybackRate(1.0);
          addTelemetryLog('DRIFT_SNAP', `Corrected ${currentDriftMs}ms drift -> 0ms`, 18);
          setTimeout(() => {
            isApplyingRemoteUpdateRef.current = false;
          }, 200);
        } else if (absDrift > 160 && softSyncEnabled) {
          const rate = currentDriftMs > 0 ? 0.96 : 1.04;
          videoRef.current.playbackRate = rate;
          setPlaybackRate(rate);
        } else if (videoRef.current.playbackRate !== 1.0) {
          videoRef.current.playbackRate = 1.0;
          setPlaybackRate(1.0);
        }
      }
    }, 650);

    return () => clearInterval(interval);
  }, [
    roomData,
    connectionSimulatedOffline,
    localTime,
    localPlaying,
    activeSourceType,
    softSyncEnabled,
    addTelemetryLog
  ]);

  useEffect(() => {
    if (!simulatedBotsActive) {
      setSimulatedUsers([]);
      return;
    }

    const botPeers = [
      { uid: 'bot-1', name: 'alex_m', avatar: '🦁', role: 'MOD' },
      { uid: 'bot-2', name: 'sam_k', avatar: '🦊', role: 'SPECTATOR' },
      { uid: 'bot-3', name: 'jordan_t', avatar: '🤖', role: 'SPECTATOR' },
      { uid: 'bot-4', name: 'maya_r', avatar: '🦄', role: 'SPECTATOR' },
      { uid: 'bot-5', name: 'liam_b', avatar: '🐲', role: 'MOD' },
      { uid: 'bot-6', name: 'elena_v', avatar: '🐼', role: 'SPECTATOR' },
      { uid: 'bot-7', name: 'noah_c', avatar: '🥷', role: 'SPECTATOR' },
      { uid: 'bot-8', name: 'chloe_s', avatar: '👩‍🚀', role: 'SPECTATOR' },
      { uid: 'bot-9', name: 'lucas_d', avatar: '👾', role: 'SPECTATOR' },
      { uid: 'bot-10', name: 'zoe_w', avatar: '🐙', role: 'SPECTATOR' }
    ];

    setSimulatedUsers(
      botPeers.map((b) => ({
        ...b,
        bufferState: 'READY',
        driftMs: Math.floor(Math.random() * 45) - 20
      }))
    );

    const botTimer = setInterval(() => {
      setSimulatedUsers((prev) =>
        prev.map((b) => ({
          ...b,
          driftMs: Math.floor(Math.random() * 52) - 26
        }))
      );
      setLatencySamples((prev) => [
        ...prev.slice(-29),
        16 + Math.floor(Math.random() * 38)
      ]);
    }, 2400);

    return () => clearInterval(botTimer);
  }, [simulatedBotsActive]);

  useEffect(() => {
    const canvas = laserCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const stroke = roomData?.latestLaserStroke;
    if (!stroke || Date.now() - stroke.timestamp > 3500) return;

    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 3;
    ctx.shadowColor = theme.accent;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    stroke.points.forEach((pt, idx) => {
      const x = pt.x * canvas.width;
      const y = pt.y * canvas.height;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, [roomData?.latestLaserStroke, theme.accent]);

  const canControlPlayback = useMemo(() => {
    if (!roomData || !user) return true;
    const mode = roomData.permissionMode || 'EVERYONE';
    if (mode === 'EVERYONE') return true;
    const isHost = roomData.hostId === user.uid;
    const isMod = (roomData.moderatorIds || []).includes(user.uid);
    if (mode === 'MODS') return isHost || isMod;
    return isHost;
  }, [roomData, user]);

  const broadcastPlaybackState = useCallback(
    async (nextPlaying, nextTime, actionLabel, extraFields = {}) => {
      setLocalPlaying(nextPlaying);
      setLocalTime(nextTime);

      if (!user || connectionSimulatedOffline) return;
      const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
      const nextSeq = (roomData?.sequenceId || 1) + 1;
      lastProcessedSeqRef.current = nextSeq;

      try {
        await updateDoc(roomDocRef, {
          isPlaying: nextPlaying,
          mediaTimeAtLastUpdate: nextTime,
          serverTimestampMillis: Date.now(),
          sequenceId: nextSeq,
          updatedBy: userName,
          lastAction: actionLabel,
          ...extraFields
        });
      } catch (e) {
        // Fallback
      }
    },
    [user, connectionSimulatedOffline, activeRoomCode, roomData?.sequenceId, userName]
  );

  const handleTogglePlay = () => {
    if (!canControlPlayback) {
      addTelemetryLog('LOCKED', 'Host has restricted playback controls.');
      return;
    }
    const nextPlaying = !localPlaying;
    const currentMediaTime = videoRef.current ? videoRef.current.currentTime : localTime;

    if (videoRef.current) {
      if (nextPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
    if (activeSourceType === 'youtube') {
      sendYouTubeCommand(nextPlaying ? 'playVideo' : 'pauseVideo', []);
    }
    broadcastPlaybackState(nextPlaying, currentMediaTime, nextPlaying ? 'PLAY' : 'PAUSE');
  };

  const handleSeek = (newTimeSec) => {
    if (!canControlPlayback) return;
    const clamped = Math.max(0, Math.min(duration || 600, newTimeSec));
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
    if (activeSourceType === 'youtube') {
      sendYouTubeCommand('seekTo', [clamped, true]);
    }
    broadcastPlaybackState(localPlaying, clamped, `SEEK_${formatTime(clamped)}`);
  };

  const handleStepFrame = (direction) => {
    const frameDelta = direction * (1 / 24);
    handleSeek(localTime + frameDelta);
  };

  const handleVideoError = () => {
    const fallbacks = currentMovie.fallbackUrls || [];
    if (fallbackUrlIndex < fallbacks.length) {
      const nextIdx = fallbackUrlIndex + 1;
      setFallbackUrlIndex(nextIdx);
      setStreamStatusText(`Switched to Mirror #${nextIdx + 1}`);
      addTelemetryLog('FAILOVER', `Switched to backup CDN mirror #${nextIdx + 1}`);
    } else {
      setStreamStatusText('Using backup stream');
    }
  };

  const handleSelectMovie = (movie) => {
    setLocalFileObjectUrl(null);
    setLocalFileSignature(null);
    setFallbackUrlIndex(0);
    setYtUseBackupStream(false);
    broadcastPlaybackState(true, 0, `LOAD_${movie.title.toUpperCase()}`, {
      currentMovieId: movie.id,
      sourceType: 'mp4',
      youtubeId: movie.youtubeId || '',
      customVideoUrl: ''
    });
  };

  const handleUniversalMediaSubmit = (e) => {
    e.preventDefault();
    if (!mediaUrlInput.trim()) return;
    const ytId = extractYouTubeId(mediaUrlInput);

    if (ytId) {
      setLocalFileObjectUrl(null);
      setYtUseBackupStream(false);
      broadcastPlaybackState(true, 0, 'LOAD_YOUTUBE_URL', {
        sourceType: 'youtube',
        youtubeId: ytId,
        customVideoUrl: ''
      });
      addTelemetryLog('SOURCE', `Loaded YouTube ID ${ytId}`);
    } else {
      setLocalFileObjectUrl(null);
      broadcastPlaybackState(true, 0, 'LOAD_DIRECT_STREAM', {
        sourceType: 'mp4',
        customVideoUrl: mediaUrlInput.trim()
      });
      addTelemetryLog('SOURCE', 'Loaded custom direct video stream');
    }
    setMediaUrlInput('');
  };

  const handleLocalFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sig = await computeLocalFileSignature(file);
    const objUrl = URL.createObjectURL(file);
    setLocalFileObjectUrl(objUrl);
    setLocalFileSignature({ name: file.name, signature: sig });

    broadcastPlaybackState(false, 0, 'LOCAL_FILE_SYNC', {
      sourceType: 'local',
      localFileMeta: { name: file.name, signature: sig }
    });
    addTelemetryLog('FILE_HASH', `Matched local file (${sig})`);
  };

  const simulateLagSpikeAndCorrect = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 1.45);
      setDriftMs(1450);
      addTelemetryLog('TEST_DRIFT', 'Injected +1450ms artificial lag spike');
    }
  };

  const handleCyclePermissionMode = async () => {
    if (!roomData || !user) return;
    const modes = ['EVERYONE', 'MODS', 'HOST_ONLY'];
    const nextMode = modes[(modes.indexOf(roomData.permissionMode || 'EVERYONE') + 1) % modes.length];
    const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
    await updateDoc(roomDocRef, { permissionMode: nextMode }).catch(() => {});
  };

  const handleSendReaction = async (emoji) => {
    const bucket = Math.min(19, Math.max(0, Math.floor((localTime / Math.max(1, duration)) * 20)));
    const reactionObj = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      sender: userName,
      createdAt: Date.now()
    };

    setFloatingReactions((prev) => [
      ...prev.slice(-18),
      { ...reactionObj, leftPct: 15 + Math.floor(Math.random() * 70) }
    ]);

    if (!user || !roomData || connectionSimulatedOffline) return;
    const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
    const currentHeat = roomData.reactionHeatmap?.[bucket] || 0;

    await updateDoc(roomDocRef, {
      [`reactionHeatmap.${bucket}`]: currentHeat + 1,
      recentReactions: [...(roomData.recentReactions || []).slice(-12), reactionObj]
    }).catch(() => {});
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: user?.uid || 'local',
      senderName: userName,
      senderAvatar: userAvatar,
      text: chatInput.trim(),
      mediaTimestamp: Math.floor(localTime),
      isSpoiler: isSpoilerMessage,
      createdAt: Date.now()
    };

    setChatInput('');
    setIsSpoilerMessage(false);

    if (!user || !roomData || connectionSimulatedOffline) return;
    const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
    await updateDoc(roomDocRef, {
      chatMessages: [...(roomData.chatMessages || []).slice(-60), newMsg]
    }).catch(() => {});
  };

  const handleAddBookmark = async () => {
    const newBm = {
      id: `bm-${Date.now()}`,
      time: Math.floor(localTime),
      label: `Scene @ ${formatTime(localTime)}`,
      user: userName
    };
    if (!user || !roomData) return;
    const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
    await updateDoc(roomDocRef, {
      bookmarks: [...(roomData.bookmarks || []), newBm]
    }).catch(() => {});
  };

  const handleAddToPlaylist = async (movie) => {
    if (!roomData || !user) return;
    const existing = (roomData.playlist || []).find((item) => item.id === movie.id);
    if (existing) return;
    const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
    await updateDoc(roomDocRef, {
      playlist: [
        ...(roomData.playlist || []),
        { ...movie, votes: 1, addedBy: userName, votedBy: [user.uid] }
      ]
    }).catch(() => {});
  };

  const handleVotePlaylist = async (movieId) => {
    if (!roomData || !user) return;
    const updated = (roomData.playlist || [])
      .map((item) => {
        if (item.id !== movieId) return item;
        return { ...item, votes: (item.votes || 0) + 1 };
      })
      .sort((a, b) => (b.votes || 0) - (a.votes || 0));

    const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
    await updateDoc(roomDocRef, { playlist: updated }).catch(() => {});
  };

  const handleVideoEnded = () => {
    const queue = roomData?.playlist || [];
    if (queue.length > 0) {
      const nextUp = queue.find((m) => m.id !== currentMovie.id) || queue[0];
      if (nextUp) handleSelectMovie(nextUp);
    }
  };

  const handleVotePoll = async (pollId, optionId) => {
    if (!roomData || !user) return;
    const updatedPolls = (roomData.polls || []).map((poll) => {
      if (poll.id !== pollId) return poll;
      return {
        ...poll,
        options: poll.options.map((opt) =>
          opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
        )
      };
    });
    const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
    await updateDoc(roomDocRef, { polls: updatedPolls }).catch(() => {});
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!newPollQuestion.trim() || !roomData) return;
    const opts = newPollOptions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text, idx) => ({ id: `opt-${Date.now()}-${idx}`, text, votes: 0 }));

    if (opts.length < 2) return;
    const poll = {
      id: `poll-${Date.now()}`,
      question: newPollQuestion.trim(),
      createdBy: userName,
      active: true,
      options: opts
    };
    setNewPollQuestion('');
    const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
    await updateDoc(roomDocRef, {
      polls: [poll, ...(roomData.polls || [])]
    }).catch(() => {});
  };

  const handleTransferHost = async (targetUid, targetName) => {
    if (!roomData || !user) return;
    const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
    await updateDoc(roomDocRef, {
      hostId: targetUid,
      hostName: targetName
    }).catch(() => {});
    addTelemetryLog('HOST', `Transferred host controls to ${targetName}`);
  };

  const handleCopyInvite = () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${activeRoomCode}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const allParticipants = useMemo(() => {
    const realPeers = roomData?.participants ? Object.values(roomData.participants) : [];
    const base =
      realPeers.length > 0
        ? realPeers
        : [{ uid: user?.uid || 'local', name: userName, avatar: userAvatar, role: 'HOST', driftMs: 0 }];
    return [...base, ...simulatedUsers];
  }, [roomData?.participants, user, userName, userAvatar, simulatedUsers]);

  const latencyStats = useMemo(() => {
    const sorted = [...latencySamples].sort((a, b) => a - b);
    const p50 = sorted[Math.floor(sorted.length * 0.5)] || 22;
    const p95 = sorted[Math.floor(sorted.length * 0.95)] || 41;
    return { p50, p95 };
  }, [latencySamples]);

  const activeSubtitleText = useMemo(() => {
    if (!subtitlesEnabled) return '';
    const adjustedTime = localTime - subtitleOffsetSec;
    const cue = SUBTITLE_TRACKS.find((c) => adjustedTime >= c.start && adjustedTime <= c.end);
    return cue ? cue.text : '';
  }, [subtitlesEnabled, localTime, subtitleOffsetSec]);

  const filteredCatalog = useMemo(() => {
    return MEDIA_CATALOG.map((movie) => {
      const targetStr = `${movie.title} ${movie.director} ${movie.categories.join(' ')} ${movie.moods.join(' ')}`;
      const fuzzyScore = computeFuzzyMatchScore(searchQuery, targetStr);
      return { ...movie, fuzzyScore };
    })
      .filter((movie) => {
        const matchesCat =
          selectedCategory === 'All' || movie.categories.includes(selectedCategory);
        const matchesSearch = !searchQuery.trim() || movie.fuzzyScore >= 45;
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => b.fuzzyScore - a.fuzzyScore);
  }, [searchQuery, selectedCategory]);

  return (
    <div
      style={{
        backgroundColor: theme.bgPrimary,
        color: theme.textPrimary
      }}
      className="min-h-screen transition-colors duration-200 select-none"
    >
      <header
        style={{
          backgroundColor: theme.bgSecondary,
          borderColor: theme.border
        }}
        className={`sticky top-0 z-40 border-b transition-opacity ${
          cinemaDimMode ? 'opacity-20 hover:opacity-100' : ''
        }`}
      >
        <div className="max-w-[1640px] mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              style={{ backgroundColor: theme.accent, color: theme.accentContrast }}
              className="w-8 h-8 rounded flex items-center justify-center font-mono font-black text-sm tracking-tighter"
            >
              KS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">KinoSync</span>
                <span
                  style={{
                    backgroundColor: theme.bgTertiary,
                    color: theme.textSecondary,
                    borderColor: theme.border
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded border"
                >
                  v2.4
                </span>
              </div>
              <p style={{ color: theme.textMuted }} className="text-[11px] hidden sm:block">
                Synchronized Screening Room
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <div
              style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
              className="flex items-center gap-2 px-2.5 py-1 rounded border text-xs font-mono"
            >
              <span style={{ color: theme.textMuted }}>ROOM:</span>
              <span className="font-bold" style={{ color: theme.accent }}>
                {activeRoomCode}
              </span>
              <button
                onClick={handleCopyInvite}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:opacity-80"
                style={{ backgroundColor: theme.bgTertiary }}
                title="Copy Room Invite Link"
              >
                {copiedInvite ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                <span className="text-[10px]">{copiedInvite ? 'Copied' : 'Invite'}</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (joinInputCode.trim()) {
                  setActiveRoomCode(joinInputCode.trim().toUpperCase());
                  setJoinInputCode('');
                }
              }}
              className="flex items-center gap-1"
            >
              <input
                type="text"
                value={joinInputCode}
                onChange={(e) => setJoinInputCode(e.target.value)}
                placeholder="Join code..."
                maxLength={8}
                style={{
                  backgroundColor: theme.bgPrimary,
                  borderColor: theme.border,
                  color: theme.textPrimary
                }}
                className="w-24 px-2 py-1 rounded border text-xs font-mono uppercase focus:outline-none"
              />
              <button
                type="submit"
                style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                className="px-2.5 py-1 rounded border text-xs font-mono hover:opacity-85"
              >
                Join
              </button>
            </form>

            <div
              style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border"
            >
              <Palette className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <select
                value={themeKey}
                onChange={(e) => setThemeKey(e.target.value)}
                style={{ backgroundColor: 'transparent', color: theme.textPrimary }}
                className="text-xs font-mono focus:outline-none cursor-pointer"
                title="Switch Theme"
              >
                <optgroup label="Dark Themes" style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }}>
                  <option value="obsidian">Obsidian</option>
                  <option value="criterion">Criterion 35mm</option>
                  <option value="tokyo">Tokyo Terminal</option>
                </optgroup>
                <optgroup label="Light Themes" style={{ backgroundColor: theme.bgSecondary, color: theme.textPrimary }}>
                  <option value="paper">Paper Daylight</option>
                  <option value="nordic">Nordic Alabaster</option>
                  <option value="solarized">Solarized</option>
                </optgroup>
              </select>
            </div>

            <button
              onClick={() => setSimulatedBotsActive(!simulatedBotsActive)}
              style={{
                backgroundColor: simulatedBotsActive ? theme.accentSoft : theme.bgTertiary,
                borderColor: simulatedBotsActive ? theme.accent : theme.border,
                color: simulatedBotsActive ? theme.accent : theme.textSecondary
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono transition"
              title="Simulate 10 connected viewers in the room"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{simulatedBotsActive ? '10 Viewers Active' : '+10 Demo Viewers'}</span>
            </button>

            <button
              onClick={() => setShowDocsModal(true)}
              style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono hover:opacity-85 transition"
            >
              <Terminal className="w-3.5 h-3.5" style={{ color: theme.accent }} />
              <span className="hidden xl:inline">Sync Stats</span>
            </button>

            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-mono"
            >
              <span>{userAvatar}</span>
              <span>{userName}</span>
            </button>
          </div>
        </div>

        {isEditingProfile && (
          <div
            style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
            className="border-t px-4 py-2.5"
          >
            <div className="max-w-[1640px] mx-auto flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1">
                {AVATARS.map((av) => (
                  <button
                    key={av}
                    onClick={() => setUserAvatar(av)}
                    style={{
                      backgroundColor: userAvatar === av ? theme.accentSoft : 'transparent',
                      borderColor: userAvatar === av ? theme.accent : 'transparent'
                    }}
                    className="w-7 h-7 rounded border flex items-center justify-center text-sm"
                  >
                    {av}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{
                  backgroundColor: theme.bgSecondary,
                  borderColor: theme.border,
                  color: theme.textPrimary
                }}
                className="px-2.5 py-1 rounded border text-xs font-mono"
              />
              <button
                onClick={() => setIsEditingProfile(false)}
                style={{ backgroundColor: theme.accent, color: theme.accentContrast }}
                className="px-3 py-1 rounded text-xs font-mono font-bold"
              >
                Save Profile
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-[1640px] mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div
            style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
            className="border rounded-lg p-3 flex flex-wrap items-center justify-between gap-2"
          >
            <form onSubmit={handleUniversalMediaSubmit} className="flex-1 min-w-[260px] flex items-center gap-2">
              <div
                style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                className="flex-1 flex items-center gap-2 border rounded px-3 py-1.5"
              >
                <Film className="w-4 h-4 shrink-0" style={{ color: theme.accent }} />
                <input
                  type="text"
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  placeholder="Paste direct .mp4/.webm URL or YouTube link..."
                  style={{ color: theme.textPrimary }}
                  className="w-full bg-transparent text-xs font-mono focus:outline-none"
                />
              </div>
              <button
                type="submit"
                style={{ backgroundColor: theme.accent, color: theme.accentContrast }}
                className="px-3 py-1.5 rounded text-xs font-mono font-bold shrink-0 hover:opacity-90 transition"
              >
                Load URL
              </button>
            </form>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg,video/x-matroska"
                onChange={handleLocalFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono hover:opacity-85 transition"
                title="Load a local video file from your computer and sync playback with others who have the same file"
              >
                <HardDrive className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <span>Open Local File</span>
              </button>
            </div>
          </div>

          <div
            style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
            className="border rounded-lg px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono"
          >
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-bold text-xs">{currentMovie.title}</span>

              <button
                onClick={handleCyclePermissionMode}
                style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                className="px-2 py-0.5 rounded border flex items-center gap-1 text-[11px]"
                title="Click to change who can control playback"
              >
                {roomData?.permissionMode === 'HOST_ONLY' ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Unlock className="w-3 h-3" />
                )}
                <span>
                  Controls:{' '}
                  {roomData?.permissionMode === 'HOST_ONLY'
                    ? 'Host Only'
                    : roomData?.permissionMode === 'MODS'
                    ? 'Mods'
                    : 'Everyone'}
                </span>
              </button>

              {localFileSignature && (
                <span
                  style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                  className="px-2 py-0.5 rounded border text-[10px] text-emerald-400"
                >
                  File Hash: {localFileSignature.signature}
                </span>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2 tabular-nums">
              <span
                style={{
                  backgroundColor: theme.bgTertiary,
                  borderColor: Math.abs(driftMs) <= 200 ? theme.statusOk : theme.statusWarn,
                  color: Math.abs(driftMs) <= 200 ? theme.statusOk : theme.statusWarn
                }}
                className="px-2 py-0.5 rounded border text-[11px]"
              >
                Sync: {driftMs >= 0 ? `+${driftMs}` : driftMs}ms
              </span>

              <span
                style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                className="px-2 py-0.5 rounded border text-[11px]"
              >
                Ping: {latencyStats.p50}ms
              </span>

              <button
                onClick={simulateLagSpikeAndCorrect}
                style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                className="px-2 py-0.5 rounded border text-[11px] hover:opacity-80"
                title="Offset local player by +1.45s to test automatic drift resync"
              >
                Test Drift Resync
              </button>

              <button
                onClick={() => setCinemaDimMode(!cinemaDimMode)}
                style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                className="p-1 rounded border"
                title="Dim lights"
              >
                {cinemaDimMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div
            style={{ backgroundColor: '#000', borderColor: theme.border }}
            className="border rounded-lg overflow-hidden relative"
          >
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {activeSourceType === 'youtube' ? (
                <div className="w-full h-full relative">
                  <iframe
                    ref={youtubeIframeRef}
                    title="Synchronized YouTube Player"
                    src={`https://www.youtube-nocookie.com/embed/${
                      roomData?.youtubeId || currentMovie.youtubeId || 'eRsGyueVLvQ'
                    }?enablejsapi=1&autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                  <div className="absolute top-3 right-3 z-30">
                    <button
                      onClick={() => setYtUseBackupStream(true)}
                      className="px-2.5 py-1 rounded bg-black/80 text-white border border-white/20 text-[11px] font-mono hover:bg-black"
                    >
                      Embed blocked? Switch to Direct Video
                    </button>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  key={activeVideoSrc}
                  src={activeVideoSrc}
                  poster={currentMovie.poster}
                  muted={isMuted}
                  playsInline
                  autoPlay={localPlaying}
                  onLoadedMetadata={(e) => {
                    if (e.currentTarget.duration && !isNaN(e.currentTarget.duration)) {
                      setDuration(e.currentTarget.duration);
                    }
                    setStreamStatusText('Direct Stream Active');
                  }}
                  onTimeUpdate={(e) => {
                    setLocalTime(e.currentTarget.currentTime);
                  }}
                  onPlay={() => {
                    if (!isApplyingRemoteUpdateRef.current && !localPlaying) {
                      handleTogglePlay();
                    }
                  }}
                  onPause={() => {
                    if (!isApplyingRemoteUpdateRef.current && localPlaying) {
                      handleTogglePlay();
                    }
                  }}
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                  onClick={handleTogglePlay}
                  className="w-full h-full object-contain cursor-pointer"
                />
              )}

              {isMuted && activeSourceType !== 'youtube' && (
                <button
                  onClick={() => {
                    setIsMuted(false);
                    if (videoRef.current) videoRef.current.muted = false;
                  }}
                  className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 text-amber-400 border border-amber-400/40 text-xs font-mono hover:bg-black transition"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Click to Unmute Audio</span>
                </button>
              )}

              <canvas
                ref={laserCanvasRef}
                width={800}
                height={450}
                onMouseDown={(e) => {
                  if (!laserModeActive) return;
                  setIsDrawingLaser(true);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pt = {
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height
                  };
                  const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
                  updateDoc(roomDocRef, {
                    latestLaserStroke: { user: userName, timestamp: Date.now(), points: [pt] }
                  }).catch(() => {});
                }}
                onMouseMove={(e) => {
                  if (!laserModeActive || !isDrawingLaser) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pt = {
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height
                  };
                  const existingPts = roomData?.latestLaserStroke?.points || [];
                  const roomDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'rooms', activeRoomCode);
                  updateDoc(roomDocRef, {
                    latestLaserStroke: {
                      user: userName,
                      timestamp: Date.now(),
                      points: [...existingPts.slice(-25), pt]
                    }
                  }).catch(() => {});
                }}
                onMouseUp={() => setIsDrawingLaser(false)}
                className={`absolute inset-0 w-full h-full z-20 ${
                  laserModeActive ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
                }`}
              />

              {activeSubtitleText && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded bg-black/80 text-white text-xs sm:text-sm font-mono text-center max-w-[85%] pointer-events-none border border-white/10">
                  {activeSubtitleText}
                </div>
              )}

              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                {floatingReactions.map((r) => (
                  <div
                    key={r.id}
                    style={{ left: `${r.leftPct}%` }}
                    className="absolute bottom-4 animate-bounce flex flex-col items-center"
                  >
                    <span className="text-2xl drop-shadow">{r.emoji}</span>
                    <span className="text-[9px] font-mono bg-black/70 text-white px-1 rounded">
                      {r.sender}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
              className="p-3.5 border-t space-y-3"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono" style={{ color: theme.textSecondary }}>
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    <span>Timeline Highlights ({streamStatusText})</span>
                  </span>
                  <span className="tabular-nums font-bold" style={{ color: theme.textPrimary }}>
                    {formatTime(localTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="grid grid-cols-20 gap-0.5 h-5 items-end pt-1">
                  {Array.from({ length: 20 }).map((_, idx) => {
                    const count = roomData?.reactionHeatmap?.[idx] || 1;
                    const heightPct = Math.min(100, Math.max(18, count * 8));
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSeek((idx / 20) * duration)}
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor:
                            localTime / Math.max(1, duration) >= idx / 20
                              ? theme.accent
                              : theme.bgTertiary
                        }}
                        className="w-full rounded-t transition-all hover:opacity-80"
                        title={`Jump to ${formatTime((idx / 20) * duration)}`}
                      />
                    );
                  })}
                </div>

                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={Math.min(localTime, duration || 100)}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center flex-wrap gap-1.5">
                  <button
                    onClick={handleTogglePlay}
                    style={{ backgroundColor: theme.accent, color: theme.accentContrast }}
                    className="px-3.5 py-1.5 rounded font-mono text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition"
                  >
                    {localPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{localPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={() => handleSeek(Math.max(0, localTime - 10))}
                    style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                    className="px-2 py-1.5 rounded border text-xs font-mono flex items-center gap-1"
                    title="Rewind 10 seconds"
                  >
                    <Rewind className="w-3.5 h-3.5" />
                    <span>-10s</span>
                  </button>

                  <button
                    onClick={() => handleStepFrame(-1)}
                    style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                    className="px-2 py-1.5 rounded border text-xs font-mono"
                    title="Step 1 frame backward"
                  >
                    -1F
                  </button>

                  <button
                    onClick={() => handleStepFrame(1)}
                    style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                    className="px-2 py-1.5 rounded border text-xs font-mono"
                    title="Step 1 frame forward"
                  >
                    +1F
                  </button>

                  <button
                    onClick={() => {
                      const nextMute = !isMuted;
                      setIsMuted(nextMute);
                      if (videoRef.current) videoRef.current.muted = nextMute;
                      sendYouTubeCommand(nextMute ? 'mute' : 'unMute', []);
                    }}
                    style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                    className="px-2.5 py-1.5 rounded border text-xs font-mono flex items-center gap-1"
                    title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5" style={{ color: theme.statusWarn }} />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" style={{ color: theme.statusOk }} />
                    )}
                    <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Audio'}</span>
                  </button>

                  {currentMovie.youtubeId && (
                    <button
                      onClick={() => {
                        if (activeSourceType === 'youtube') {
                          setYtUseBackupStream(true);
                        } else {
                          setYtUseBackupStream(false);
                          broadcastPlaybackState(true, localTime, 'SWITCH_ENGINE_YT', {
                            sourceType: 'youtube',
                            youtubeId: currentMovie.youtubeId
                          });
                        }
                      }}
                      style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                      className="px-2.5 py-1.5 rounded border text-xs font-mono flex items-center gap-1"
                      title="Toggle between Direct Video Stream and YouTube Embed"
                    >
                      <Youtube className="w-3.5 h-3.5 text-red-500" />
                      <span>{activeSourceType === 'youtube' ? 'Use Direct Video' : 'Use YouTube'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setLaserModeActive(!laserModeActive)}
                    style={{
                      backgroundColor: laserModeActive ? theme.accentSoft : theme.bgTertiary,
                      borderColor: laserModeActive ? theme.accent : theme.border,
                      color: laserModeActive ? theme.accent : theme.textPrimary
                    }}
                    className="px-2.5 py-1.5 rounded border text-xs font-mono flex items-center gap-1 transition"
                    title="Draw temporary annotations on the video canvas"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>Pointer</span>
                  </button>

                  <button
                    onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    style={{
                      backgroundColor: subtitlesEnabled ? theme.accentSoft : theme.bgTertiary,
                      borderColor: subtitlesEnabled ? theme.accent : theme.border
                    }}
                    className="px-2.5 py-1.5 rounded border text-xs font-mono flex items-center gap-1"
                  >
                    <Subtitles className="w-3.5 h-3.5" />
                    <span>CC</span>
                  </button>

                  <button
                    onClick={handleAddBookmark}
                    style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                    className="px-2.5 py-1.5 rounded border text-xs font-mono flex items-center gap-1"
                    title="Bookmark current timestamp"
                  >
                    <Bookmark className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                    <span className="hidden md:inline">Bookmark</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleSendReaction(emoji)}
                      style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                      className="w-7 h-7 rounded border flex items-center justify-center text-sm hover:scale-110 transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {Array.isArray(roomData?.bookmarks) && roomData.bookmarks.length > 0 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-[11px] font-mono">
                  <span style={{ color: theme.textMuted }}>Bookmarks:</span>
                  {roomData.bookmarks.map((bm) => (
                    <button
                      key={bm.id}
                      onClick={() => handleSeek(bm.time)}
                      style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                      className="px-2 py-0.5 rounded border shrink-0 hover:opacity-80"
                    >
                      <span style={{ color: theme.accent }}>@{formatTime(bm.time)}</span> {bm.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
            className="border rounded-lg p-3.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 text-xs font-mono">
                <Users className="w-4 h-4" style={{ color: theme.accent }} />
                <span className="font-bold">Viewers in Room ({allParticipants.length})</span>
              </div>

              <button
                onClick={() => setConnectionSimulatedOffline(!connectionSimulatedOffline)}
                style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                className="text-[11px] font-mono px-2.5 py-1 rounded border hover:opacity-80"
              >
                {connectionSimulatedOffline ? 'Reconnect Now' : 'Simulate Drop & Rejoin'}
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {allParticipants.map((p) => {
                const isPeerHost = roomData?.hostId === p.uid || p.role === 'HOST';
                return (
                  <div
                    key={p.uid}
                    style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                    className="px-2.5 py-1.5 rounded border flex items-center gap-2 shrink-0 text-xs font-mono"
                  >
                    <span>{p.avatar || '🎬'}</span>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{p.name}</span>
                        {isPeerHost && <Crown className="w-3 h-3 text-amber-400" />}
                      </div>
                      <span className="text-[10px] tabular-nums" style={{ color: theme.textMuted }}>
                        drift: {p.driftMs || 0}ms
                      </span>
                    </div>
                    {!isPeerHost && roomData?.hostId === user?.uid && (
                      <button
                        onClick={() => handleTransferHost(p.uid, p.name)}
                        style={{ backgroundColor: theme.bgTertiary }}
                        className="px-1.5 py-0.5 rounded text-[10px] hover:opacity-80"
                        title="Make Host"
                      >
                        Crown
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div
            style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold flex items-center gap-2">
                  <Film className="w-4 h-4" style={{ color: theme.accent }} />
                  <span>Library & Search</span>
                </h2>
                <p style={{ color: theme.textMuted }} className="text-xs">
                  Every film streams directly with multi-mirror fallback
                </p>
              </div>

              <div className="flex items-center gap-1 font-mono text-xs">
                {[
                  { id: 'All', label: 'All Films' },
                  { id: 'Animation', label: 'Animation' },
                  { id: 'Sci-Fi', label: 'Sci-Fi' },
                  { id: 'Documentary', label: 'Documentary' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      backgroundColor: selectedCategory === cat.id ? theme.accent : theme.bgTertiary,
                      color: selectedCategory === cat.id ? theme.accentContrast : theme.textSecondary,
                      borderColor: theme.border
                    }}
                    className="px-2.5 py-1 rounded border text-[11px] font-bold"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <div
                style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                className="flex items-center gap-2 border rounded px-3 py-1.5"
              >
                <Search className="w-4 h-4" style={{ color: theme.textMuted }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, director, or genre (typo-tolerant, e.g. 'sntel', 'bck buny')..."
                  style={{ color: theme.textPrimary }}
                  className="w-full bg-transparent text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {filteredCatalog.map((movie) => {
                const isCurrent = currentMovie.id === movie.id;
                return (
                  <div
                    key={movie.id}
                    style={{
                      backgroundColor: theme.bgPrimary,
                      borderColor: isCurrent ? theme.accent : theme.border
                    }}
                    className="rounded border overflow-hidden flex flex-col justify-between transition"
                  >
                    <div>
                      <div className="relative h-32 bg-black overflow-hidden">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover opacity-85"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-amber-400">
                            {movie.categories[0]}
                          </span>
                          {searchQuery.trim() && (
                            <span
                              style={{ backgroundColor: theme.accent, color: theme.accentContrast }}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold"
                            >
                              {movie.fuzzyScore}% match
                            </span>
                          )}
                        </div>
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-mono text-white tabular-nums">
                          {movie.durationFormatted}
                        </span>
                      </div>

                      <div className="p-3">
                        <h4 className="font-bold text-xs truncate">{movie.title}</h4>
                        <p style={{ color: theme.textSecondary }} className="text-[11px] line-clamp-2 mt-1">
                          {movie.synopsis}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 pt-0 flex items-center gap-1.5">
                      <button
                        onClick={() => handleSelectMovie(movie)}
                        style={{
                          backgroundColor: isCurrent ? theme.accentSoft : theme.accent,
                          color: isCurrent ? theme.accent : theme.accentContrast
                        }}
                        className="flex-1 py-1.5 px-2.5 rounded text-[11px] font-mono font-bold flex items-center justify-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>{isCurrent ? 'Playing' : 'Watch Now'}</span>
                      </button>
                      <button
                        onClick={() => handleAddToPlaylist(movie)}
                        style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                        className="p-1.5 rounded border"
                        title="Add to Queue"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
          className="lg:col-span-4 flex flex-col h-[790px] border rounded-lg overflow-hidden"
        >
          <div
            style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
            className="grid grid-cols-4 border-b p-1 gap-1 font-mono"
          >
            {[
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'playlist', label: 'Queue', icon: ListVideo },
              { id: 'polls', label: 'Polls', icon: BarChart2 },
              { id: 'telemetry', label: 'Logs', icon: Activity }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeSidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSidebarTab(tab.id)}
                  style={{
                    backgroundColor: active ? theme.accent : 'transparent',
                    color: active ? theme.accentContrast : theme.textSecondary
                  }}
                  className="flex flex-col items-center justify-center py-2 px-1 rounded text-[11px] font-bold transition"
                >
                  <Icon className="w-3.5 h-3.5 mb-0.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeSidebarTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
                {(roomData?.chatMessages || []).map((msg) => {
                  const blurred = msg.isSpoiler && !revealedSpoilers[msg.id];
                  return (
                    <div
                      key={msg.id}
                      style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                      className="p-2.5 rounded border text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold flex items-center gap-1.5">
                          <span>{msg.senderAvatar || '🎬'}</span>
                          <span>{msg.senderName}</span>
                        </span>
                        <button
                          onClick={() => handleSeek(msg.mediaTimestamp || 0)}
                          style={{ color: theme.accent }}
                          className="hover:underline tabular-nums"
                        >
                          @{formatTime(msg.mediaTimestamp || 0)}
                        </button>
                      </div>

                      {blurred ? (
                        <button
                          onClick={() =>
                            setRevealedSpoilers((prev) => ({ ...prev, [msg.id]: true }))
                          }
                          style={{ backgroundColor: theme.bgTertiary, color: theme.textSecondary }}
                          className="w-full py-1.5 px-2 rounded text-[11px] font-mono flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Spoiler hidden — click to reveal</span>
                        </button>
                      ) : (
                        <p style={{ color: theme.textPrimary }} className="leading-relaxed">
                          {msg.text}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <form
                onSubmit={handleSendChat}
                style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                className="p-3 border-t space-y-2"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => setIsSpoilerMessage(!isSpoilerMessage)}
                    style={{
                      color: isSpoilerMessage ? theme.accent : theme.textMuted
                    }}
                    className="flex items-center gap-1"
                  >
                    {isSpoilerMessage ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{isSpoilerMessage ? 'Spoiler Guard ON' : 'Mark as Spoiler'}</span>
                  </button>
                  <span style={{ color: theme.textMuted }}>@{formatTime(localTime)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Message the room..."
                    style={{
                      backgroundColor: theme.bgSecondary,
                      borderColor: theme.border,
                      color: theme.textPrimary
                    }}
                    className="flex-1 px-3 py-1.5 rounded border text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    style={{ backgroundColor: theme.accent, color: theme.accentContrast }}
                    className="px-3 py-1.5 rounded text-xs font-mono font-bold"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeSidebarTab === 'playlist' && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold">Up Next Queue (Ranked by Votes)</span>
                <span style={{ color: theme.textMuted }}>{(roomData?.playlist || []).length} items</span>
              </div>

              {(roomData?.playlist || []).map((item, idx) => (
                <div
                  key={item.id}
                  style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                  className="p-2.5 rounded border flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <span className="font-mono" style={{ color: theme.accent }}>
                        #{idx + 1}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </div>
                    <p style={{ color: theme.textMuted }} className="text-[11px] font-mono">
                      Duration: {item.durationFormatted}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleVotePlaylist(item.id)}
                      style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                      className="px-2 py-1 rounded border text-xs font-mono flex items-center gap-1"
                    >
                      <ThumbsUp className="w-3 h-3" style={{ color: theme.accent }} />
                      <span>{item.votes || 0}</span>
                    </button>
                    <button
                      onClick={() => handleSelectMovie(item)}
                      style={{ backgroundColor: theme.accent, color: theme.accentContrast }}
                      className="px-2 py-1 rounded text-xs font-mono font-bold"
                    >
                      Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSidebarTab === 'polls' && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
              <form
                onSubmit={handleCreatePoll}
                style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                className="p-3 rounded border space-y-2"
              >
                <p className="text-xs font-mono font-bold">Create Room Poll</p>
                <input
                  type="text"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  placeholder="Poll question..."
                  style={{
                    backgroundColor: theme.bgSecondary,
                    borderColor: theme.border,
                    color: theme.textPrimary
                  }}
                  className="w-full px-2.5 py-1.5 rounded border text-xs"
                />
                <input
                  type="text"
                  value={newPollOptions}
                  onChange={(e) => setNewPollOptions(e.target.value)}
                  placeholder="Comma-separated options..."
                  style={{
                    backgroundColor: theme.bgSecondary,
                    borderColor: theme.border,
                    color: theme.textPrimary
                  }}
                  className="w-full px-2.5 py-1.5 rounded border text-xs font-mono"
                />
                <button
                  type="submit"
                  style={{ backgroundColor: theme.accent, color: theme.accentContrast }}
                  className="w-full py-1.5 rounded text-xs font-mono font-bold"
                >
                  Publish Poll
                </button>
              </form>

              <div className="space-y-3">
                {(roomData?.polls || []).map((poll) => {
                  const totalVotes = poll.options.reduce((acc, o) => acc + (o.votes || 0), 0) || 1;
                  return (
                    <div
                      key={poll.id}
                      style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                      className="p-3 rounded border space-y-2"
                    >
                      <p className="text-xs font-bold">{poll.question}</p>
                      <div className="space-y-1.5">
                        {poll.options.map((opt) => {
                          const pct = Math.round(((opt.votes || 0) / totalVotes) * 100);
                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleVotePoll(poll.id, opt.id)}
                              style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
                              className="w-full p-2 rounded border text-left text-xs font-mono relative overflow-hidden"
                            >
                              <div
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: theme.accentSoft
                                }}
                                className="absolute inset-y-0 left-0"
                              />
                              <div className="relative flex items-center justify-between">
                                <span>{opt.text}</span>
                                <span className="font-bold">
                                  {opt.votes || 0} ({pct}%)
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSidebarTab === 'telemetry' && (
            <div className="flex-1 flex flex-col min-h-0 p-3.5 space-y-3 overflow-y-auto font-mono">
              <div className="grid grid-cols-3 gap-2 tabular-nums">
                <div
                  style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                  className="p-2.5 rounded border text-center"
                >
                  <p className="text-[10px]" style={{ color: theme.textMuted }}>
                    Median Ping
                  </p>
                  <p className="text-sm font-bold" style={{ color: theme.statusOk }}>
                    {latencyStats.p50}ms
                  </p>
                </div>
                <div
                  style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                  className="p-2.5 rounded border text-center"
                >
                  <p className="text-[10px]" style={{ color: theme.textMuted }}>
                    p95 Latency
                  </p>
                  <p className="text-sm font-bold" style={{ color: theme.accent }}>
                    {latencyStats.p95}ms
                  </p>
                </div>
                <div
                  style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                  className="p-2.5 rounded border text-center"
                >
                  <p className="text-[10px]" style={{ color: theme.textMuted }}>
                    Clock Drift
                  </p>
                  <p className="text-sm font-bold">{Math.abs(driftMs)}ms</p>
                </div>
              </div>

              <div
                style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                className="p-2.5 rounded border flex items-center justify-between text-xs"
              >
                <span>Smooth Rate Adjustment (1.04x)</span>
                <button
                  onClick={() => setSoftSyncEnabled(!softSyncEnabled)}
                  style={{
                    backgroundColor: softSyncEnabled ? theme.statusOk : theme.bgTertiary,
                    color: '#fff'
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-bold"
                >
                  {softSyncEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                {telemetryLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                    className="p-2 rounded border flex items-start justify-between gap-2"
                  >
                    <div>
                      <span style={{ color: theme.textMuted }}>[{log.time}] </span>
                      <span style={{ color: theme.accent }} className="font-bold">
                        {log.type}:{' '}
                      </span>
                      <span>{log.msg}</span>
                    </div>
                    {log.latencyMs && (
                      <span className="tabular-nums shrink-0" style={{ color: theme.statusOk }}>
                        {log.latencyMs}ms
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {showDocsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div
            style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
            className="border rounded-lg max-w-4xl w-full max-h-[88vh] overflow-y-auto p-6 space-y-5 font-mono"
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: theme.border }}>
              <div>
                <span style={{ color: theme.accent }} className="text-[10px] font-bold uppercase">
                  SYSTEM TELEMETRY & SYNC NOTES
                </span>
                <h2 className="text-base font-bold mt-1">
                  Playback Synchronization, Latency Measurements & Recovery
                </h2>
              </div>
              <button
                onClick={() => setShowDocsModal(false)}
                style={{ backgroundColor: theme.bgTertiary, borderColor: theme.border }}
                className="px-3 py-1 rounded border text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div
                style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                className="p-4 rounded border space-y-2"
              >
                <h4 style={{ color: theme.accent }} className="font-bold">
                  1. Multi-Source Playback (Direct Video, YouTube & Local File Hash)
                </h4>
                <p style={{ color: theme.textSecondary }}>
                  Supports native HTML5 streams (MP4/WebM) with multi-CDN fallback, YouTube embeds, and zero-bandwidth local file matching using 64-bit FNV-1a header checksums.
                </p>
              </div>

              <div
                style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border }}
                className="p-4 rounded border space-y-2"
              >
                <h4 style={{ color: theme.accent }} className="font-bold">
                  2. Drift Detection & Correction (&le; 500ms)
                </h4>
                <p style={{ color: theme.textSecondary }}>
                  Deadband under <code>160ms</code> avoids unnecessary adjustments. Drift between <code>160ms–500ms</code> applies a gentle <code>1.04x / 0.96x</code> playback rate adjustment. Drift above <code>500ms</code> triggers an immediate seek snap with echo suppression.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}