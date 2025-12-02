import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import { IconLogo } from '../components/IconLogo';
import { MoodLogo } from '../components/MoodLogo';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;
  youtubeUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  emoji: string;
  color: string[];
  description: string;
  songs: Song[];
}

const MusicPlaylistScreen = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);

  const playlists: Playlist[] = [
    {
      id: 'hiit',
      name: 'High Energy HIIT',
      emoji: 'fire',
      color: ['#ff6b6b', '#ee5a6f'],
      description: 'Intense beats for maximum performance',
      songs: [
        {
          id: '1',
          title: 'Eye of the Tiger',
          artist: 'Survivor',
          duration: '4:05',
          youtubeUrl: 'https://www.youtube.com/watch?v=btPJPFnesV4',
        },
        {
          id: '2',
          title: 'Stronger',
          artist: 'Kanye West',
          duration: '5:12',
          youtubeUrl: 'https://www.youtube.com/watch?v=PsO6ZnUZI0g',
        },
        {
          id: '3',
          title: "Can't Hold Us",
          artist: 'Macklemore',
          duration: '4:18',
          youtubeUrl: 'https://www.youtube.com/watch?v=2zNSgSzhBfM',
        },
        {
          id: '4',
          title: 'Till I Collapse',
          artist: 'Eminem',
          duration: '4:57',
          youtubeUrl: 'https://www.youtube.com/watch?v=ytQ5CYE1VZw',
        },
        {
          id: '5',
          title: 'Thunderstruck',
          artist: 'AC/DC',
          duration: '4:52',
          youtubeUrl: 'https://www.youtube.com/watch?v=v2AC41dglnM',
        },
      ],
    },
    {
      id: 'strength',
      name: 'Strength Training',
      emoji: 'workout',
      color: ['#708d50', '#5a7340'],
      description: 'Power music for heavy lifting',
      songs: [
        {
          id: '1',
          title: 'Remember the Name',
          artist: 'Fort Minor',
          duration: '3:50',
          youtubeUrl: 'https://www.youtube.com/watch?v=VDvr08sCPOc',
        },
        {
          id: '2',
          title: 'Lose Yourself',
          artist: 'Eminem',
          duration: '5:26',
          youtubeUrl: 'https://www.youtube.com/watch?v=_Yhyp-_hX2s',
        },
        {
          id: '3',
          title: 'The Champion',
          artist: 'Carrie Underwood',
          duration: '3:01',
          youtubeUrl: 'https://www.youtube.com/watch?v=2Gs7j2Uw0Yw',
        },
        {
          id: '4',
          title: 'Centuries',
          artist: 'Fall Out Boy',
          duration: '3:47',
          youtubeUrl: 'https://www.youtube.com/watch?v=LBr7kECsjcQ',
        },
        {
          id: '5',
          title: 'Hall of Fame',
          artist: 'The Script',
          duration: '3:22',
          youtubeUrl: 'https://www.youtube.com/watch?v=mk48xRzuNvA',
        },
      ],
    },
    {
      id: 'yoga',
      name: 'Yoga & Meditation',
      emoji: 'happy',
      color: ['#9c27b0', '#7b1fa2'],
      description: 'Calming sounds for mindfulness',
      songs: [
        {
          id: '1',
          title: 'Weightless',
          artist: 'Marconi Union',
          duration: '8:09',
          youtubeUrl: 'https://www.youtube.com/watch?v=UfcAVejslrU',
        },
        {
          id: '2',
          title: 'Spa Music',
          artist: 'Meditation Relax Music',
          duration: '3:00',
          youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
        },
        {
          id: '3',
          title: 'Peaceful Piano',
          artist: 'Relaxing Music',
          duration: '4:30',
          youtubeUrl: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
        },
        {
          id: '4',
          title: 'Nature Sounds',
          artist: 'Meditation',
          duration: '5:00',
          youtubeUrl: 'https://www.youtube.com/watch?v=eKFTSSKCzWA',
        },
        {
          id: '5',
          title: 'Tibetan Bowls',
          artist: 'Healing Music',
          duration: '6:00',
          youtubeUrl: 'https://www.youtube.com/watch?v=3jWRrafhO7M',
        },
      ],
    },
    {
      id: 'cardio',
      name: 'Cardio Beats',
      emoji: 'shoe',
      color: ['#2196f3', '#1976d2'],
      description: 'Fast-paced tracks for running',
      songs: [
        {
          id: '1',
          title: 'Uptown Funk',
          artist: 'Bruno Mars',
          duration: '4:30',
          youtubeUrl: 'https://www.youtube.com/watch?v=OPf0YbXqDm0',
        },
        {
          id: '2',
          title: 'Shut Up and Dance',
          artist: 'Walk the Moon',
          duration: '3:19',
          youtubeUrl: 'https://www.youtube.com/watch?v=6JCLY0Rlx6Q',
        },
        {
          id: '3',
          title: 'Happy',
          artist: 'Pharrell Williams',
          duration: '3:53',
          youtubeUrl: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs',
        },
        {
          id: '4',
          title: 'Shake It Off',
          artist: 'Taylor Swift',
          duration: '3:39',
          youtubeUrl: 'https://www.youtube.com/watch?v=nfWlot6h_JM',
        },
        {
          id: '5',
          title: 'Levitating',
          artist: 'Dua Lipa',
          duration: '3:23',
          youtubeUrl: 'https://www.youtube.com/watch?v=TUVcZfQe-Kw',
        },
      ],
    },
    {
      id: 'cooldown',
      name: 'Cool Down Mix',
      emoji: 'wave',
      color: ['#4caf50', '#45a049'],
      description: 'Gentle music for recovery',
      songs: [
        {
          id: '1',
          title: 'Breathe Me',
          artist: 'Sia',
          duration: '4:33',
          youtubeUrl: 'https://www.youtube.com/watch?v=SFGvmrJ5rjM',
        },
        {
          id: '2',
          title: 'Fix You',
          artist: 'Coldplay',
          duration: '4:54',
          youtubeUrl: 'https://www.youtube.com/watch?v=k4V3Mo61fJM',
        },
        {
          id: '3',
          title: 'The Scientist',
          artist: 'Coldplay',
          duration: '5:09',
          youtubeUrl: 'https://www.youtube.com/watch?v=RB-RcX5DS5A',
        },
        {
          id: '4',
          title: 'Chasing Cars',
          artist: 'Snow Patrol',
          duration: '4:27',
          youtubeUrl: 'https://www.youtube.com/watch?v=GemKqzILV4w',
        },
        {
          id: '5',
          title: 'Skinny Love',
          artist: 'Bon Iver',
          duration: '3:58',
          youtubeUrl: 'https://www.youtube.com/watch?v=ssdgFoHLwnk',
        },
      ],
    },
  ];

  const handlePlaySong = async (song: Song) => {
    try {
      const supported = await Linking.canOpenURL(song.youtubeUrl);
      if (supported) {
        await Linking.openURL(song.youtubeUrl);
      } else {
        Alert.alert('Error', 'Cannot open YouTube link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open song');
    }
  };

  const handlePlayAll = async (playlist: Playlist) => {
    Alert.alert(
      'Play All',
      `Play all ${playlist.songs.length} songs from ${playlist.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Play',
          onPress: () => handlePlaySong(playlist.songs[0]),
        },
      ]
    );
  };

  const selectedPlaylistData = playlists.find((p) => p.id === selectedPlaylist);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff' }}>
        <IconLogo type="music" size={32} color="#708d50" />
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#1a1a1a' }}>Workout Music</Text>
          <Text style={{ fontSize: 14, color: '#666', marginTop: 4 }}>Curated playlists for every workout</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {!selectedPlaylist ? (
          // Playlist Selection
          <View style={styles.playlistGrid}>
            {playlists.map((playlist) => (
              <TouchableOpacity
                key={playlist.id}
                style={styles.playlistCard}
                onPress={() => setSelectedPlaylist(playlist.id)}
              >
                <LinearGradient colors={playlist.color} style={styles.playlistGradient}>
                  {['fire', 'workout', 'wave'].includes(playlist.emoji) ? (
                    <IconLogo type={playlist.emoji as any} size={48} color="#fff" />
                  ) : playlist.emoji === 'shoe' ? (
                    <IconLogo type="shoe" size={48} color="#fff" />
                  ) : (
                    <MoodLogo mood={playlist.emoji as any} size={48} color="#fff" />
                  )}
                  <Text style={styles.playlistName}>{playlist.name}</Text>
                  <Text style={styles.playlistDescription}>{playlist.description}</Text>
                  <View style={styles.playlistMeta}>
                    <Icon name="music-note" size={16} color="#fff" />
                    <Text style={styles.playlistCount}>{playlist.songs.length} songs</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Song List
          <View style={styles.songListContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedPlaylist(null)}
            >
              <Icon name="arrow-left" size={24} color="#708d50" />
              <Text style={styles.backButtonText}>Back to Playlists</Text>
            </TouchableOpacity>

            {selectedPlaylistData && (
              <>
                <View style={styles.playlistHeader}>
                  <LinearGradient
                    colors={selectedPlaylistData.color}
                    style={styles.playlistHeaderGradient}
                  >
                    <Text style={styles.playlistHeaderEmoji}>
                      {selectedPlaylistData.emoji}
                    </Text>
                    <Text style={styles.playlistHeaderName}>{selectedPlaylistData.name}</Text>
                    <Text style={styles.playlistHeaderDescription}>
                      {selectedPlaylistData.description}
                    </Text>
                    <TouchableOpacity
                      style={styles.playAllButton}
                      onPress={() => handlePlayAll(selectedPlaylistData)}
                    >
                      <Icon name="play-circle" size={24} color="#fff" />
                      <Text style={styles.playAllButtonText}>Play All</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>

                <View style={styles.songList}>
                  {selectedPlaylistData.songs.map((song, index) => (
                    <TouchableOpacity
                      key={song.id}
                      style={styles.songCard}
                      onPress={() => handlePlaySong(song)}
                    >
                      <View style={styles.songNumber}>
                        <Text style={styles.songNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.songInfo}>
                        <Text style={styles.songTitle}>{song.title}</Text>
                        <Text style={styles.songArtist}>{song.artist}</Text>
                      </View>
                      <View style={styles.songMeta}>
                        <Text style={styles.songDuration}>{song.duration}</Text>
                        <Icon name="play-circle-outline" size={32} color="#708d50" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  playlistGrid: {
    padding: 16,
    gap: 16,
  },
  playlistCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  playlistGradient: {
    padding: 24,
  },
  playlistEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  playlistName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  playlistDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
  },
  playlistMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playlistCount: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  songListContainer: {
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#708d50',
  },
  playlistHeader: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  playlistHeaderGradient: {
    padding: 32,
    alignItems: 'center',
  },
  playlistHeaderEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  playlistHeaderName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  playlistHeaderDescription: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 24,
  },
  playAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  playAllButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  songList: {
    gap: 12,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  songNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f7ed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#708d50',
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: '#666',
  },
  songMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  songDuration: {
    fontSize: 12,
    color: '#999',
  },
});

export default MusicPlaylistScreen;
