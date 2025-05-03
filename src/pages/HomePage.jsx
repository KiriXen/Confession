import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Heart, Sparkles, Send, Trash2, Star, X, Edit2, MessageSquare } from 'lucide-react';
import { neon } from '@neondatabase/serverless';

// Fallback connection string for non-Vite environments (remove in production)
const FALLBACK_DB_URL = 'postgresql://confession_owner:npg_MxTItZfkQ79r@ep-snowy-mode-a4e4zve3-pooler.us-east-1.aws.neon.tech/confession?sslmode=require';

// Initialize Neon database
const sql = neon(import.meta.env?.VITE_NEON_DATABASE_URL || FALLBACK_DB_URL);

const quotes = [
  { text: "I love you not only for what you are, but for what I am when I am with you.", author: "Elizabeth Barrett Browning" },
  { text: "You are my heart, my life, my one and only thought.", author: "Arthur Conan Doyle" },
  { text: "In all the world, there is no heart for me like yours.", author: "Maya Angelou" },
  { text: "I am yours, don't give myself back to me.", author: "Rumi" },
  { text: "My heart is, and always will be, yours.", author: "Jane Austen" },
  { text: "Every atom of your flesh is as dear to me as my own.", author: "Charlotte Brontë" },
  { text: "I carry your heart with me (I carry it in my heart).", author: "E.E. Cummings" },
  { text: "You are the finest, loveliest, tenderest, and most beautiful person I have ever known.", author: "F. Scott Fitzgerald" },
  { text: "If I know what love is, it is because of you.", author: "Hermann Hesse" },
  { text: "To love and be loved is to feel the sun from both sides.", author: "David Viscott" },
];

