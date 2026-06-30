import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface Props {
  nodeCount: number;
  nodeSpacing: number;
}

export function MapPath({ nodeCount, nodeSpacing }: Props) {
  // Height of the entire path container based on number of nodes and spacing
  const pathHeight = nodeCount * nodeSpacing;
  const centerX = width / 2;

  // We'll generate a winding path that goes top to bottom
  // Creating a nice sine wave-like curve
  let d = `M ${centerX} 0`;
  const amplitude = 60; // How far it winds left/right

  for (let i = 0; i <= nodeCount; i++) {
    const startY = i * nodeSpacing;
    const endY = (i + 1) * nodeSpacing;
    const midY = startY + nodeSpacing / 2;
    
    // Switch direction for each segment (left then right)
    const direction = i % 2 === 0 ? 1 : -1;
    const cpX = centerX + (amplitude * direction);

    // Quadratic bezier curve to the next point
    d += ` Q ${cpX} ${midY}, ${centerX} ${endY}`;
  }

  return (
    <View style={[styles.container, { height: pathHeight }]}>
      <Svg width={width} height={pathHeight} style={styles.svg}>
        <Path
          d={d}
          stroke={Colors.border}
          strokeWidth={4}
          strokeDasharray="8 8"
          fill="none"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40, // Offset to align with first node center
    left: 0,
    width: '100%',
    zIndex: 1, // Behind the nodes
  },
  svg: {
    position: 'absolute',
  },
});
