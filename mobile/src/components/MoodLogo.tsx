import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Ellipse, G } from 'react-native-svg';

interface MoodLogoProps {
  mood: 'happy' | 'sad' | 'stressed' | 'energetic' | 'tired' | 'motivated' | 'angry';
  size?: number;
  color?: string;
}

export const MoodLogo: React.FC<MoodLogoProps> = ({ 
  mood, 
  size = 60, 
  color = '#708d50' 
}) => {
  const renderMood = () => {
    switch (mood) {
      case 'happy':
        return (
          <>
            {/* Face Circle */}
            <Circle cx="50" cy="50" r="40" fill={color} />
            {/* Eyes */}
            <Circle cx="38" cy="42" r="4" fill="#333" />
            <Circle cx="62" cy="42" r="4" fill="#333" />
            {/* Smile */}
            <Path
              d="M35 55 Q50 65, 65 55"
              stroke="#333"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );
      
      case 'sad':
        return (
          <>
            {/* Face Circle */}
            <Circle cx="50" cy="50" r="40" fill={color} />
            {/* Eyes */}
            <Circle cx="38" cy="42" r="4" fill="#333" />
            <Circle cx="62" cy="42" r="4" fill="#333" />
            {/* Sad mouth */}
            <Path
              d="M35 62 Q50 52, 65 62"
              stroke="#333"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            {/* Tear */}
            <Path
              d="M62 48 Q64 55, 62 58 Q60 55, 62 48"
              fill="#2196f3"
            />
          </>
        );
      
      case 'stressed':
        return (
          <>
            {/* Face Circle */}
            <Circle cx="50" cy="50" r="40" fill={color} />
            {/* Worried eyes */}
            <Circle cx="38" cy="45" r="4" fill="#333" />
            <Circle cx="62" cy="45" r="4" fill="#333" />
            {/* Worried eyebrows */}
            <Path d="M32 35 L44 38" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M68 35 L56 38" stroke="#333" strokeWidth="2.5" strokeLinecap="round" />
            {/* Wavy mouth */}
            <Path
              d="M35 58 Q42 55, 50 58 Q58 61, 65 58"
              stroke="#333"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Sweat drop */}
            <Path
              d="M70 35 Q72 40, 70 43 Q68 40, 70 35"
              fill="#2196f3"
            />
          </>
        );
      
      case 'energetic':
        return (
          <>
            {/* Lightning bolt */}
            <Path
              d="M55 20 L40 50 L50 50 L45 80 L70 45 L58 45 L65 20 Z"
              fill={color}
              stroke="#333"
              strokeWidth="2"
            />
            {/* Energy lines */}
            <Path d="M25 30 L30 35" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <Path d="M20 50 L28 50" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <Path d="M25 70 L30 65" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <Path d="M75 30 L70 35" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <Path d="M80 50 L72 50" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <Path d="M75 70 L70 65" stroke={color} strokeWidth="3" strokeLinecap="round" />
          </>
        );
      
      case 'tired':
        return (
          <>
            {/* Face Circle */}
            <Circle cx="50" cy="50" r="40" fill={color} />
            {/* Closed eyes (lines) */}
            <Path d="M32 42 L44 42" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <Path d="M56 42 L68 42" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            {/* Tired mouth */}
            <Path
              d="M38 58 L62 58"
              stroke="#333"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Z's for sleep */}
            <Path d="M70 25 L75 25 L70 32 L75 32" stroke="#333" strokeWidth="2" fill="none" />
            <Path d="M75 18 L82 18 L75 27 L82 27" stroke="#333" strokeWidth="2" fill="none" />
          </>
        );
      
      case 'motivated':
        return (
          <>
            {/* Flame shape */}
            <Path
              d="M50 20 Q45 30, 45 40 Q45 50, 50 55 Q55 50, 55 40 Q55 30, 50 20 Z"
              fill={color}
            />
            <Path
              d="M50 30 Q48 35, 48 42 Q48 48, 50 52 Q52 48, 52 42 Q52 35, 50 30 Z"
              fill="#ff9800"
            />
            <Path
              d="M50 38 Q49 40, 49 44 Q49 47, 50 49 Q51 47, 51 44 Q51 40, 50 38 Z"
              fill="#ffeb3b"
            />
            {/* Base flame */}
            <Ellipse cx="50" cy="58" rx="20" ry="12" fill={color} />
            <Ellipse cx="50" cy="58" rx="14" ry="8" fill="#ff9800" />
          </>
        );
      
      case 'angry':
        return (
          <>
            {/* Face Circle */}
            <Circle cx="50" cy="50" r="40" fill={color} />
            {/* Angry eyes */}
            <Circle cx="38" cy="45" r="4" fill="#333" />
            <Circle cx="62" cy="45" r="4" fill="#333" />
            {/* Angry eyebrows */}
            <Path d="M30 35 L44 40" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            <Path d="M70 35 L56 40" stroke="#333" strokeWidth="3" strokeLinecap="round" />
            {/* Angry mouth */}
            <Path
              d="M35 62 Q50 57, 65 62"
              stroke="#333"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {renderMood()}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MoodLogo;
