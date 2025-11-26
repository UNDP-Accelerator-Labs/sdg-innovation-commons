'use client';

import React, { useEffect, useRef, useState } from 'react';

interface WordCloudData {
  text: string;
  size: number;
  platform?: string;
  daysUsed?: number;
}

interface WordCloudProps {
  data: WordCloudData[];
  width?: number;
  height?: number;
  className?: string;
}

// Simple word cloud implementation without external dependencies
export default function WordCloud({ data, width = 600, height = 400, className = '' }: WordCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredWord, setHoveredWord] = useState<WordCloudData | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate font sizes based on frequency
    const maxSize = Math.max(...data.map(d => d.size));
    const minSize = Math.min(...data.map(d => d.size));
    const sizeRange = maxSize - minSize || 1;

    // Color palette for different platforms
    const colors = [
      '#059669', // Green
      '#0891b2', // Blue  
      '#ea580c', // Orange
      '#dc2626', // Red
      '#7c3aed', // Purple
      '#ca8a04', // Yellow
      '#be185d', // Pink
    ];

    const platformColors: Record<string, string> = {};
    let colorIndex = 0;

    // Position words with collision detection to prevent overlapping
    const positions: Array<{ word: WordCloudData; x: number; y: number; fontSize: number; color: string; width: number; height: number }> = [];
    
    // Sort words by size (frequency) for better visual hierarchy
    const sortedData = [...data].sort((a, b) => b.size - a.size);
    
    // Helper function to check if two rectangles overlap
    const checkCollision = (pos1: any, pos2: any) => {
      const padding = 8; // Minimum space between words
      return !(pos1.x + pos1.width/2 + padding < pos2.x - pos2.width/2 ||
               pos2.x + pos2.width/2 + padding < pos1.x - pos1.width/2 ||
               pos1.y + pos1.height/2 + padding < pos2.y - pos2.height/2 ||
               pos2.y + pos2.height/2 + padding < pos1.y - pos1.height/2);
    };

    // Helper function to find a non-overlapping position
    const findValidPosition = (word: WordCloudData, fontSize: number, attempts = 100) => {
      ctx.font = `bold ${fontSize}px Arial`;
      const textWidth = ctx.measureText(word.text).width;
      const textHeight = fontSize;
      
      for (let attempt = 0; attempt < attempts; attempt++) {
        let x, y;
        
        if (data.length <= 3) {
          // For very few words, arrange horizontally with guaranteed spacing
          const spacing = width / (data.length + 1);
          x = spacing * (positions.length + 1);
          y = height / 2;
        } else if (data.length <= 8) {
          // For few words, use grid layout with some randomization
          const cols = Math.ceil(Math.sqrt(data.length));
          const cellWidth = width / cols;
          const cellHeight = height / Math.ceil(data.length / cols);
          
          const baseCol = positions.length % cols;
          const baseRow = Math.floor(positions.length / cols);
          
          // Add some randomization within the cell
          const randomX = (Math.random() - 0.5) * (cellWidth * 0.3);
          const randomY = (Math.random() - 0.5) * (cellHeight * 0.3);
          
          x = cellWidth * baseCol + cellWidth / 2 + randomX;
          y = cellHeight * baseRow + cellHeight / 2 + randomY;
        } else if (data.length <= 15) {
          // For medium datasets, use organized concentric circles
          const centerX = width / 2;
          const centerY = height / 2;
          
          if (positions.length === 0) {
            x = centerX;
            y = centerY;
          } else {
            const ring = Math.ceil(positions.length / 8);
            const itemsInRing = Math.min(8, data.length - (ring - 1) * 8);
            const angleStep = (2 * Math.PI) / itemsInRing;
            const angle = ((positions.length - 1) % itemsInRing) * angleStep + (Math.random() - 0.5) * 0.3;
            const radius = ring * 80 + Math.random() * 20;
            
            x = centerX + radius * Math.cos(angle);
            y = centerY + radius * Math.sin(angle);
          }
        } else {
          // For larger datasets, use improved spiral with better spacing
          const angle = positions.length * 0.5 + Math.random() * 0.4;
          const radius = Math.sqrt(positions.length) * 18 + Math.random() * 15;
          x = width / 2 + radius * Math.cos(angle);
          y = height / 2 + radius * Math.sin(angle);
        }

        // Ensure word stays within bounds
        const margin = 20;
        x = Math.max(textWidth / 2 + margin, Math.min(width - textWidth / 2 - margin, x));
        y = Math.max(textHeight / 2 + margin, Math.min(height - textHeight / 2 - margin, y));

        const newPos = {
          word,
          x,
          y,
          fontSize,
          width: textWidth,
          height: textHeight,
          color: ''
        };

        // Check for collisions with existing words
        let hasCollision = false;
        for (const existingPos of positions) {
          if (checkCollision(newPos, existingPos)) {
            hasCollision = true;
            break;
          }
        }

        if (!hasCollision) {
          return { x, y, width: textWidth, height: textHeight };
        }
      }

      // If no valid position found, use a fallback position
      return {
        x: Math.random() * (width - textWidth) + textWidth / 2,
        y: Math.random() * (height - textHeight) + textHeight / 2,
        width: textWidth,
        height: textHeight
      };
    };
    
    sortedData.forEach((word, index) => {
      // Calculate font size with improved scaling
      const normalizedSize = (word.size - minSize) / sizeRange;
      let fontSize;
      
      if (data.length <= 3) {
        fontSize = 24 + (normalizedSize * 28); // 24-52px range
      } else if (data.length <= 8) {
        fontSize = 20 + (normalizedSize * 24); // 20-44px range
      } else if (data.length <= 15) {
        fontSize = 16 + (normalizedSize * 20); // 16-36px range
      } else if (data.length <= 30) {
        fontSize = 14 + (normalizedSize * 16); // 14-30px range
      } else {
        fontSize = 12 + (normalizedSize * 12); // 12-24px range
      }
      
      // Assign color based on platform
      if (word.platform && !platformColors[word.platform]) {
        platformColors[word.platform] = colors[colorIndex % colors.length];
        colorIndex++;
      }
      const color = word.platform ? platformColors[word.platform] : colors[index % colors.length];

      const position = findValidPosition(word, fontSize);

      positions.push({
        word,
        x: position.x,
        y: position.y,
        fontSize,
        color,
        width: position.width,
        height: position.height
      });
    });

    // Draw words with enhanced visibility
    positions.forEach(pos => {
      ctx.font = `bold ${pos.fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Draw background/outline for better visibility
      ctx.strokeStyle = 'rgba(255,255,255,0.8)';
      ctx.lineWidth = Math.max(1, pos.fontSize / 12);
      ctx.strokeText(pos.word.text, pos.x, pos.y);
      
      // Add subtle shadow for depth
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      // Draw main text
      ctx.fillStyle = pos.color;
      ctx.fillText(pos.word.text, pos.x, pos.y);
      
      // Reset shadow and stroke
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = 'transparent';
      ctx.lineWidth = 0;
    });

    // Handle mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePos({ x: e.clientX, y: e.clientY });

      // Check if mouse is over any word using the stored dimensions
      let foundWord = null;
      for (const pos of positions) {
        if (x >= pos.x - pos.width/2 && x <= pos.x + pos.width/2 && 
            y >= pos.y - pos.height/2 && y <= pos.y + pos.height/2) {
          foundWord = pos.word;
          canvas.style.cursor = 'pointer';
          break;
        }
      }
      
      if (!foundWord) {
        canvas.style.cursor = 'default';
      }
      
      setHoveredWord(foundWord);
    };

    const handleMouseLeave = () => {
      setHoveredWord(null);
      canvas.style.cursor = 'default';
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [data, width, height]);

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg ${className}`} 
           style={{ width, height }}>
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">No search data available</p>
          <p className="text-sm">Word cloud will appear when users start searching</p>
        </div>
      </div>
    );
  }

  // For very few words (1), use a simple centered layout instead of canvas
  if (data.length === 1) {
    const word = data[0];
    return (
      <div className={`flex items-center justify-center border border-gray-200 rounded-lg bg-white ${className}`} 
           style={{ width, height }}>
        <div className="text-center group cursor-pointer">
          <div 
            className="font-bold text-4xl md:text-5xl lg:text-6xl transition-transform hover:scale-105"
            style={{ color: '#059669' }}
          >
            {word.text}
          </div>
          <div className="text-lg text-gray-600 mt-3">
            Searched {word.size} times
            {word.platform && <div className="text-sm mt-1 text-gray-500">Platform: {word.platform}</div>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-200 rounded-lg bg-white"
      />
      
      {/* Tooltip */}
      {hoveredWord && (
        <div 
          className="absolute z-10 bg-black text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
          style={{ 
            left: mousePos.x + 10, 
            top: mousePos.y - 40,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-semibold">{hoveredWord.text}</div>
          <div>Searched {hoveredWord.size} times</div>
          {hoveredWord.platform && <div>Platform: {hoveredWord.platform}</div>}
          {hoveredWord.daysUsed && <div>Used {hoveredWord.daysUsed} days</div>}
        </div>
      )}

      {/* Legend for platforms */}
      {Object.keys(data.reduce((acc, word) => {
        if (word.platform) acc[word.platform] = true;
        return acc;
      }, {} as Record<string, boolean>)).length > 1 && (
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span className="font-medium">Platforms:</span>
          {Object.entries(data.reduce((acc, word) => {
            if (word.platform) {
              if (!acc[word.platform]) acc[word.platform] = 0;
              acc[word.platform] += word.size;
            }
            return acc;
          }, {} as Record<string, number>)).map(([platform, count], index) => (
            <div key={platform} className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: ['#059669', '#0891b2', '#ea580c', '#dc2626', '#7c3aed', '#ca8a04', '#be185d'][index % 7] }}
              />
              <span>{platform} ({count})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
