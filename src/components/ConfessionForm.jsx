import React from 'react';
import { Lock, Send, Settings, Sparkles } from 'lucide-react';

const ConfessionForm = ({
  confession,
  setConfession,
  username,
  setUsername,
  isAnonymous,
  setIsAnonymous,
  showSuccess,
  error,
  showPasswordModal,
  setShowPasswordModal,
  passwordInput,
  setPasswordInput,
  passwordError,
  setPasswordError,
  tempUsername,
  setTempUsername,
  modalTop,
  handleSubmit,
  handlePasswordSubmit,
  handlePasswordCancel,
  setShowSettingsModal,
}) => {
  const maxLength = 2000;
  const maxUsernameLength = 20;
  const restrictedNames = ['sam', 'sammy', 'kirixen'];

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value.slice(0, maxUsernameLength);
    const lowerCaseUsername = newUsername.toLowerCase();
    if (!isAnonymous && restrictedNames.some(name => lowerCaseUsername.includes(name))) {
      setTempUsername(newUsername);
      setShowPasswordModal(true);
      setPasswordInput('');
      setPasswordError('');
    } else {
      setUsername(newUsername);
    }
  };

  return (
    <div className="w-full max-w-xl z-10 space-y-8 mt-8">
      {showPasswordModal && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40">
          <div
            className="absolute left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md"
            style={{ top: `${modalTop}px` }}
          >
            <div className="bg-gray-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-800/50 shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Lock size={20} className="text-indigo-400" />
                <h2 className="text-xl text-white font-semibold">Restricted Username</h2>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                The username "{tempUsername}" is restricted. Please enter the password to use it.
              </p>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 rounded-lg bg-gray-800/80 text-gray-200 border border-gray-700/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 placeholder-gray-500 transition-all duration-300"
                aria-label="Password input"
              />
              {passwordError && <p className="text-red-400 text-sm mt-2">{passwordError}</p>}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={handlePasswordCancel}
                  className="bg-gray-700 text-white text-sm py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  aria-label="Cancel password entry"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  className="bg-indigo-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors"
                  aria-label="Submit password"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-4 shadow-lg border border-gray-800/50 transition-all duration-300 hover:shadow-indigo-500/10">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={isAnonymous ? '' : username}
                onChange={handleUsernameChange}
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
                onChange={e => setIsAnonymous(e.target.checked)}
                className="form-checkbox h-4 w-4 text-indigo-400 bg-gray-800 border-gray-700 focus:ring-indigo-400"
                aria-label="Stay anonymous"
              />
              <span className="text-xs sm:text-xs">Stay anonymous?</span>
            </label>
          </div>
          <textarea
            value={confession}
            onChange={e => setConfession(e.target.value.slice(0, maxLength))}
            placeholder="Write your confession..."
            className="w-full p-4 rounded-xl bg-gray-800/80 text-gray-200 border border-gray-700/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 resize-y placeholder-gray-500 transition-all duration-300"
            rows="4"
            aria-label="Confession input"
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-gray-400 text-xs sm:text-xs font-mono">
              {confession.length} / {maxLength}
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowSettingsModal(true)}
                className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all duration-300 group"
                aria-label="Open night sky settings"
              >
                <Settings size={14} />
                <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Night Sky Settings
                </span>
              </button>
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
    </div>
  );
};

export default ConfessionForm;