const StarField = () => {
  const stars = useMemo(() => {
    const starElements = Array.from({ length: 100 }, (_, i) => {
      const size = Math.random() * 4 + 1;
      const opacity = Math.random() * 0.7 + 0.3;
      const animationDuration = Math.random() * 5 + 3;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      
      const starType = Math.random();
      
      if (starType < 0.2) {
        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${y}%`,
              left: `${x}%`, 
              animation: `pulse ${animationDuration}s infinite ${delay}s`,
              zIndex: 5
            }}
          >
            <Star 
              size={size * 3} 
              className="text-white" 
              style={{ 
                opacity, 
                filter: `drop-shadow(0 0 ${size}px rgba(255, 255, 255, 0.8))` 
              }} 
            />
          </div>
        );
      } else if (starType < 0.4) {
        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${y}%`,
              left: `${x}%`,
              width: `${size * 1.5}px`,
              height: `${size * 1.5}px`,
              background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)`,
              opacity,
              animation: `pulse ${animationDuration}s infinite ${delay}s`,
              zIndex: 5
            }}
          />
        );
      } else {
        return (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: `${y}%`,
              left: `${x}%`,
              width: `${size}px`,
              height: `${size}px`,
              boxShadow: `0 0 ${size * 1.5}px ${size / 2}px rgba(255, 255, 255, ${opacity})`,
              opacity,
              animation: `twinkle ${animationDuration}s infinite ${delay}s`,
              zIndex: 5
            }}
          />
        );
      }
    });

    const shootingStars = Array.from({ length: 3 }, (_, i) => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 45 - 22.5;
      const delay = Math.random() * 15 + 5;
      
      return (
        <div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${startY}%`,
            left: `${startX}%`,
            boxShadow: '0 0 4px 2px rgba(255, 255, 255, 0.7)',
            opacity: 0,
            transform: `rotate(${angle}deg)`,
            animation: `shootingStar 3s infinite ${delay}s linear`,
            zIndex: 10
          }}
        >
          <div 
            className="absolute h-px" 
            style={{
              width: '50px',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)',
              transform: 'translateX(-100%)',
              right: '0'
            }}
          />
        </div>
      );
    });

    const starClusters = Array.from({ length: 5 }, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 80 + 40;
      
      return (
        <div
          key={`cluster-${i}`}
          className="absolute rounded-full"
          style={{
            top: `${y}%`,
            left: `${x}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: `radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%)`,
            filter: 'blur(5px)',
            zIndex: 1
          }}
        />
      );
    });

    return [...starElements, ...shootingStars, ...starClusters];
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars}
    </div>
  );
};

const NightSkyBg = () => {
  const nightSkyElements = useMemo(() => {
    const cloudLayers = [
      { top: '20%', left: '-30%', width: '90%', height: '180px', opacity: 0.15, speed: '240s', delay: '-20s', blur: 'blur-2xl' },
      { top: '40%', left: '40%', width: '110%', height: '220px', opacity: 0.1, speed: '280s', delay: '-150s', blur: 'blur-3xl' },
      { top: '65%', left: '-20%', width: '75%', height: '120px', opacity: 0.2, speed: '180s', delay: '-30s', blur: 'blur-xl' },
      { top: '10%', left: '30%', width: '65%', height: '100px', opacity: 0.15, speed: '200s', delay: '-90s', blur: 'blur-2xl' },
      { top: '5%', left: '-10%', width: '50%', height: '80px', opacity: 0.08, speed: '160s', delay: '-40s', blur: 'blur-lg' },
      { top: '75%', left: '0%', width: '60%', height: '90px', opacity: 0.05, speed: '190s', delay: '-70s', blur: 'blur-xl' }
    ];

    return (
      <>
        <div className="absolute inset-0 bg-gradient-to-b from-nebula-blue via-blue-950 to-gray-900" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-nebula-dark/30 to-transparent"></div>
        <div className="absolute inset-0 overflow-hidden">
          {cloudLayers.map((cloud, index) => (
            <div
              key={`cloud-${index}`}
              className={`absolute ${cloud.blur} rounded-full`}
              style={{
                top: cloud.top,
                left: cloud.left,
                width: cloud.width,
                height: cloud.height,
                opacity: cloud.opacity,
                animation: `moveCloud ${cloud.speed} linear infinite ${cloud.delay}`,
                background: index % 2 === 0 
                  ? 'radial-gradient(ellipse at center, rgba(138,162,255,0.1) 0%, rgba(99,102,241,0.05) 30%, rgba(76,81,191,0) 70%)'
                  : 'radial-gradient(ellipse at center, rgba(168,162,255,0.08) 0%, rgba(129,140,248,0.04) 40%, rgba(99,102,241,0) 70%)',
                transform: `scale(${1 + index * 0.05}) rotate(${index * 10}deg)`,
              }}
            />
          ))}
        </div>
        <div className="absolute top-20 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-300">
          <div className="absolute inset-0 rounded-full bg-white/90"></div>
          <div className="absolute -inset-4 rounded-full bg-white/20 blur-md"></div>
          <div className="absolute -inset-8 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -inset-12 rounded-full bg-blue-50/5 blur-2xl"></div>
          <div className="absolute top-3 left-4 w-2 h-2 rounded-full bg-gray-300/60"></div>
          <div className="absolute top-8 left-6 w-1.5 h-1.5 rounded-full bg-gray-300/60"></div>
          <div className="absolute top-5 right-3 w-3 h-3 rounded-full bg-gray-300/60"></div>
          <div className="absolute bottom-4 right-5 w-1 h-1 rounded-full bg-gray-400/40"></div>
          <div className="absolute top-6 left-2 w-1 h-1 rounded-full bg-gray-400/40"></div>
        </div>
      </>
    );
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      {nightSkyElements}
    </div>
  );
};

const DraggableQuote = ({ quote, onClose }) => {
  const [position, setPosition] = useState({ x: 10, y: 10 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const quoteRef = useRef(null);

  const handleMouseDown = (e) => {
    if (quoteRef.current) {
      const rect = quoteRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={quoteRef}
      className="fixed w-11/12 sm:w-80 bg-gray-900/60 backdrop-blur-md rounded-xl p-4 sm:p-5 shadow-lg border border-gray-800/50 z-20 transition-all duration-500 hover:shadow-indigo-500/20 cursor-move"
      style={{ 
        left: position.x, 
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      aria-label="Draggable quote card"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2 mb-3">
          <Heart size={16} className="text-indigo-400" />
          <span className="text-indigo-400 font-medium text-sm">Love Note</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close quote"
        >
          <X size={16} />
        </button>
      </div>
      <p className="text-gray-200 italic text-sm sm:text-base">"{quote.text}"</p>
      <p className="text-indigo-400 text-right mt-2 font-medium text-sm">— {quote.author}</p>
    </div>
  );
};

const HomePage = () => {
  const [quote, setQuote] = useState(null);
  const [confession, setConfession] = useState('');
  const [confessions, setConfessions] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quoteVisible, setQuoteVisible] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const [userId] = useState(() => Math.random().toString(36).slice(2)); // Simple client-side user ID
  const [username, setUsername] = useState(() => localStorage.getItem('username') || 'Anonymous');
  const [isAnonymous, setIsAnonymous] = useState(() => localStorage.getItem('isAnonymous') === 'true');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [userLikes, setUserLikes] = useState(new Set()); // Track user likes
  const [replies, setReplies] = useState({}); // Track replies per confession
  const [replyText, setReplyText] = useState({});
  const [showReplies, setShowReplies] = useState({}); // Track which confessions show replies
  const maxLength = 280;
  const maxUsernameLength = 20;
  const confessionsContainerRef = useRef(null);
  const observerRef = useRef(null);
  const [confessionsHeight, setConfessionsHeight] = useState(0);

  // Debug: Log environment variable
  useEffect(() => {
    console.log('[DEBUG] VITE_NEON_DATABASE_URL:', import.meta.env?.VITE_NEON_DATABASE_URL || 'Using fallback');
  }, []);

  // Initialize quote
  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  // Persist username and anonymity preference
  useEffect(() => {
    localStorage.setItem('username', username);
    localStorage.setItem('isAnonymous', isAnonymous.toString());
  }, [username, isAnonymous]);

  // Initialize database or fallback to local storage
  useEffect(() => {
    const initDb = async () => {
      try {
        console.log('[DEBUG] Initializing database...');
        // Create or ensure confessions table
        await sql`
          CREATE TABLE IF NOT EXISTS confessions (
            id BIGINT PRIMARY KEY,
            text TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            hearts INTEGER DEFAULT 0,
            user_id TEXT,
            username TEXT
          )
        `;
        // Check and add columns to confessions table
        const confessionColumns = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'confessions'
        `;
        const confessionColumnNames = confessionColumns.map(col => col.column_name);
        if (!confessionColumnNames.includes('user_id')) {
          console.log('[DEBUG] Adding user_id column to confessions table...');
          await sql`
            ALTER TABLE confessions
            ADD COLUMN user_id TEXT
          `;
        }
        if (!confessionColumnNames.includes('username')) {
          console.log('[DEBUG] Adding username column to confessions table...');
          await sql`
            ALTER TABLE confessions
            ADD COLUMN username TEXT
          `;
        }
        // Create likes table
        await sql`
          CREATE TABLE IF NOT EXISTS likes (
            user_id TEXT NOT NULL,
            confession_id BIGINT NOT NULL,
            PRIMARY KEY (user_id, confession_id),
            FOREIGN KEY (confession_id) REFERENCES confessions(id) ON DELETE CASCADE
          )
        `;
        // Create replies table
        await sql`
          CREATE TABLE IF NOT EXISTS replies (
            id BIGINT PRIMARY KEY,
            confession_id BIGINT NOT NULL,
            text TEXT NOT NULL,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            user_id TEXT NOT NULL,
            username TEXT,
            FOREIGN KEY (confession_id) REFERENCES confessions(id) ON DELETE CASCADE
          )
        `;
        // Check and add username column to replies table
        const replyColumns = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'replies'
        `;
        const replyColumnNames = replyColumns.map(col => col.column_name);
        if (!replyColumnNames.includes('username')) {
          console.log('[DEBUG] Adding username column to replies table...');
          await sql`
            ALTER TABLE replies
            ADD COLUMN username TEXT
          `;
        }
        console.log('[DEBUG] Database initialized successfully');
        fetchConfessions(1);
        fetchUserLikes();
      } catch (err) {
        console.error('[ERROR] Database initialization failed:', err);
        setError('Failed to connect to database. Using local storage instead.');
        setUseLocalStorage(true);
        // Load local confessions, likes, and replies if available
        const localConfessions = JSON.parse(localStorage.getItem('confessions') || '[]');
        const localLikes = JSON.parse(localStorage.getItem('userLikes') || '[]');
        const localReplies = JSON.parse(localStorage.getItem('replies') || '{}');
        setConfessions(localConfessions);
        setUserLikes(new Set(localLikes));
        setReplies(localReplies);
      }
    };
    initDb();
  }, []);

  // Fetch user likes
  const fetchUserLikes = useCallback(async () => {
    if (useLocalStorage) return;
    try {
      console.log('[DEBUG] Fetching user likes for user:', userId);
      const likes = await sql`
        SELECT confession_id FROM likes WHERE user_id = ${userId}
      `;
      setUserLikes(new Set(likes.map(like => like.confession_id)));
      console.log('[DEBUG] Fetched user likes:', likes.length);
    } catch (err) {
      console.error('[ERROR] Fetch user likes failed:', err);
    }
  }, [userId, useLocalStorage]);

  // Fetch confessions with pagination and their reply counts
  const fetchConfessions = useCallback(async (pageNum) => {
    if (useLocalStorage) {
      setLoading(true);
      try {
        const limit = 20;
        const offset = (pageNum - 1) * limit;
        const localConfessions = JSON.parse(localStorage.getItem('confessions') || '[]');
        const localReplies = JSON.parse(localStorage.getItem('replies') || '{}');
        const paginated = localConfessions.slice(offset, offset + limit).map(conf => ({
          ...conf,
          reply_count: (localReplies[conf.id] || []).length
        }));
        setConfessions(prev => pageNum === 1 ? paginated : [...prev, ...paginated]);
        setReplies(localReplies);
        setHasMore(paginated.length === limit);
        setPage(pageNum);
      } catch (err) {
        setError('Failed to load local confessions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      console.log('[DEBUG] Fetching confessions, page:', pageNum);
      const limit = 20;
      const offset = (pageNum - 1) * limit;
      const result = await sql`
        SELECT c.*, COUNT(r.id) as reply_count
        FROM confessions c
        LEFT JOIN replies r ON c.id = r.confession_id
        GROUP BY c.id
        ORDER BY c.timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      setConfessions(prev => pageNum === 1 ? result : [...prev, ...result]);
      setHasMore(result.length === limit);
      setPage(pageNum);
      console.log('[DEBUG] Fetched confessions:', result.length);
    } catch (err) {
      setError('Failed to load confessions. Please try again.');
      console.error('[ERROR] Fetch confessions failed:', err);
    } finally {
      setLoading(false);
    }
  }, [useLocalStorage]);

  // Fetch replies for a specific confession
  const fetchReplies = useCallback(async (confessionId) => {
    if (useLocalStorage) {
      const localReplies = JSON.parse(localStorage.getItem('replies') || '{}');
      return localReplies[confessionId] || [];
    }

    try {
      console.log('[DEBUG] Fetching replies for confession:', confessionId);
      const result = await sql`
        SELECT * FROM replies
        WHERE confession_id = ${confessionId}
        ORDER BY timestamp ASC
      `;
      console.log('[DEBUG] Fetched replies:', result.length);
      return result;
    } catch (err) {
      setError('Failed to load replies. Please try again.');
      console.error('[ERROR] Fetch replies failed:', err);
      return [];
    }
  }, [useLocalStorage]);

  // IntersectionObserver for infinite scroll
  const lastConfessionRef = useCallback(node => {
    if (loading || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchConfessions(page + 1);
      }
    }, { threshold: 0.1 });
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, page, fetchConfessions]);

  // Measure confessions container height
  useEffect(() => {
    if (confessionsContainerRef.current && confessions.length > 0) {
      const currentHeight = confessionsContainerRef.current.offsetHeight;
      setConfessionsHeight(Math.max(currentHeight, confessionsHeight));
    } else if (confessions.length === 0) {
      setConfessionsHeight(0);
    }
  }, [confessions]);

  // Handle confession submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confession.trim()) return;
    
    const effectiveUsername = isAnonymous ? 'Anonymous' : username || 'Anonymous';
    const newConfession = {
      id: Date.now(),
      text: confession,
      timestamp: new Date().toISOString(),
      hearts: 0,
      user_id: userId,
      username: effectiveUsername,
      reply_count: 0
    };
  
    if (useLocalStorage) {
      try {
        const localConfessions = JSON.parse(localStorage.getItem('confessions') || '[]');
        localConfessions.unshift(newConfession);
        localStorage.setItem('confessions', JSON.stringify(localConfessions));
        setConfessions(prev => [newConfession, ...prev]);
        setConfession('');
        setShowSuccess(true);
        setTimeout(() => {
          if (confessionsContainerRef.current) {
            confessionsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
          setTimeout(() => setShowSuccess(false), 2000);
        }, 100);
      } catch (err) {
        setError('Failed to save confession locally.');
        console.error(err);
      }
      return;
    }
  
    try {
      console.log('[DEBUG] Submitting confession:', newConfession.text);
      await sql`
        INSERT INTO confessions (id, text, timestamp, hearts, user_id, username)
        VALUES (${newConfession.id}, ${newConfession.text}, ${newConfession.timestamp}, ${newConfession.hearts}, ${newConfession.user_id}, ${newConfession.username})
      `;
      setConfessions(prev => [newConfession, ...prev]);
      setConfession('');
      setShowSuccess(true);
      setTimeout(() => {
        if (confessionsContainerRef.current) {
          confessionsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => setShowSuccess(false), 2000);
      }, 100);
      console.log('[DEBUG] Confession submitted successfully');
    } catch (err) {
      setError('Failed to submit confession. Please try again.');
      console.error('[ERROR] Submit confession failed:', err);
    }
  };

  // Handle reply submission
  const handleReplySubmit = async (e, confessionId) => {
    e.preventDefault();
    const text = replyText[confessionId]?.trim();
    if (!text) return;

    const effectiveUsername = isAnonymous ? 'Anonymous' : username || 'Anonymous';
    const newReply = {
      id: Date.now(),
      confession_id: confessionId,
      text,
      timestamp: new Date().toISOString(),
      user_id: userId,
      username: effectiveUsername
    };

    if (useLocalStorage) {
      try {
        const localReplies = JSON.parse(localStorage.getItem('replies') || '{}');
        const confessionReplies = localReplies[confessionId] || [];
        confessionReplies.push(newReply);
        localReplies[confessionId] = confessionReplies;
        localStorage.setItem('replies', JSON.stringify(localReplies));
        setReplies(localReplies);
        setReplyText(prev => ({ ...prev, [confessionId]: '' }));
        setConfessions(prev =>
          prev.map(conf =>
            conf.id === confessionId ? { ...conf, reply_count: (conf.reply_count || 0) + 1 } : conf
          )
        );
      } catch (err) {
        setError('Failed to save reply locally.');
        console.error(err);
      }
      return;
    }

    try {
      console.log('[DEBUG] Submitting reply for confession:', confessionId);
      await sql`
        INSERT INTO replies (id, confession_id, text, timestamp, user_id, username)
        VALUES (${newReply.id}, ${newReply.confession_id}, ${newReply.text}, ${newReply.timestamp}, ${newReply.user_id}, ${newReply.username})
      `;
      const updatedReplies = await fetchReplies(confessionId);
      setReplies(prev => ({ ...prev, [confessionId]: updatedReplies }));
      setReplyText(prev => ({ ...prev, [confessionId]: '' }));
      setConfessions(prev =>
        prev.map(conf =>
          conf.id === confessionId ? { ...conf, reply_count: (conf.reply_count || 0) + 1 } : conf
        )
      );
      console.log('[DEBUG] Reply submitted successfully');
    } catch (err) {
      setError('Failed to submit reply. Please try again.');
      console.error('[ERROR] Submit reply failed:', err);
    }
  };

  // Delete a reply
  const deleteReply = async (confessionId, replyId) => {
    if (useLocalStorage) {
      try {
        const localReplies = JSON.parse(localStorage.getItem('replies') || '{}');
        const confessionReplies = localReplies[confessionId] || [];
        const updatedReplies = confessionReplies.filter(reply => reply.id !== replyId);
        localReplies[confessionId] = updatedReplies;
        localStorage.setItem('replies', JSON.stringify(localReplies));
        setReplies(localReplies);
        setConfessions(prev =>
          prev.map(conf =>
            conf.id === confessionId ? { ...conf, reply_count: (conf.reply_count || 0) - 1 } : conf
          )
        );
      } catch (err) {
        setError('Failed to delete reply locally.');
        console.error(err);
      }
      return;
    }

    try {
      console.log('[DEBUG] Deleting reply:', replyId);
      await sql`DELETE FROM replies WHERE id = ${replyId}`;
      const updatedReplies = await fetchReplies(confessionId);
      setReplies(prev => ({ ...prev, [confessionId]: updatedReplies }));
      setConfessions(prev =>
        prev.map(conf =>
          conf.id === confessionId ? { ...conf, reply_count: (conf.reply_count || 0) - 1 } : conf
        )
      );
      console.log('[DEBUG] Reply deleted successfully');
    } catch (err) {
      setError('Failed to delete reply. Please try again.');
      console.error('[ERROR] Delete reply failed:', err);
    }
  };

  // Toggle like/unlike for a confession
  const toggleLikeConfession = useCallback(async (id) => {
    if (useLocalStorage) {
      try {
        const localConfessions = JSON.parse(localStorage.getItem('confessions') || '[]');
        const localLikes = JSON.parse(localStorage.getItem('userLikes') || '[]');
        const hasLiked = localLikes.includes(id);
        
        let updatedConfessions;
        if (hasLiked) {
          // Unlike
          updatedConfessions = localConfessions.map(conf =>
            conf.id === id ? { ...conf, hearts: (conf.hearts || 0) - 1 } : conf
          );
          const updatedLikes = localLikes.filter(likeId => likeId !== id);
          localStorage.setItem('userLikes', JSON.stringify(updatedLikes));
          setUserLikes(new Set(updatedLikes));
        } else {
          // Like
          updatedConfessions = localConfessions.map(conf =>
            conf.id === id ? { ...conf, hearts: (conf.hearts || 0) + 1 } : conf
          );
          localLikes.push(id);
          localStorage.setItem('userLikes', JSON.stringify(localLikes));
          setUserLikes(new Set(localLikes));
        }
        
        localStorage.setItem('confessions', JSON.stringify(updatedConfessions));
        setConfessions(updatedConfessions);
      } catch (err) {
        setError('Failed to toggle like locally.');
        console.error(err);
      }
      return;
    }

    try {
      console.log('[DEBUG] Toggling like for confession:', id);
      const hasLiked = userLikes.has(id);
      
      if (hasLiked) {
        // Unlike
        await sql`
          DELETE FROM likes 
          WHERE user_id = ${userId} AND confession_id = ${id}
        `;
        const updated = await sql`
          UPDATE confessions
          SET hearts = hearts - 1
          WHERE id = ${id}
          RETURNING *
        `;
        setUserLikes(prev => {
          const newLikes = new Set(prev);
          newLikes.delete(id);
          return newLikes;
        });
        setConfessions(prev =>
          prev.map(conf => conf.id === id ? { ...conf, hearts: updated[0].hearts } : conf)
        );
        console.log('[DEBUG] Confession unliked successfully');
      } else {
        // Like
        await sql`
          INSERT INTO likes (user_id, confession_id)
          VALUES (${userId}, ${id})
        `;
        const updated = await sql`
          UPDATE confessions
          SET hearts = hearts + 1
          WHERE id = ${id}
          RETURNING *
        `;
        setUserLikes(prev => new Set(prev).add(id));
        setConfessions(prev =>
          prev.map(conf => conf.id === id ? { ...conf, hearts: updated[0].hearts } : conf)
        );
        console.log('[DEBUG] Confession liked successfully');
      }
    } catch (err) {
      setError('Failed to toggle like. Please try again.');
      console.error('[ERROR] Toggle like failed:', err);
    }
  }, [userId, userLikes, useLocalStorage]);

  // Edit a confession
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    if (useLocalStorage) {
      try {
        const localConfessions = JSON.parse(localStorage.getItem('confessions') || '[]');
        const updatedConfessions = localConfessions.map(conf =>
          conf.id === id ? { ...conf, text: editText } : conf
        );
        localStorage.setItem('confessions', JSON.stringify(updatedConfessions));
        setConfessions(updatedConfessions);
        setEditingId(null);
        setEditText('');
      } catch (err) {
        setError('Failed to edit confession locally.');
        console.error(err);
      }
      return;
    }

    try {
      console.log('[DEBUG] Editing confession:', id);
      await sql`
        UPDATE confessions
        SET text = ${editText}
        WHERE id = ${id}
      `;
      setConfessions(prev =>
        prev.map(conf => conf.id === id ? { ...conf, text: editText } : conf)
      );
      setEditingId(null);
      setEditText('');
      console.log('[DEBUG] Confession edited successfully');
    } catch (err) {
      setError('Failed to edit confession. Please try again.');
      console.error('[ERROR] Edit confession failed:', err);
    }
  };

  // Delete a confession
  const deleteConfession = async (id) => {
    if (useLocalStorage) {
      try {
        const localConfessions = JSON.parse(localStorage.getItem('confessions') || '[]');
        const updatedConfessions = localConfessions.filter(conf => conf.id !== id);
        const localLikes = JSON.parse(localStorage.getItem('userLikes') || '[]');
        const updatedLikes = localLikes.filter(likeId => likeId !== id);
        const localReplies = JSON.parse(localStorage.getItem('replies') || '{}');
        delete localReplies[id];
        localStorage.setItem('confessions', JSON.stringify(updatedConfessions));
        localStorage.setItem('userLikes', JSON.stringify(updatedLikes));
        localStorage.setItem('replies', JSON.stringify(localReplies));
        const confessionElement = document.getElementById(`confession-${id}`);
        if (confessionElement) {
          confessionElement.style.opacity = '0';
          confessionElement.style.transform = 'scale(0.95)';
          setTimeout(() => {
            setConfessions(updatedConfessions);
            setUserLikes(new Set(updatedLikes));
            setReplies(localReplies);
          }, 300);
        } else {
          setConfessions(updatedConfessions);
          setUserLikes(new Set(updatedLikes));
          setReplies(localReplies);
        }
      } catch (err) {
        setError('Failed to delete confession locally.');
        console.error(err);
      }
      return;
    }

    try {
      console.log('[DEBUG] Deleting confession:', id);
      const confessionElement = document.getElementById(`confession-${id}`);
      if (confessionElement) {
        confessionElement.style.opacity = '0';
        confessionElement.style.transform = 'scale(0.95)';
        setTimeout(async () => {
          await sql`DELETE FROM confessions WHERE id = ${id}`;
          setConfessions(prev => prev.filter(conf => conf.id !== id));
          setUserLikes(prev => {
            const newLikes = new Set(prev);
            newLikes.delete(id);
            return newLikes;
          });
          setReplies(prev => {
            const newReplies = { ...prev };
            delete newReplies[id];
            return newReplies;
          });
        }, 300);
      } else {
        await sql`DELETE FROM confessions WHERE id = ${id}`;
        setConfessions(prev => prev.filter(conf => conf.id !== id));
        setUserLikes(prev => {
          const newLikes = new Set(prev);
          newLikes.delete(id);
          return newLikes;
        });
        setReplies(prev => {
          const newReplies = { ...prev };
          delete newReplies[id];
          return newReplies;
        });
      }
      console.log('[DEBUG] Confession deleted successfully');
    } catch (err) {
      setError('Failed to delete confession. Please try again.');
      console.error('[ERROR] Delete confession failed:', err);
    }
  };

  // Check if edit/delete is allowed (within 5 minutes)
  const canModify = (timestamp) => {
    const FIVE_MINUTES = 5 * 60 * 1000;
    const confessionTime = new Date(timestamp).getTime();
    const currentTime = new Date().getTime();
    return currentTime - confessionTime < FIVE_MINUTES;
  };

  // Toggle show/hide replies
  const toggleShowReplies = async (confessionId) => {
    setShowReplies(prev => ({ ...prev, [confessionId]: !prev[confessionId] }));
    if (!showReplies[confessionId] && !replies[confessionId]) {
      const fetchedReplies = await fetchReplies(confessionId);
      setReplies(prev => ({ ...prev, [confessionId]: fetchedReplies }));
    }
  };

  // Navigation placeholder
  const navigateToConfess = () => {
    console.log('Navigating to /confess page');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20 pb-16 px-4 sm:px-6 relative overflow-y-auto">
      <NightSkyBg />
      <StarField />
      
      {quote && quoteVisible && (
        <DraggableQuote quote={quote} onClose={() => setQuoteVisible(false)} />
      )}

      <div className="w-full max-w-xl z-10 space-y-8 mt-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-300 via-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4 tracking-tight">
            Welcome to Sam's Basement
          </h1>
          <p className="text-lg text-gray-300 max-w-lg mx-auto">
            Pour your soul into the stars and share your deepest confessions or else get cooked.
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-5 shadow-lg border border-gray-800/50 transition-all duration-300 hover:shadow-indigo-500/10">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={isAnonymous ? '' : username}
                  onChange={(e) => setUsername(e.target.value.slice(0, maxUsernameLength))}
                  placeholder="Enter your username"
                  disabled={isAnonymous}
                  className="w-full p-2 rounded-lg bg-gray-800/80 text-gray-200 border border-gray-700/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 placeholder-gray-500 transition-all duration-300"
                  aria-label="Username input"
                />
                <div className="text-gray-400 text-sm font-mono">
                  {isAnonymous ? 0 : username.length} / {maxUsernameLength}
                </div>
              </div>
              <label className="flex items-center space-x-2 mt-2 text-gray-400">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="form-checkbox h-4 w-4 text-indigo-400 bg-gray-800 border-gray-700 focus:ring-indigo-400"
                  aria-label="Stay anonymous"
                />
                <span className="text-sm">Stay anonymous?</span>
              </label>
            </div>
            <textarea
              value={confession}
              onChange={(e) => setConfession(e.target.value.slice(0, maxLength))}
              placeholder="Write your confession under the starry sky..."
              className="w-full p-4 rounded-xl bg-gray-800/80 text-gray-200 border border-gray-700/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 resize-y placeholder-gray-500 transition-all duration-300"
              rows="4"
              aria-label="Confession input"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-gray-400 text-sm font-mono">
                {confession.length} / {maxLength}
              </div>
              <button
                type="submit"
                disabled={!confession.trim()}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                aria-label="Submit confession"
              >
                <Send size={18} />
                <span>Submit Confession</span>
              </button>
            </div>
          </form>
          {showSuccess && (
            <div className="flex items-center justify-center space-x-2 text-indigo-400 mt-3 bg-indigo-500/10 py-2 px-3 rounded-lg animate-fadeIn">
              <Sparkles size={18} />
              <span>Your confession shines among the stars!</span>
            </div>
          )}
          {error && (
            <div className="text-red-400 mt-3 bg-red-500/10 py-2 px-3 rounded-lg animate-fadeIn">
              {error}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <button 
            onClick={navigateToConfess}
            className="relative overflow-hidden bg-black text-white font-bold py-3 px-6 rounded-lg shadow-lg group transition-all duration-300 hover:scale-105"
            aria-label="Share more confessions"
          >
            <span className="relative z-10 flex items-center space-x-2">
              <Heart className="text-indigo-400" size={20} />
              <span>Share More Confessions</span>
            </span>
            <span className="absolute inset-0 border-2 border-transparent rounded-lg bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 -z-10 group-hover:blur-sm transition-all duration-300"></span>
            <span className="absolute inset-0 -z-20 bg-gradient-to-r from-indigo-500/0 via-blue-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></span>
          </button>
        </div>

        <div 
          ref={confessionsContainerRef}
          className="transition-all duration-500 ease-in-out"
          style={{ 
            minHeight: confessions.length ? (confessionsHeight ? confessionsHeight + 'px' : 'auto') : '0px'
          }}
        >
          {confessions.length > 0 && (
            <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-5 shadow-lg border border-gray-800/50 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-5">
                <Star className="text-cyan-400" size={20} />
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Starlit Confessions
                </h2>
              </div>
              <ul className="space-y-4">
                {confessions.map((conf, index) => (
                  <li
                    key={conf.id}
                    id={`confession-${conf.id}`}
                    ref={index === confessions.length - 1 ? lastConfessionRef : null}
                    className="bg-gray-800/70 p-4 rounded-xl shadow-sm text-gray-200 border border-gray-700/30 hover:border-gray-600/50 transform hover:-translate-y-1 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-500 animate-fadeIn"
                  >
                    {editingId === conf.id ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value.slice(0, maxLength))}
                          className="w-full p-2 rounded-lg bg-gray-700/80 text-gray-200 border border-gray-600/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 resize-y"
                          rows="3"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <div className="text-gray-400 text-sm font-mono">
                            {editText.length} / {maxLength}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => saveEdit(conf.id)}
                              className="flex items-center space-x-1 bg-indigo-500 text-white py-1 px-3 rounded-lg hover:bg-indigo-600 transition-colors"
                              aria-label="Save edited confession"
                            >
                              <span>Save</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="flex items-center space-x-1 bg-gray-600 text-gray-200 py-1 px-3 rounded-lg hover:bg-gray-500 transition-colors"
                              aria-label="Cancel editing"
                            >
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-indigo-400 font-medium text-sm">
                            {conf.username || 'Anonymous'}
                          </span>
                        </div>
                        <p className="text-gray-200">{conf.text}</p>
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-700/30">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => toggleLikeConfession(conf.id)}
                              className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400 transition-colors"
                              aria-label={userLikes.has(conf.id) ? `Unlike confession ${conf.id}` : `Like confession ${conf.id}`}
                            >
                              <Heart 
                                size={16} 
                                className={userLikes.has(conf.id) ? "text-indigo-400 fill-indigo-400" : ""} 
                              />
                              <span>{conf.hearts || 0}</span>
                            </button>
                            <button
                              onClick={() => toggleShowReplies(conf.id)}
                              className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400 transition-colors"
                              aria-label={showReplies[conf.id] ? `Hide replies for confession ${conf.id}` : `Show replies for confession ${conf.id}`}
                            >
                              <MessageSquare size={16} />
                              <span>{conf.reply_count || 0}</span>
                            </button>
                            {conf.user_id === userId && canModify(conf.timestamp) && (
                              <>
                                <button
                                  onClick={() => startEditing(conf.id, conf.text)}
                                  className="text-gray-400 hover:text-gray-200 transition-colors"
                                  aria-label={`Edit confession ${conf.id}`}
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => deleteConfession(conf.id)}
                                  className="text-gray-400 hover:text-gray-200 transition-colors"
                                  aria-label={`Delete confession ${conf.id}`}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">
                            {new Date(conf.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {showReplies[conf.id] && (
                          <div className="mt-4">
                            <form onSubmit={(e) => handleReplySubmit(e, conf.id)} className="mb-4">
                              <textarea
                                value={replyText[conf.id] || ''}
                                onChange={(e) => setReplyText(prev => ({ ...prev, [conf.id]: e.target.value.slice(0, maxLength) }))}
                                placeholder="Write a reply..."
                                className="w-full p-2 rounded-lg bg-gray-700/80 text-gray-200 border border-gray-600/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 resize-y placeholder-gray-500 transition-all duration-300"
                                rows="2"
                                aria-label="Reply input"
                              />
                              <div className="flex justify-between items-center mt-2">
                                <div className="text-gray-400 text-sm font-mono">
                                  {(replyText[conf.id] || '').length} / {maxLength}
                                </div>
                                <button
                                  type="submit"
                                  disabled={!replyText[conf.id]?.trim()}
                                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-1 px-3 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                                  aria-label="Submit reply"
                                >
                                  <Send size={16} />
                                  <span>Reply</span>
                                </button>
                              </div>
                            </form>
                            {replies[conf.id]?.length > 0 ? (
                              <ul className="space-y-2">
                                {replies[conf.id].map(reply => (
                                  <li
                                    key={reply.id}
                                    className="bg-gray-900/50 p-2 rounded-lg text-gray-300 text-sm border border-gray-800/50"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <span className="text-indigo-400 font-medium">
                                          {reply.username || 'Anonymous'}
                                        </span>
                                        <p className="mt-1">{reply.text}</p>
                                      </div>
                                      {reply.user_id === userId && canModify(reply.timestamp) && (
                                        <button
                                          onClick={() => deleteReply(conf.id, reply.id)}
                                          className="text-gray-400 hover:text-gray-200 transition-colors"
                                          aria-label={`Delete reply ${reply.id}`}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      )}
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1">
                                      {new Date(reply.timestamp).toLocaleString()}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-400 text-sm">No replies yet.</p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {loading && (
                <div className="flex items-center justify-center space-x-2 text-indigo-400 mt-4 animate-fadeIn">
                  <Star size={20} className="animate-spin" />
                  <span>Loading Confessions...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;