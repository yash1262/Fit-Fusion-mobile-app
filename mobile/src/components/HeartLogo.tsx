import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

interface HeartLogoProps {
  size?: number;
  color?: string;
}

export const HeartLogo: React.FC<HeartLogoProps> = ({ 
  size = 100, 
  color = '#708d50' 
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Heart Shape */}
        <Path
          d="M50 85 C50 85, 20 60, 20 40 C20 25, 30 20, 40 25 C45 27.5, 50 35, 50 35 C50 35, 55 27.5, 60 25 C70 20, 80 25, 80 40 C80 60, 50 85, 50 85 Z"
          fill={color}
          stroke={color}
          strokeWidth="2"
        />
        
        {/* Glasses Frame */}
        <G>
          {/* Left Lens */}
          <Circle
            cx="35"
            cy="40"
            r="8"
            fill="none"
            stroke="#333"
            strokeWidth="2.5"
          />
          
          {/* Right Lens */}
          <Circle
            cx="55"
            cy="40"
            r="8"
            fill="none"
            stroke="#333"
            strokeWidth="2.5"
          />
          
          {/* Bridge */}
          <Path
            d="M43 40 L47 40"
            stroke="#333"
            strokeWidth="2.5"
            fill="none"
          />
          
          {/* Left Temple */}
          <Path
            d="M27 40 L22 38"
            stroke="#333"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Right Temple */}
          <Path
            d="M63 40 L68 38"
            stroke="#333"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Lens Shine Effect */}
          <Circle cx="32" cy="37" r="2" fill="white" opacity="0.7" />
          <Circle cx="52" cy="37" r="2" fill="white" opacity="0.7" />
        </G>
        
        {/* Smile */}
        <Path
          d="M40 52 Q45 56, 50 52"
          stroke="#333"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
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

export default HeartLogo;
