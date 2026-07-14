import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulseLine = keyframes`
  0% { stroke-dashoffset: 2000; opacity: 0; }
  50% { stroke-dashoffset: 1000; opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 0; }
`;

const SvgBackground = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
`;

const ConnectionLine = styled.path`
  fill: none;
  stroke: #4CAF50; /* SBN Green */
  stroke-width: 1;
  stroke-dasharray: 2000;
  animation: ${pulseLine} 8s linear infinite;
  opacity: 0.8;
`;

const ProfileNode = styled.circle`
  fill: #fff;
  stroke: #2196F3; /* SBN Blue */
  stroke-width: 2;
`;

const Label = styled.text`
  fill: #666;
  font-size: 12px;
  font-weight: bold;
`;

// Helper function to create random connection paths
const createPath = (x1, y1, x2, y2) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2 - 50; // Add some curvature
  return `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
};

// Defined nodes representing locations on the globe
const nodes = [
  { id: 'london', x: 250, y: 150, label: 'Global Leader' },
  { id: 'tokyo', x: 800, y: 100, label: 'Mentor' },
  { id: 'sydney', x: 750, y: 350, label: 'Profile' },
  { id: 'new_york', x: 100, y: 180, label: 'Global Leader' },
  { id: 'cairo', x: 400, y: 220, label: 'Mentor' },
];

const AnimatedConnections = () => {
  return (
    <SvgBackground viewBox="0 0 1000 500">
      {/* Defined paths between nodes */}
      <ConnectionLine d={createPath(100, 180, 250, 150)} />
      <ConnectionLine d={createPath(250, 150, 400, 220)} />
      <ConnectionLine d={createPath(400, 220, 800, 100)} />
      <ConnectionLine d={createPath(800, 100, 750, 350)} />
      <ConnectionLine d={createPath(750, 350, 100, 180)} />
      <ConnectionLine d={createPath(250, 150, 800, 100)} />

      {/* Render the nodes and labels */}
      {nodes.map(node => (
        <g key={node.id}>
          <ProfileNode cx={node.x} cy={node.y} r={6} />
          <Label x={node.x - 40} y={node.y + 20}>{node.label}</Label>
        </g>
      ))}
    </SvgBackground>
  );
};

export default AnimatedConnections;
