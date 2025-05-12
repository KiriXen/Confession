import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Heart, Sparkles, Trash2, Edit2, MessageSquare, ArrowUp } from 'lucide-react';
import { neon } from '@neondatabase/serverless';
import { quotes } from './quotes';
import CryptoJS from 'crypto-js';
import debounce from 'lodash.debounce';
import ConfessionForm from '../components/ConfessionForm';
import StarField from '../components/StarField';
import NightSkyBg from '../components/NightSkyBg';
import DraggableQuote from '../components/DraggableQuote';
import SettingsModal from '../components/settings';

const isLowEndDevice = () => {
  const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 4;
  const hasLowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  return hasLowMemory || hasLowCores || window.innerWidth <= 768;
};

const Confess = () => {
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [modalTop, setModalTop] = useState(0);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [starCount, setStarCount] = useState(() => {
    const saved = localStorage.getItem('starCount');
    return saved ? Number(saved) : isLowEndDevice() ? 60 : 200;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('skyTheme') || 'Nebula');
  const [animationSpeed, setAnimationSpeed] = useState(() => {
    const saved = localStorage.getItem('animationSpeed');
    return saved ? Number(saved) : 1;
  });
  const [nebulaOpacity, setNebulaOpacity] = useState(() => {
    const saved = localStorage.getItem('nebulaOpacity');
    return saved ? Number(saved) : 0.5;
  });
  const maxLength = 2000;
  const hashedPassword = 'ff4f8e4f387c4f107f4d3bde4a699aaf5511942fbcf88ab23950b842176c5962';
  const confessionsContainerRef = useRef(null);
  const observerRef = useRef(null);
  const modalRef = useRef(null);
  const [confessionsHeight, setConfessionsHeight] = useState(0);
  const isLowEnd = isLowEndDevice();

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString('en-US', {
        timeZone: userTimeZone,
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
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
    const handleScroll = debounce(() => {
      setShowBackToTop(window.scrollY > 200);
      updateModalPosition();
    }, 100);
    const handleResize = debounce(updateModalPosition, 100);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      handleScroll.cancel();
      handleResize.cancel();
    };
  }, []);

  const updateModalPosition = () => {
    if (!modalRef.current) return;
    const viewportHeight = window.innerHeight;
    const modalHeight = modalRef.current.offsetHeight;
    const scrollY = window.scrollY;
    const topPosition = scrollY + (viewportHeight - modalHeight) / 2;
    setModalTop(topPosition);
  };

  useEffect(() => {
    if (showPasswordModal) {
      updateModalPosition();
    }
  }, [showPasswordModal]);

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
          await sql`ALTER TABLE confessions ADD COLUMN user_id TEXT`;
        }
        if (!confessionColumnNames.includes('username')) {
          await sql`ALTER TABLE confessions ADD COLUMN username TEXT`;
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
          await sql`ALTER TABLE replies ADD COLUMN username TEXT`;
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
      const likes = await sql`SELECT confession_id FROM likes WHERE user_id = ${userId}`;
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
          reply_count: Number(localReplies[conf.id]?.length || 0),
        }));
        setConfessions(prev => (pageNum === 1 ? paginated : [...prev, ...paginated]));
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
        reply_count: Number(conf.reply_count || 0),
      }));
      setConfessions(prev => (pageNum === 1 ? sanitizedResult : [...prev, ...sanitizedResult]));
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

  const lastConfessionRef = useCallback(
    node => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            fetchConfessions(page + 1);
          }
        },
        { threshold: 0.1 }
      );
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, page, fetchConfessions]
  );

  useEffect(() => {
    if (confessionsContainerRef.current && confessions.length > 0) {
      const currentHeight = confessionsContainerRef.current.offsetHeight;
      setConfessionsHeight(Math.max(currentHeight, confessionsHeight));
    } else if (confessions.length === 0) {
      setConfessionsHeight(0);
    }
  }, [confessions]);

  const handlePasswordSubmit = () => {
    const hashedInput = CryptoJS.SHA256(passwordInput).toString();
    if (hashedInput === hashedPassword) {
      setUsername(tempUsername);
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
    setPasswordError('');
    setTempUsername('');
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      reply_count: 0,
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
      username: effectiveUsername,
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
            conf.id === confessionId ? { ...conf, reply_count: Number(conf.reply_count || 0) + 1 } : conf
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
          conf.id === confessionId ? { ...conf, reply_count: Number(conf.reply_count || 0) + 1 } : conf
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
            conf.id === confessionId ? { ...conf, reply_count: Number(conf.reply_count || 0) - 1 } : conf
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
          conf.id === confessionId ? { ...conf, reply_count: Number(conf.reply_count || 0) - 1 } : conf
        )
      );
    } catch (err) {
      setError('Failed to delete reply. Please try again.');
      console.error('[ERROR] Delete reply failed:', err);
    }
  };

  const toggleLikeConfession = useCallback(
    async (id) => {
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
          await sql`DELETE FROM likes WHERE user_id = ${userId} AND confession_id = ${id}`;
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
            prev.map(conf => (conf.id === id ? { ...conf, hearts: updated[0].hearts } : conf))
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
            prev.map(conf => (conf.id === id ? { ...conf, hearts: updated[0].hearts } : conf))
          );
        }
      } catch (err) {
        setError('Failed to toggle like. Please try again.');
        console.error('[ERROR] Toggle like failed:', err);
      }
    },
    [userId, userLikes, useLocalStorage]
  );

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
      await sql`UPDATE confessions SET text = ${editText} WHERE id = ${id}`;
      setConfessions(prev => prev.map(conf => (conf.id === id ? { ...conf, text: editText } : conf)));
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20 pb-16 px-4 sm:px-6 relative overflow-y-auto">
      <NightSkyBg theme={theme} isLowEnd={isLowEnd} starCount={starCount} nebulaOpacity={nebulaOpacity} animationSpeed={animationSpeed} />
      <StarField starCount={starCount} isLowEnd={isLowEnd} animationSpeed={animationSpeed} />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        starCount={starCount}
        setStarCount={setStarCount}
        theme={theme}
        setTheme={setTheme}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        nebulaOpacity={nebulaOpacity}
        setNebulaOpacity={setNebulaOpacity}
      />

      {quote && quoteVisible && <DraggableQuote quote={quote} onClose={() => setQuoteVisible(false)} />}

      <div className="text-center">
        <h1 className="text-5xl md:text-5xl font-bold text-white drop-shadow-lg mb-4 tracking-tight">
          Welcome to Sam's Basement
        </h1>
        <p className="text-base text-gray-300 max-w-lg mx-auto">
          Pour your soul into the stars and share your deepest confessions or else get cooked.
        </p>
      </div>

      <div className="w-full max-w-xl z-10 mt-8">
        <div className="bg-red-900/70 backdrop-blur-md rounded-xl p-4 shadow-lg border border-red-600/50 text-red-200 text-sm sm:text-base">
          <div className="flex items-center space-x-2">
            <Sparkles size={16} className="text-red-400" />
            <p>
              Stepping away from socials and everything else for a while.. maybe forever if you're reading this. It's
              been real, all the laughs, the late-night convos, the weird posts.. I'll carry all that with me 💔. You've
              all been too good to me fr 😭. Can't really sum it up in a few words but js know I'm grateful and maybe we'll
              cross paths again or maybe not... either way, take care of yourselves everyone :3
            </p>
          </div>
        </div>
      </div>

      <ConfessionForm
        confession={confession}
        setConfession={setConfession}
        username={username}
        setUsername={setUsername}
        isAnonymous={isAnonymous}
        setIsAnonymous={setIsAnonymous}
        showSuccess={showSuccess}
        error={error}
        showPasswordModal={showPasswordModal}
        setShowPasswordModal={setShowPasswordModal}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
        tempUsername={tempUsername}
        setTempUsername={setTempUsername}
        modalTop={modalTop}
        handleSubmit={handleSubmit}
        handlePasswordSubmit={handlePasswordSubmit}
        handlePasswordCancel={handlePasswordCancel}
        setShowSettingsModal={setShowSettingsModal}
      />

      <div ref={confessionsContainerRef} className="w-full max-w-xl z-10 space-y-4 mt-8" style={{ minHeight: confessionsHeight }}>
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
                  onChange={e => setEditText(e.target.value.slice(0, maxLength))}
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
                      <span className="text-xs">{conf.hearts || 0}</span>
                    </button>
                    <button
                      onClick={() => toggleShowReplies(conf.id)}
                      className="flex items-center space-x-1 text-gray-400 hover:text-indigo-400 transition-colors"
                      aria-label={showReplies[conf.id] ? 'Hide replies' : 'Show replies'}
                    >
                      <MessageSquare size={14} />
                      <span className="text-xs">{conf.reply_count || 0}</span>
                    </button>
                  </div>
                  <p className="text-gray-400 text-xs">{formatTimestamp(conf.timestamp)}</p>
                </div>
                {showReplies[conf.id] && (
                  <div className="mt-4">
                    <form onSubmit={e => handleReplySubmit(e, conf.id)} className="mb-4">
                      <textarea
                        value={replyText[conf.id] || ''}
                        onChange={e => setReplyText(prev => ({ ...prev, [conf.id]: e.target.value }))}
                        placeholder="Write a reply..."
                        className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-200 border border-gray-700/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 resize-y placeholder-gray-500 transition-all duration-300"
                        rows="2"
                        aria-label="Reply input"
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={!replyText[conf.id]?.trim()}
                          className="bg-indigo-500 text-white text-sm py-1 px-3 rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          aria-label="Submit reply"
                        >
                          Reply
                        </button>
                      </div>
                    </form>
                    {replies[conf.id]?.map(reply => (
                      <div key={reply.id} className="bg-gray-800/50 p-3 rounded-lg mb-2">
                        <div className="flex justify-between items-start">
                          <p className="text-gray-300 text-sm">{reply.text}</p>
                          {reply.user_id === userId && canModify(reply.timestamp) && (
                            <button
                              onClick={() => deleteReply(conf.id, reply.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                              aria-label="Delete reply"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          {reply.username} · {formatTimestamp(reply.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        {loading && <p className="text-gray-400 text-center">Loading...</p>}
      </div>

      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-8 right-8 bg-indigo-500 text-white p-3 rounded-full shadow-lg hover:bg-indigo-600 transition-colors"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Confess;