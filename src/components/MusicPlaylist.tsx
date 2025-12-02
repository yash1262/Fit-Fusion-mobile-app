import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FitFusionLogo from './FitFusionLogo';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  bpm?: number;
  audioUrl?: string;
  youtubeId?: string;
  spotifyUri?: string;
  previewUrl?: string;
  albumArt?: string;
}

interface Playlist {
  id: number;
  name: string;
  category: string;
  description: string;
  duration: string;
  trackCount: number;
  color: string;
  icon: string;
  tracks: Track[];
  spotifyPlaylistId?: string;
}

const MusicPlaylist: React.FC = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const openSpotifyPlaylist = (playlistId: string) => {
    window.open(`https://open.spotify.com/playlist/${playlistId}`, '_blank');
  };

  const playlists: Playlist[] = [
    {
      id: 1,
      name: "HIIT Power",
      category: "High Intensity",
      description: "High-energy beats to fuel your intense workouts",
      duration: "45 min",
      trackCount: 12,
      color: "#708d50",
      icon: "⚡",
      spotifyPlaylistId: "37i9dQZF1DX76Wlfdnj7AP",
      tracks: [
        { id: 1, title: "Stronger", artist: "Kanye West", duration: "5:12", bpm: 140, youtubeId: "PsO6ZnUZI0g" },
        { id: 2, title: "Till I Collapse", artist: "Eminem", duration: "4:57", bpm: 171, youtubeId: "_Yhyp-_hX2s" },
        { id: 3, title: "Eye of the Tiger", artist: "Survivor", duration: "4:05", bpm: 109, youtubeId: "btPJPFnesV4" },
        { id: 4, title: "Lose Yourself", artist: "Eminem", duration: "5:26", bpm: 171, youtubeId: "_Yhyp-_hX2s" },
        { id: 5, title: "Remember the Name", artist: "Fort Minor", duration: "3:50", bpm: 100, youtubeId: "VDvr08sCPOc" },
        { id: 6, title: "Can't Hold Us", artist: "Macklemore", duration: "4:18", bpm: 146, youtubeId: "2zNSgSzhBfM" },
        { id: 7, title: "Thunderstruck", artist: "AC/DC", duration: "4:52", bpm: 133, youtubeId: "v2AC41dglnM" },
        { id: 8, title: "We Will Rock You", artist: "Queen", duration: "2:02", bpm: 81, youtubeId: "-tJYN-eG1zk" },
        { id: 9, title: "Pump It", artist: "Black Eyed Peas", duration: "3:33", bpm: 130, youtubeId: "ZaI2IlHwmgQ" },
        { id: 10, title: "Power", artist: "Kanye West", duration: "4:52", bpm: 120, youtubeId: "L53gjP-TtGE" },
        { id: 11, title: "Run This Town", artist: "Jay-Z", duration: "4:27", bpm: 140 },
        { id: 12, title: "Radioactive", artist: "Imagine Dragons", duration: "3:06", bpm: 136 }
      ]
    },
    {
      id: 2,
      name: "Zumba Vibes",
      category: "Dance Cardio",
      description: "Latin rhythms and dance beats for your Zumba sessions",
      duration: "50 min",
      trackCount: 15,
      color: "#8aa665",
      icon: "💃",
      spotifyPlaylistId: "37i9dQZF1DX10zKzsJ2jva",
      tracks: [
        { id: 1, title: "Despacito", artist: "Luis Fonsi", duration: "3:48", bpm: 89, youtubeId: "kJQP7kiw5Fk" },
        { id: 2, title: "Bailando", artist: "Enrique Iglesias", duration: "4:03", bpm: 130, youtubeId: "NUsoVlDFqZg" },
        { id: 3, title: "La Bicicleta", artist: "Shakira", duration: "3:49", bpm: 95, youtubeId: "8OvMwV2ZXPQ" },
        { id: 4, title: "Dura", artist: "Daddy Yankee", duration: "3:20", bpm: 95, youtubeId: "sGIm0-dQd8M" },
        { id: 5, title: "Mi Gente", artist: "J Balvin", duration: "3:10", bpm: 96, youtubeId: "wnJ6LuUFpMo" },
        { id: 6, title: "Taki Taki", artist: "DJ Snake", duration: "3:32", bpm: 96, youtubeId: "ixkoVwKQaJg" },
        { id: 7, title: "Con Calma", artist: "Daddy Yankee", duration: "3:12", bpm: 94, youtubeId: "DiItGE3eAyQ" },
        { id: 8, title: "Vivir Mi Vida", artist: "Marc Anthony", duration: "4:02", bpm: 186, youtubeId: "YXnjy5YlDwk" },
        { id: 9, title: "Chantaje", artist: "Shakira", duration: "3:16", bpm: 96, youtubeId: "6Mgqbai3fKo" },
        { id: 10, title: "Felices los 4", artist: "Maluma", duration: "3:50", bpm: 96, youtubeId: "t_jHrUE5IOk" },
        { id: 11, title: "Échame La Culpa", artist: "Luis Fonsi", duration: "2:54", bpm: 96, youtubeId: "W6HJYUJeb2Y" },
        { id: 12, title: "X", artist: "Nicky Jam", duration: "3:15", bpm: 92, youtubeId: "tkFpNVxzhTs" },
        { id: 13, title: "Calma", artist: "Pedro Capó", duration: "3:59", bpm: 94, youtubeId: "vZw35VUBdzo" },
        { id: 14, title: "Reggaetón Lento", artist: "CNCO", duration: "3:50", bpm: 92, youtubeId: "7YrpmZFixp0" },
        { id: 15, title: "Havana", artist: "Camila Cabello", duration: "3:37", bpm: 105 }
      ]
    },
    {
      id: 3,
      name: "Yoga Flow",
      category: "Mindful Movement",
      description: "Calming melodies for your yoga practice",
      duration: "60 min",
      trackCount: 10,
      color: "#5a7340",
      icon: "🧘",
      spotifyPlaylistId: "37i9dQZF1DX9uKNf5jGX6m",
      tracks: [
        { id: 1, title: "Weightless", artist: "Marconi Union", duration: "8:10", youtubeId: "UfcAVejslrU" },
        { id: 2, title: "Breathing Light", artist: "Nitin Sawhney", duration: "6:15", youtubeId: "5R-rbzcEM8A" },
        { id: 3, title: "Om Namah Shivaya", artist: "Deva Premal", duration: "7:30", youtubeId: "YfZlGGQpvIU" },
        { id: 4, title: "Celestial Aura", artist: "Anugama", duration: "5:45", youtubeId: "ziN5xC8V-Yw" },
        { id: 5, title: "Tibetan Bowls", artist: "Karunesh", duration: "6:20", youtubeId: "qgZWGLVdVQE" },
        { id: 6, title: "River Flows in You", artist: "Yiruma", duration: "3:40", youtubeId: "7maJOI3QMu0" },
        { id: 7, title: "Spiegel im Spiegel", artist: "Arvo Pärt", duration: "8:00", youtubeId: "TJ6Mzvh3XCc" },
        { id: 8, title: "Gayatri Mantra", artist: "Deva Premal", duration: "7:10", youtubeId: "c3KtkZT8Z1k" },
        { id: 9, title: "Pure Shores", artist: "All Saints", duration: "4:30", youtubeId: "NctHXL5e_Ew" },
        { id: 10, title: "Breathe", artist: "Telepopmusik", duration: "4:45", youtubeId: "vyut3GyQtn0" }
      ]
    },
    {
      id: 4,
      name: "Gym Motivation",
      category: "Strength Training",
      description: "Powerful tracks to push through your limits",
      duration: "55 min",
      trackCount: 14,
      color: "#708d50",
      icon: "💪",
      spotifyPlaylistId: "37i9dQZF1DX70RN3TfWWJh",
      tracks: [
        { id: 1, title: "Gonna Fly Now", artist: "Bill Conti", duration: "2:47", bpm: 128, youtubeId: "ioE_O7Lm0I4" },
        { id: 2, title: "The Distance", artist: "Cake", duration: "3:00", bpm: 120, youtubeId: "F_HoMkkRHv8" },
        { id: 3, title: "Sabotage", artist: "Beastie Boys", duration: "2:58", bpm: 164, youtubeId: "z5rRZdiu1UE" },
        { id: 4, title: "Killing in the Name", artist: "Rage Against", duration: "5:14", bpm: 103, youtubeId: "bWXazVhlyxQ" },
        { id: 5, title: "Enter Sandman", artist: "Metallica", duration: "5:31", bpm: 123, youtubeId: "CD-E-LDc384" },
        { id: 6, title: "Bulls on Parade", artist: "Rage Against", duration: "3:51", bpm: 85, youtubeId: "3L4YrGaR8E4" },
        { id: 7, title: "Cochise", artist: "Audioslave", duration: "3:42", bpm: 130, youtubeId: "KDMvN45sjo4" },
        { id: 8, title: "Break Stuff", artist: "Limp Bizkit", duration: "2:46", bpm: 105, youtubeId: "ZpUYjpKg9KY" },
        { id: 9, title: "Down with the Sickness", artist: "Disturbed", duration: "4:38", bpm: 95, youtubeId: "09LTT0xwdfw" },
        { id: 10, title: "Headstrong", artist: "Trapt", duration: "4:45", bpm: 95, youtubeId: "HTvu1SCN0W8" },
        { id: 11, title: "Last Resort", artist: "Papa Roach", duration: "3:20", bpm: 104, youtubeId: "j0lSpNtjPM8" },
        { id: 12, title: "Bring Me to Life", artist: "Evanescence", duration: "3:56", bpm: 95, youtubeId: "3YxaaGgTQYM" },
        { id: 13, title: "In the End", artist: "Linkin Park", duration: "3:36", bpm: 105, youtubeId: "eVTXPUF4Oz4" },
        { id: 14, title: "Numb", artist: "Linkin Park", duration: "3:07", bpm: 105, youtubeId: "kXYiU_JCYtU" }
      ]
    },
    {
      id: 5,
      name: "Meditation Deep",
      category: "Relaxation",
      description: "Ambient sounds for deep meditation and mindfulness",
      duration: "40 min",
      trackCount: 8,
      color: "#b0b1ab",
      icon: "🕉️",
      spotifyPlaylistId: "37i9dQZF1DWZqd5JICZI0u",
      tracks: [
        { id: 1, title: "Deep Theta", artist: "Meditation Relax Club", duration: "6:00", youtubeId: "WPni755-Krg" },
        { id: 2, title: "432 Hz Healing", artist: "Nature Sounds", duration: "5:30", youtubeId: "1ZYbU82GVz4" },
        { id: 3, title: "Chakra Balance", artist: "Meditation Music", duration: "7:15", youtubeId: "ARoih8HTPGk" },
        { id: 4, title: "Ocean Waves", artist: "Nature Therapy", duration: "4:45", youtubeId: "V1bFr2SWP1I" },
        { id: 5, title: "Forest Rain", artist: "Ambient Sounds", duration: "5:20", youtubeId: "nDq6TstdEi8" },
        { id: 6, title: "Singing Bowls", artist: "Tibetan Monks", duration: "6:30", youtubeId: "qgZWGLVdVQE" },
        { id: 7, title: "White Noise", artist: "Sleep Sounds", duration: "3:00", youtubeId: "nMfPqeZjc2c" },
        { id: 8, title: "Binaural Beats", artist: "Brainwave Music", duration: "8:00", youtubeId: "vwzOAXU7YKY" }
      ]
    },
    {
      id: 6,
      name: "Running Rhythm",
      category: "Cardio",
      description: "Steady beats to match your running pace",
      duration: "45 min",
      trackCount: 13,
      color: "#8aa665",
      icon: "🏃",
      tracks: [
        { id: 1, title: "Born to Run", artist: "Bruce Springsteen", duration: "4:30", bpm: 147 },
        { id: 2, title: "Run the World", artist: "Beyoncé", duration: "3:56", bpm: 127 },
        { id: 3, title: "Don't Stop Me Now", artist: "Queen", duration: "3:29", bpm: 156 },
        { id: 4, title: "Uptown Funk", artist: "Mark Ronson", duration: "4:30", bpm: 115 },
        { id: 5, title: "Shut Up and Dance", artist: "Walk the Moon", duration: "3:19", bpm: 128 },
        { id: 6, title: "Happy", artist: "Pharrell Williams", duration: "3:53", bpm: 160 },
        { id: 7, title: "Can't Stop", artist: "Red Hot Chili Peppers", duration: "4:29", bpm: 118 },
        { id: 8, title: "Seven Nation Army", artist: "The White Stripes", duration: "3:52", bpm: 124 },
        { id: 9, title: "Feel It Still", artist: "Portugal. The Man", duration: "2:43", bpm: 79 },
        { id: 10, title: "Believer", artist: "Imagine Dragons", duration: "3:24", bpm: 125 },
        { id: 11, title: "Thunder", artist: "Imagine Dragons", duration: "3:07", bpm: 168 },
        { id: 12, title: "Whatever It Takes", artist: "Imagine Dragons", duration: "3:21", bpm: 145 },
        { id: 13, title: "Natural", artist: "Imagine Dragons", duration: "3:09", bpm: 108 }
      ]
    }
  ];

  const handlePlaylistClick = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const handleTrackPlay = (track: Track) => {
    // Toggle play/pause for same track
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      return;
    }

    // Set new track and play
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handleClose = () => {
    setSelectedPlaylist(null);
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  return (
    <div className="music-playlist-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-wrapper">
            <Link to="/landing" className="brand-logo">
              <FitFusionLogo width={40} height={40} />
              <span className="brand-text">Fit Fusion</span>
            </Link>
            
            <ul className="nav-menu">
              <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              <li><Link to="/workout" className="nav-link">Workouts</Link></li>
              <li><Link to="/diet" className="nav-link">Nutrition</Link></li>
              <li><Link to="/music" className="nav-link active">Music</Link></li>
              <li><Link to="/ai-coach" className="nav-link">AI Coach</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="music-container">
        <div className="container">
          {/* Header */}
          <div className="music-header">
            <div className="header-content">
              <span className="header-icon">🎵</span>
              <h1 className="page-title">Workout Playlists</h1>
              <p className="page-subtitle">
                Curated music collections to elevate your fitness experience
              </p>
            </div>
          </div>

          {/* Playlists Grid */}
          <div className="playlists-grid">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="playlist-card"
                onClick={() => handlePlaylistClick(playlist)}
                style={{ borderColor: playlist.color }}
              >
                <div className="playlist-icon" style={{ background: playlist.color }}>
                  <span>{playlist.icon}</span>
                </div>
                <div className="playlist-info">
                  <h3 className="playlist-name">{playlist.name}</h3>
                  <p className="playlist-category">{playlist.category}</p>
                  <p className="playlist-description">{playlist.description}</p>
                  <div className="playlist-meta">
                    <span>{playlist.trackCount} tracks</span>
                    <span>•</span>
                    <span>{playlist.duration}</span>
                  </div>
                </div>
                <div className="playlist-actions">
                  <div className="playlist-play-btn" style={{ background: playlist.color }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  {playlist.spotifyPlaylistId && (
                    <button 
                      className="spotify-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openSpotifyPlaylist(playlist.spotifyPlaylistId!);
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                      Spotify
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Playlist Modal */}
      {selectedPlaylist && (
        <div className="playlist-modal-overlay" onClick={handleClose}>
          <div className="playlist-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleClose}>×</button>
            
            <div className="modal-header" style={{ background: selectedPlaylist.color }}>
              <span className="modal-icon">{selectedPlaylist.icon}</span>
              <h2 className="modal-title">{selectedPlaylist.name}</h2>
              <p className="modal-category">{selectedPlaylist.category}</p>
              <p className="modal-description">{selectedPlaylist.description}</p>
              <div className="modal-meta">
                <span>{selectedPlaylist.trackCount} tracks</span>
                <span>•</span>
                <span>{selectedPlaylist.duration}</span>
              </div>
              {selectedPlaylist.spotifyPlaylistId && (
                <button 
                  className="spotify-modal-btn"
                  onClick={() => openSpotifyPlaylist(selectedPlaylist.spotifyPlaylistId!)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Play Full Playlist on Spotify
                </button>
              )}
            </div>

            {/* Embedded YouTube Player */}
            {currentTrack && currentTrack.youtubeId && (
              <div className="embedded-player">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${currentTrack.youtubeId}?autoplay=${isPlaying ? 1 : 0}&controls=1`}
                  title={currentTrack.title}
                  style={{ border: 0, borderRadius: '12px' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                <div className="now-playing-info">
                  <span className="now-playing-label">🎵 Now Playing</span>
                  <span className="now-playing-track">{currentTrack.title} - {currentTrack.artist}</span>
                </div>
              </div>
            )}

            <div className="modal-tracks">
              {selectedPlaylist.tracks.map((track, index) => (
                <div
                  key={track.id}
                  className={`track-item ${currentTrack?.id === track.id ? 'active' : ''}`}
                  onClick={() => handleTrackPlay(track)}
                >
                  <div className="track-number">{index + 1}</div>
                  <div className="track-info">
                    <div className="track-title">{track.title}</div>
                    <div className="track-artist">{track.artist}</div>
                  </div>
                  {track.bpm && (
                    <div className="track-bpm">{track.bpm} BPM</div>
                  )}
                  <div className="track-duration">{track.duration}</div>
                  {track.youtubeId && (
                    <span className="direct-play-badge">▶️ Play</span>
                  )}
                  <button className="track-play-btn">
                    {currentTrack?.id === track.id && isPlaying ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>


          </div>
        </div>
      )}

      <style>{`
        .music-playlist-page {
          min-height: 100vh;
          background: var(--gradient-background);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Navigation */
        .navbar {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .nav-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: var(--dark-gray);
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-green);
        }

        .nav-menu {
          display: flex;
          gap: 0;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          text-decoration: none;
          color: #4a4a4a;
          font-weight: 500;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .nav-link.active {
          color: var(--primary-green);
          background: var(--green-10);
        }

        .nav-link:hover {
          color: var(--primary-green);
          background: var(--green-10);
        }

        /* Main Content */
        .music-container {
          padding: 3rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Header */
        .music-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .page-title {
          font-size: 3rem;
          font-weight: 800;
          color: var(--dark-gray);
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .page-subtitle {
          font-size: 1.25rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Playlists Grid */
        .playlists-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .playlist-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .playlist-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
          border-color: currentColor;
        }

        .playlist-card:hover .playlist-play-btn {
          opacity: 1;
          transform: scale(1);
        }

        .playlist-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-top: 1rem;
        }

        .spotify-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #1DB954;
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
        }

        .spotify-btn:hover {
          background: #1ed760;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(29, 185, 84, 0.4);
        }

        .embedded-player {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 16px;
          margin-bottom: 1.5rem;
        }

        .now-playing-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .now-playing-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #708d50;
        }

        .now-playing-track {
          font-size: 0.875rem;
          color: #4a4a4a;
          font-weight: 500;
        }

        .direct-play-badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          background: #708d50;
          color: white;
          border-radius: 12px;
          font-weight: 600;
        }

        .spotify-modal-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: white;
          color: #1DB954;
          border: 2px solid white;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1.5rem;
        }

        .spotify-modal-btn:hover {
          background: rgba(255, 255, 255, 0.9);
          transform: scale(1.05);
        }

        .playlist-icon {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin-bottom: 1.5rem;
        }

        .playlist-info {
          flex: 1;
        }

        .playlist-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--dark-gray);
          margin-bottom: 0.25rem;
        }

        .playlist-category {
          font-size: 0.875rem;
          color: var(--primary-green);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .playlist-description {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.5;
          margin-bottom: 1rem;
        }

        .playlist-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #999;
        }

        .playlist-play-btn {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        /* Modal */
        .playlist-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .playlist-modal {
          background: white;
          border-radius: 24px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
          position: relative;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .modal-header {
          padding: 3rem 2rem;
          color: white;
          text-align: center;
        }

        .modal-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .modal-category {
          font-size: 0.875rem;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.75rem;
        }

        .modal-description {
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 1rem;
        }

        .modal-meta {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .modal-tracks {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .track-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .track-item:hover {
          background: var(--green-10);
        }

        .track-item.active {
          background: var(--green-20);
        }

        .track-number {
          width: 32px;
          text-align: center;
          font-weight: 600;
          color: #999;
        }

        .track-info {
          flex: 1;
        }

        .track-title {
          font-weight: 600;
          color: var(--dark-gray);
          margin-bottom: 0.25rem;
        }

        .track-artist {
          font-size: 0.875rem;
          color: #666;
        }

        .track-bpm {
          font-size: 0.75rem;
          color: var(--primary-green);
          font-weight: 600;
          background: var(--green-10);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .track-duration {
          font-size: 0.875rem;
          color: #999;
          min-width: 50px;
          text-align: right;
        }

        .track-play-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary-green);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .track-play-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(112, 141, 80, 0.3);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .page-title {
            font-size: 2rem;
          }

          .playlists-grid {
            grid-template-columns: 1fr;
          }

          .playlist-modal {
            margin: 1rem;
          }

          .track-bpm {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MusicPlaylist;
