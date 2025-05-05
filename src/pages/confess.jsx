import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Heart, Sparkles, Send, Trash2, Star, X, Edit2, MessageSquare } from 'lucide-react';
import { neon } from '@neondatabase/serverless';
import { quotes } from './quotes';

const StarField = () => {
  const stars = useMemo(() => {
    const starElements = Array.from({ length: 100 }, (_, SCIENCE) => {
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
            key={SCIENCE}
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
            key={SCIENCE}
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
            key={SCIENCE}
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

    const shootingStars = Array.from({ length: 3 }, (_, SCIENCE) => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const angle = Math.random() * 45 - 22.5;
      const delay = Math.random() * 15 + 5;
      
      return (
        <div
          key={`shooting-${SCIENCE}`}
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

    const starClusters = Array.from({ length: 5 }, (_, SCIENCE) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 80 + 40;
      
      return (
        <div
          key={`cluster-${SCIENCE}`}
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
      className="fixed w-11/12 sm:w-64 bg-gray-900/60 backdrop-blur-md rounded-xl p-4 sm:p-4 shadow-lg border border-gray-800/50 z-20 transition-all duration-500 hover:shadow-indigo-500/20 cursor-move"
      style={{ 
        left: position.x, 
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      aria-label="Draggable quote card"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-1 mb-2">
          <Heart size={14} className="text-indigo-400" />
          <span className="text-indigo-400 font-medium text-xs">Quotes</span>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close quote"
        >
          <X size={14} />
        </button>
      </div>
      <p className="text-gray-200 italic text-xs sm:text-sm unselectable">"{quote.text}"</p>
      <p className="text-indigo-400 text-right mt-1 font-medium text-xs unselectable">— {quote.author}</p>
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
  const [userId] = useState(() => Math.random().toString(36).slice(2));
  const [username, setUsername] = useState(() => localStorage.getItem('username') || 'Anonymous');
  const [isAnonymous, setIsAnonymous] = useState(() => localStorage.getItem('isAnonymous') === 'true');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [userLikes, setUserLikes] = useState(new Set());
  const [replies, setReplies] = useState({});
  const [replyText, setReplyText] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const maxLength = 2000;
  const maxUsernameLength = 20;
  const confessionsContainerRef = useRef(null);
  const observerRef = useRef(null);
  const [confessionsHeight, setConfessionsHeight] = useState(0);

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatTimestamp = (timestamp) => {
    try {
      const formatted = new Date(timestamp).toLocaleString('en-US', {
        timeZone: userTimeZone,
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return formatted;
    } catch (err) {
      console.error('[ERROR] Invalid timestamp:', timestamp, err);
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  useEffect(() => {
    localStorage.setItem('username', username);
    localStorage.setItem('isAnonymous', isAnonymous.toString());
  }, [username, isAnonymous]);

  useEffect(() => {
    const initDb = async () => {
      const databaseUrl = process.env.REACT_APP_NEON_DATABASE_URL;

      if (!databaseUrl) {
        console.error('[ERROR] VITE_NEON_DATABASE_URL is not defined in .env');
        setError('Database URL is missing. Using local storage instead.');
        setUseLocalStorage(true);
        const localConfessions = JSON.parse(localStorage.getItem('confessions') || '[]');
        const localLikes = JSON.parse(localStorage.getItem('userLikes') || '[]');
        const localReplies = JSON.parse(localStorage.getItem('replies') || '{}');
        setConfessions(localConfessions);
        setUserLikes(new Set(localLikes));
        setReplies(localReplies);
        return;
      }

      const sql = neon(databaseUrl);

      try {
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
        const confessionColumns = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'confessions'
        `;
        const confessionColumnNames = confessionColumns.map(col => col.column_name);
        if (!confessionColumnNames.includes('user_id')) {
          await sql`
            ALTER TABLE confessions
            ADD COLUMN user_id TEXT
          `;
        }
        if (!confessionColumnNames.includes('username')) {
          await sql`
            ALTER TABLE confessions
            ADD COLUMN username TEXT
          `;
        }
        await sql`
          CREATE TABLE IF NOT EXISTS likes (
            user_id TEXT NOT NULL,
            confession_id BIGINT NOT NULL,
            PRIMARY KEY (user_id, confession_id),
            FOREIGN KEY (confession_id) REFERENCES confessions(id) ON DELETE CASCADE
          )
        `;
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
        const replyColumns = await sql`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'replies'
        `;
        const replyColumnNames = replyColumns.map(col => col.column_name);
        if (!replyColumnNames.includes('username')) {
          await sql`
            ALTER TABLE replies
            ADD COLUMN username TEXT
          `;
        }
        fetchConfessions(1);
        fetchUserLikes();
      } catch (err) {
        console.error('[ERROR] Database initialization failed:', err);
        setError('Failed to connect to database. Using local storage instead.');
        setUseLocalStorage(true);
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

  const fetchUserLikes = useCallback(async () => {
    if (useLocalStorage) return;
    try {
      const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);
      const likes = await sql`
        SELECT confession_id FROM likes WHERE user_id = ${userId}
      `;
      setUserLikes(new Set(likes.map(like => like.confession_id)));
    } catch (err) {
      console.error('[ERROR] Fetch user likes failed:', err);
    }
  }, [userId, useLocalStorage]);

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
          reply_count: Number(localReplies[conf.id]?.length || 0)
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
      const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);
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
      const sanitizedResult = result.map(conf => ({
        ...conf,
        reply_count: Number(conf.reply_count || 0)
      }));
      setConfessions(prev => pageNum === 1 ? sanitizedResult : [...prev, ...sanitizedResult]);
      setHasMore(result.length === limit);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load confessions. Please try again.');
      console.error('[ERROR] Fetch confessions failed:', err);
    } finally {
      setLoading(false);
    }
  }, [useLocalStorage]);

  const fetchReplies = useCallback(async (confessionId) => {
    if (useLocalStorage) {
      const localReplies = JSON.parse(localStorage.getItem('replies') || '{}');
      return localReplies[confessionId] || [];
    }

    try {
      const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);
      const result = await sql`
        SELECT * FROM replies
        WHERE confession_id = ${confessionId}
        ORDER BY timestamp ASC
      `;
      return result;
    } catch (err) {
      setError('Failed to load replies. Please try again.');
      console.error('[ERROR] Fetch replies failed:', err);
      return [];
    }
  }, [useLocalStorage]);

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

  useEffect(() => {
    if (confessionsContainerRef.current && confessions.length > 0) {
      const currentHeight = confessionsContainerRef.current.offsetHeight;
      setConfessionsHeight(Math.max(currentHeight, confessionsHeight));
    } else if (confessions.length === 0) {
      setConfessionsHeight(0);
    }
  }, [confessions]);

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
      const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);
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
    } catch (err) {
      setError('Failed to submit confession. Please try again.');
      console.error('[ERROR] Submit confession failed:', err);
    }
  };

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
            conf.id === confessionId
              ? { ...conf, reply_count: Number(conf.reply_count || 0) + 1 }
              : conf
          )
        );
      } catch (err) {
        setError('Failed to save reply locally.');
        console.error(err);
      }
      return;
    }

    try {
      const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);
      await sql`
        INSERT INTO replies (id, confession_id, text, timestamp, user_id, username)
        VALUES (${newReply.id}, ${newReply.confession_id}, ${newReply.text}, ${newReply.timestamp}, ${newReply.user_id}, ${newReply.username})
      `;
      const updatedReplies = await fetchReplies(confessionId);
      setReplies(prev => ({ ...prev, [confessionId]: updatedReplies }));
      setReplyText(prev => ({ ...prev, [confessionId]: '' }));
      setConfessions(prev =>
        prev.map(conf =>
          conf.id === confessionId
            ? { ...conf, reply_count: Number(conf.reply_count || 0) + 1 }
            : conf
        )
      );
    } catch (err) {
      setError('Failed to submit reply. Please try again.');
      console.error('[ERROR] Submit reply failed:', err);
    }
  };

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
            conf.id === confessionId
              ? { ...conf, reply_count: Number(conf.reply_count || 0) - 1 }
              : conf
          )
        );
      } catch (err) {
        setError('Failed to delete reply locally.');
        console.error(err);
      }
      return;
    }

    try {
      const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);
      await sql`DELETE FROM replies WHERE id = ${replyId}`;
      const updatedReplies = await fetchReplies(confessionId);
      setReplies(prev => ({ ...prev, [confessionId]: updatedReplies }));
      setConfessions(prev =>
        prev.map(conf =>
          conf.id === confessionId
            ? { ...conf, reply_count: Number(conf.reply_count || 0) - 1 }
            : conf
        )
      );
    } catch (err) {
      setError('Failed to delete reply. Please try again.');
      console.error('[ERROR] Delete reply failed:', err);
    }
  };

  const toggleLikeConfession = useCallback(async (id) => {
    if (useLocalStorage) {
      try {
        const localConfessions = JSON.parse(localStorage.getItem('confessions') || '[]');
        const localLikes = JSON.parse(localStorage.getItem('userLikes') || '[]');
        const hasLiked = localLikes.includes(id);
        
        let updatedConfessions;
        if (hasLiked) {
          updatedConfessions = localConfessions.map(conf =>
            conf.id === id ? { ...conf, hearts: Number(conf.hearts || 0) - 1 } : conf
          );
          const updatedLikes = localLikes.filter(likeId => likeId !== id);
          localStorage.setItem('userLikes', JSON.stringify(updatedLikes));
          setUserLikes(new Set(updatedLikes));
        } else {
          updatedConfessions = localConfessions.map(conf =>
            conf.id === id ? { ...conf, hearts: Number(conf.hearts || 0) + 1 } : conf
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
      const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);
      const hasLiked = userLikes.has(id);
      
      if (hasLiked) {
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
      } else {
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
      }
    } catch (err) {
      setError('Failed to toggle like. Please try again.');
      console.error('[ERROR] Toggle like failed:', err);
    }
  }, [userId, userLikes, useLocalStorage]);

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
      const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);
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
    } catch (err) {
      setError('Failed to edit confession. Please try again.');
      console.error('[ERROR] Edit confession failed:', err);
    }
  };

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
      const sql = neon(process.env.REACT_APP_NEON_DATABASE_URL);
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
    } catch (err) {
      setError('Failed to delete confession. Please try again.');
      console.error('[ERROR] Delete confession failed:', err);
    }
  };

  const canModify = (timestamp) => {
    const FIVE_MINUTES = 5 * 60 * 1000;
    const confessionTime = new Date(timestamp).getTime();
    const currentTime = new Date().getTime();
    return currentTime - confessionTime < FIVE_MINUTES;
  };

  const toggleShowReplies = async (confessionId) => {
    setShowReplies(prev => ({ ...prev, [confessionId]: !prev[confessionId] }));
    if (!showReplies[confessionId] && !replies[confessionId]) {
      const fetchedReplies = await fetchReplies(confessionId);
      setReplies(prev => ({ ...prev, [confessionId]: fetchedReplies }));
    }
  };

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
          <h1 className="text-5xl md:text-5xl font-bold text-white drop-shadow-lg mb-4 tracking-tight">
            Welcome to Sam's Basement
          </h1>
          <p className="text-base text-gray-300 max-w-lg mx-auto">
            Pour your soul into the stars and share your deepest confessions or else get cooked.
          </p>
        </div>

        {/* Important Notification */}
        <div className="bg-red-900/70 backdrop-blur-md rounded-xl p-4 shadow-lg border border-red-600/50 text-red-200 text-sm sm:text-base">
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-red-400" />
            <p>
                Stepping away from socials and everything else for a while.. maybe forever if you're reading this. It's been real, all the laughs, the late-night convos, the weird posts.. I'll carry all that with me 💔. You've all been too good to me fr 😭. Can't really sum it up in a few words but js know I'm grateful and maybe we'll cross paths again or maybe not... either way, take care of yourselves everyone :3
            </p>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-800/50 transition-all duration-300 hover:shadow-indigo-500/10">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={isAnonymous ? '' : username}
                  onChange={(e) => setUsername(e.target.value.slice(0, maxUsernameLength))}
                  placeholder="Enter your username"
                  disabled={isAnonymous}
                  className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-200 border border-gray-700/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 placeholder-gray-500 transition-all duration-300"
                  aria-label="Username input"
                />
                <div className="text-gray-400 text-xs sm:text-xs font-mono">
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
                <span className="text-xs sm:text-xs">Stay anonymous?</span>
              </label>
            </div>
            <textarea
              value={confession}
              onChange={(e) => setConfession(e.target.value.slice(0, maxLength))}
              placeholder="Write your confession under the starry sky..."
              className="w-full p-4 sm:p-4 rounded-xl bg-gray-800/80 text-gray-200 border border-gray-700/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 resize-y placeholder-gray-500 transition-all duration-300"
              rows="4"
              aria-label="Confession input"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-gray-400 text-xs sm:text-xs font-mono">
                {confession.length} / {maxLength}
              </div>
              <button
                type="submit"
                disabled={!confession.trim()}
                className="flex items-center space-x-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium py-1.5 px-3 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                aria-label="Submit confession"
              >
                <Send size={14} />
                <span>Confess</span>
              </button>
            </div>
          </form>

          {showSuccess && (
            <div className="mt-4 p-3 bg-green-900/60 text-green-300 text-sm rounded-lg flex items-center space-x-2 animate-fadeIn">
              <Sparkles size={14} />
              <span>Your confession has been sent to the stars!</span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-900/60 text-red-300 text-sm rounded-lg flex items-center space-x-2 animate-fadeIn">
              <span>{error}</span>
            </div>
          )}
        </div>

        <div ref={confessionsContainerRef} className="space-y-4" style={{ minHeight: confessionsHeight }}>
          {confessions.map((conf, index) => (
            <div
              key={conf.id}
              id={`confession-${conf.id}`}
              ref={index === confessions.length - 1 ? lastConfessionRef : null}
              className="bg-gray-900/60 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-800/50 transition-all duration-300 hover:shadow-indigo-500/10 overflow-hidden"
            >
              {editingId === conf.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value.slice(0, maxLength))}
                    className="w-full p-4 sm:p-4 rounded-xl bg-gray-800/80 text-gray-200 border border-gray-700/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 resize-y placeholder-gray-500 transition-all duration-300"
                    rows="3"
                    aria-label="Edit confession"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-gray-400 text-xs sm:text-xs font-mono">
                      {editText.length} / {maxLength}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => saveEdit(conf.id)}
                        className="bg-indigo-500 text-white text-sm py-1 px-2 rounded-lg hover:bg-indigo-600 transition-colors"
                        aria-label="Save edit"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-700 text-white text-sm py-1 px-2 rounded-lg hover:bg-gray-600 transition-colors"
                        aria-label="Cancel edit"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <p className="text-gray-200 text-base sm:text-base leading-relaxed prose max-w-full">{conf.text}</p>
                    {conf.user_id === userId && canModify(conf.timestamp) && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(conf.id, conf.text)}
                          className="text-gray-400 hover:text-indigo-400 transition-colors"
                          aria-label="Edit confession"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteConfession(conf.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          aria-label="Delete confession"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => toggleLikeConfession(conf.id)}
                        className={`flex items-center space-x-1 ${
                          userLikes.has(conf.id) ? 'text-red-400' : 'text-gray-400'
                        } hover:text-red-400 transition-colors`}
                        aria-label={userLikes.has(conf.id) ? 'Unlike confession' : 'Like confession'}
                      >
                        <Heart size={14} fill={userLikes.has(conf.id) ? 'currentColor' : 'none'} />
                        <span>{conf.hearts || 0}</span>
                      </button>
                      <button
                        onClick={() => toggleShowReplies(conf.id)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400 transition-colors"
                        aria-label={showReplies[conf.id] ? 'Hide replies' : 'Show replies'}
                      >
                        <MessageSquare size={14} />
                        <span>{conf.reply_count || 0}</span>
                      </button>
                    </div>
                    <div className="text-gray-500 text-xs sm:text-xs max-w-full truncate">
                      {formatTimestamp(conf.timestamp)} by {conf.username || 'Anonymous'}
                    </div>
                  </div>
                  {showReplies[conf.id] && (
                    <div className="mt-4 space-y-4">
                      {(replies[conf.id] || []).map(reply => (
                        <div key={reply.id} className="bg-gray-800/50 rounded-lg p-3 relative">
                          <p className="text-gray-300 text-sm sm:text-sm leading-relaxed prose max-w-full">
                            {reply.text}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 gap-2">
                            <span className="text-gray-500 text-xs sm:text-xs max-w-full truncate">
                              {formatTimestamp(reply.timestamp)} by {reply.username || 'Anonymous'}
                            </span>
                            {reply.user_id === userId && canModify(reply.timestamp) && (
                              <button
                                onClick={() => deleteReply(conf.id, reply.id)}
                                className="text-gray-400 hover:text-red-400 transition-colors self-start sm:self-auto p-2 -m-2"
                                aria-label="Delete reply"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <form onSubmit={(e) => handleReplySubmit(e, conf.id)} className="mt-2">
                        <textarea
                          value={replyText[conf.id] || ''}
                          onChange={(e) => setReplyText(prev => ({ ...prev, [conf.id]: e.target.value.slice(0, maxLength) }))}
                          placeholder="Write a reply..."
                          className="w-full p-3 sm:p-3 rounded-lg bg-gray-800/80 text-gray-200 border border-gray-700/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 resize-y placeholder-gray-500 transition-all duration-300"
                          rows="3"
                          aria-label="Reply input"
                        />
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-gray-400 text-xs sm:text-xs font-mono">
                            {(replyText[conf.id] || '').length} / {maxLength}
                          </div>
                          <button
                            type="submit"
                            disabled={!(replyText[conf.id]?.trim())}
                            className="flex items-center space-x-1 bg-indigo-500 text-white text-sm py-1 px-2 rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            aria-label="Submit reply"
                          >
                            <Send size={14} />
                            <span>Reply</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
          {loading && (
            <div className="text-center text-gray-400 py-4 text-sm">Loading more confessions...</div>
          )}
          {!hasMore && confessions.length > 0 && (
            <div className="text-center text-gray-400 py-4 text-sm">No more confessions to load.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;