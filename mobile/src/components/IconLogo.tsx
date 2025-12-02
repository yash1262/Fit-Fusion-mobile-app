import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, Ellipse, G, Polygon } from 'react-native-svg';

interface IconLogoProps {
  type: 'food' | 'music' | 'robot' | 'workout' | 'weather' | 'notification' | 'chart' | 'fire' | 'water' | 'sun' | 'moon' | 'cookie' | 'sunrise' | 'wave' | 'target' | 'trophy' | 'shoe' | 'warning' | 'video' | 'checkmark';
  size?: number;
  color?: string;
}

export const IconLogo: React.FC<IconLogoProps> = ({ 
  type, 
  size = 60, 
  color = '#708d50' 
}) => {
  const renderIcon = () => {
    switch (type) {
      case 'food':
        return (
          <>
            {/* Plate */}
            <Circle cx="50" cy="55" r="35" fill="none" stroke={color} strokeWidth="3" />
            <Circle cx="50" cy="55" r="30" fill="none" stroke={color} strokeWidth="2" />
            {/* Fork */}
            <Path d="M35 30 L35 50" stroke="#666" strokeWidth="2.5" />
            <Path d="M30 30 L30 42" stroke="#666" strokeWidth="2" />
            <Path d="M40 30 L40 42" stroke="#666" strokeWidth="2" />
            {/* Knife */}
            <Path d="M65 30 L65 50" stroke="#666" strokeWidth="2.5" />
            <Path d="M62 30 L68 30 L65 35 Z" fill="#666" />
          </>
        );
      
      case 'music':
        return (
          <>
            {/* Musical note */}
            <Path
              d="M40 70 Q40 65, 45 65 Q50 65, 50 70 Q50 75, 45 75 Q40 75, 40 70 Z"
              fill={color}
            />
            <Path
              d="M60 60 Q60 55, 65 55 Q70 55, 70 60 Q70 65, 65 65 Q60 65, 60 60 Z"
              fill={color}
            />
            <Rect x="48" y="30" width="3" height="40" fill={color} />
            <Rect x="68" y="25" width="3" height="35" fill={color} />
            <Path d="M51 30 L71 25 L71 35 L51 40 Z" fill={color} />
            {/* Music waves */}
            <Path d="M25 35 Q30 30, 35 35" stroke={color} strokeWidth="2" fill="none" />
            <Path d="M25 45 Q30 40, 35 45" stroke={color} strokeWidth="2" fill="none" />
          </>
        );
      
      case 'robot':
        return (
          <>
            {/* Robot head */}
            <Rect x="35" y="35" width="30" height="30" rx="5" fill={color} />
            {/* Antenna */}
            <Path d="M50 35 L50 25" stroke={color} strokeWidth="2.5" />
            <Circle cx="50" cy="23" r="3" fill={color} />
            {/* Eyes */}
            <Circle cx="43" cy="45" r="3" fill="#fff" />
            <Circle cx="57" cy="45" r="3" fill="#fff" />
            {/* Mouth */}
            <Rect x="42" y="55" width="16" height="3" rx="1.5" fill="#fff" />
            {/* Body */}
            <Rect x="38" y="65" width="24" height="20" rx="3" fill={color} opacity="0.8" />
            {/* Arms */}
            <Rect x="28" y="68" width="8" height="3" rx="1.5" fill={color} />
            <Rect x="64" y="68" width="8" height="3" rx="1.5" fill={color} />
          </>
        );
      
      case 'workout':
        return (
          <>
            {/* Dumbbell */}
            <Rect x="25" y="45" width="50" height="10" rx="2" fill={color} />
            <Rect x="20" y="40" width="8" height="20" rx="2" fill={color} />
            <Rect x="72" y="40" width="8" height="20" rx="2" fill={color} />
            <Circle cx="24" cy="42" r="2" fill="#fff" opacity="0.5" />
            <Circle cx="76" cy="42" r="2" fill="#fff" opacity="0.5" />
          </>
        );
      
      case 'weather':
        return (
          <>
            {/* Sun */}
            <Circle cx="50" cy="40" r="12" fill="#ffeb3b" />
            {/* Sun rays */}
            <Path d="M50 20 L50 25" stroke="#ffeb3b" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M50 55 L50 60" stroke="#ffeb3b" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M30 40 L35 40" stroke="#ffeb3b" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M65 40 L70 40" stroke="#ffeb3b" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M36 26 L40 30" stroke="#ffeb3b" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M60 50 L64 54" stroke="#ffeb3b" strokeWidth="2.5" strokeLinecap="round" />
            {/* Cloud */}
            <Path
              d="M30 60 Q30 55, 35 55 Q35 50, 42 50 Q45 45, 52 45 Q58 45, 60 50 Q65 50, 68 53 Q70 55, 70 60 Q70 65, 65 65 L35 65 Q30 65, 30 60 Z"
              fill="#e0e0e0"
            />
          </>
        );
      
      case 'notification':
        return (
          <>
            {/* Bell */}
            <Path
              d="M50 25 L50 30 Q35 30, 35 45 L35 55 Q30 58, 30 62 L70 62 Q70 58, 65 55 L65 45 Q65 30, 50 30 L50 25"
              fill={color}
            />
            {/* Bell clapper */}
            <Circle cx="50" cy="65" r="3" fill={color} />
            {/* Notification dot */}
            <Circle cx="62" cy="30" r="6" fill="#ff6b6b" />
          </>
        );
      
      case 'chart':
        return (
          <>
            {/* Chart bars */}
            <Rect x="25" y="50" width="10" height="25" rx="2" fill={color} />
            <Rect x="42" y="40" width="10" height="35" rx="2" fill={color} opacity="0.8" />
            <Rect x="59" y="30" width="10" height="45" rx="2" fill={color} opacity="0.6" />
            {/* Axes */}
            <Path d="M20 75 L80 75" stroke="#666" strokeWidth="2" />
            <Path d="M20 75 L20 25" stroke="#666" strokeWidth="2" />
            {/* Arrow up */}
            <Path d="M75 30 L80 35 M75 30 L70 35" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      
      case 'fire':
        return (
          <>
            {/* Flame */}
            <Path
              d="M50 20 Q45 30, 45 42 Q45 52, 50 58 Q55 52, 55 42 Q55 30, 50 20 Z"
              fill={color}
            />
            <Path
              d="M50 30 Q48 36, 48 44 Q48 50, 50 54 Q52 50, 52 44 Q52 36, 50 30 Z"
              fill="#ff9800"
            />
            <Path
              d="M50 38 Q49 41, 49 46 Q49 49, 50 51 Q51 49, 51 46 Q51 41, 50 38 Z"
              fill="#ffeb3b"
            />
            {/* Base */}
            <Ellipse cx="50" cy="60" rx="22" ry="14" fill={color} />
            <Ellipse cx="50" cy="60" rx="16" ry="10" fill="#ff9800" />
          </>
        );
      
      case 'water':
        return (
          <>
            {/* Water drop */}
            <Path
              d="M50 20 Q60 35, 60 48 Q60 60, 50 65 Q40 60, 40 48 Q40 35, 50 20 Z"
              fill={color}
            />
            {/* Shine */}
            <Circle cx="47" cy="35" r="4" fill="#fff" opacity="0.6" />
            <Circle cx="52" cy="42" r="2" fill="#fff" opacity="0.4" />
          </>
        );
      
      case 'sun':
        return (
          <>
            {/* Sun circle */}
            <Circle cx="50" cy="50" r="18" fill="#ffeb3b" />
            {/* Rays */}
            <Path d="M50 20 L50 28" stroke="#ffeb3b" strokeWidth="3" strokeLinecap="round" />
            <Path d="M50 72 L50 80" stroke="#ffeb3b" strokeWidth="3" strokeLinecap="round" />
            <Path d="M20 50 L28 50" stroke="#ffeb3b" strokeWidth="3" strokeLinecap="round" />
            <Path d="M72 50 L80 50" stroke="#ffeb3b" strokeWidth="3" strokeLinecap="round" />
            <Path d="M29 29 L35 35" stroke="#ffeb3b" strokeWidth="3" strokeLinecap="round" />
            <Path d="M65 65 L71 71" stroke="#ffeb3b" strokeWidth="3" strokeLinecap="round" />
            <Path d="M71 29 L65 35" stroke="#ffeb3b" strokeWidth="3" strokeLinecap="round" />
            <Path d="M35 65 L29 71" stroke="#ffeb3b" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      
      case 'moon':
        return (
          <>
            {/* Moon crescent */}
            <Path
              d="M55 25 Q45 25, 40 35 Q35 45, 40 55 Q45 65, 55 65 Q50 65, 47 60 Q43 50, 47 40 Q50 35, 55 25 Z"
              fill={color}
            />
            {/* Stars */}
            <Path d="M70 30 L72 35 L67 35 Z M70 38 L68 33 L72 33 Z" fill="#ffeb3b" />
            <Path d="M65 50 L66 53 L63 53 Z M65 55 L64 52 L66 52 Z" fill="#ffeb3b" />
          </>
        );
      
      case 'cookie':
        return (
          <>
            {/* Cookie circle */}
            <Circle cx="50" cy="50" r="25" fill="#d4a574" />
            {/* Chocolate chips */}
            <Circle cx="42" cy="42" r="3" fill="#5d4037" />
            <Circle cx="58" cy="45" r="3" fill="#5d4037" />
            <Circle cx="48" cy="55" r="3" fill="#5d4037" />
            <Circle cx="60" cy="58" r="3" fill="#5d4037" />
            <Circle cx="45" cy="48" r="2" fill="#5d4037" />
            <Circle cx="55" cy="52" r="2" fill="#5d4037" />
            {/* Bite mark */}
            <Path
              d="M70 35 Q75 40, 70 45 Q68 42, 68 40 Q68 38, 70 35"
              fill="#f8fafc"
            />
          </>
        );
      
      case 'sunrise':
        return (
          <>
            {/* Sun half circle */}
            <Path
              d="M30 60 Q30 40, 50 40 Q70 40, 70 60"
              fill="#ffeb3b"
            />
            {/* Rays */}
            <Path d="M50 30 L50 38" stroke="#ffeb3b" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M35 42 L40 47" stroke="#ffeb3b" strokeWidth="2.5" strokeLinecap="round" />
            <Path d="M65 42 L60 47" stroke="#ffeb3b" strokeWidth="2.5" strokeLinecap="round" />
            {/* Horizon line */}
            <Path d="M20 60 L80 60" stroke={color} strokeWidth="2.5" />
          </>
        );
      
      case 'wave':
        return (
          <>
            {/* Water waves */}
            <Path
              d="M20 45 Q30 40, 40 45 Q50 50, 60 45 Q70 40, 80 45"
              stroke={color}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M20 55 Q30 50, 40 55 Q50 60, 60 55 Q70 50, 80 55"
              stroke={color}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.7"
            />
            <Path
              d="M20 65 Q30 60, 40 65 Q50 70, 60 65 Q70 60, 80 65"
              stroke={color}
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              opacity="0.5"
            />
          </>
        );
      
      case 'target':
        return (
          <>
            {/* Target circles */}
            <Circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="3" />
            <Circle cx="50" cy="50" r="20" fill="none" stroke={color} strokeWidth="3" />
            <Circle cx="50" cy="50" r="10" fill="none" stroke={color} strokeWidth="3" />
            <Circle cx="50" cy="50" r="4" fill={color} />
          </>
        );
      
      case 'trophy':
        return (
          <>
            {/* Trophy cup */}
            <Path
              d="M35 35 L35 45 Q35 55, 50 58 Q65 55, 65 45 L65 35 Z"
              fill={color}
            />
            {/* Handles */}
            <Path d="M35 38 Q28 38, 28 43 Q28 48, 35 48" stroke={color} strokeWidth="2.5" fill="none" />
            <Path d="M65 38 Q72 38, 72 43 Q72 48, 65 48" stroke={color} strokeWidth="2.5" fill="none" />
            {/* Base */}
            <Rect x="45" y="58" width="10" height="8" fill={color} />
            <Rect x="38" y="66" width="24" height="4" rx="2" fill={color} />
            {/* Top rim */}
            <Rect x="32" y="32" width="36" height="3" rx="1.5" fill={color} />
          </>
        );
      
      case 'shoe':
        return (
          <>
            {/* Shoe outline */}
            <Path
              d="M25 55 L30 45 Q35 40, 45 40 L60 40 Q70 40, 72 48 L75 58 Q75 62, 70 62 L30 62 Q25 62, 25 58 Z"
              fill={color}
            />
            {/* Shoe details */}
            <Path d="M45 40 L45 50" stroke="#fff" strokeWidth="2" opacity="0.5" />
            <Path d="M52 40 L52 50" stroke="#fff" strokeWidth="2" opacity="0.5" />
            <Path d="M59 40 L59 50" stroke="#fff" strokeWidth="2" opacity="0.5" />
            {/* Sole */}
            <Ellipse cx="50" cy="64" rx="22" ry="4" fill={color} opacity="0.6" />
          </>
        );
      
      case 'warning':
        return (
          <>
            {/* Triangle */}
            <Path
              d="M50 20 L75 70 L25 70 Z"
              fill={color}
              stroke="#333"
              strokeWidth="2"
            />
            {/* Exclamation mark */}
            <Rect x="48" y="35" width="4" height="20" rx="2" fill="#fff" />
            <Circle cx="50" cy="62" r="3" fill="#fff" />
          </>
        );
      
      case 'video':
        return (
          <>
            {/* Play button circle */}
            <Circle cx="50" cy="50" r="28" fill={color} />
            {/* Play triangle */}
            <Path
              d="M42 35 L42 65 L68 50 Z"
              fill="#fff"
            />
          </>
        );
      
      case 'checkmark':
        return (
          <>
            {/* Circle */}
            <Circle cx="50" cy="50" r="30" fill={color} />
            {/* Checkmark */}
            <Path
              d="M35 50 L45 60 L65 38"
              stroke="#fff"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
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
        {renderIcon()}
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

export default IconLogo;
