export const theme = {
  colors: {
    // Main colors
    primary: '#5B8CAD', // Brighter blue (adjusted from #3A5A7D)
    secondary: '#4B8B9D', // Teal blue
    accent: '#A1C6D4', // Light blue
    
    // Status colors
    success: '#4B8B9D', // Using teal blue for success
    warning: '#5B8CAD', // Using brighter blue for warning
    danger: '#F4F9FF', // Using light color for danger
    
    // Feature status colors
    onTrack: '#4B8B9D', // Teal blue
    atRisk: '#5B8CAD', // Brighter blue
    delayed: '#A1C6D4', // Light blue
    
    // Background colors - keeping dark theme
    bgPrimary: '#0f172a', // Deep space blue (original dark background)
    bgSecondary: '#1e293b', // Dark slate (original)
    bgTertiary: '#334155', // Medium slate (original)
    
    // Text colors
    textPrimary: '#F4F9FF', // Almost white
    textSecondary: '#A1C6D4', // Light blue
    textMuted: '#4B8B9D', // Teal blue
  },
  
  // Gradients for 3D objects
  gradients: {
    healthy: ['#4B8B9D', '#A1C6D4'], // Teal to light blue
    warning: ['#5B8CAD', '#4B8B9D'], // Brighter blue to teal
    critical: ['#A1C6D4', '#F4F9FF'], // Light blue to white
    cosmic: ['#5B8CAD', '#A1C6D4'], // Brighter blue to light blue
    nebula: ['#4B8B9D', '#F4F9FF'], // Teal to white
  },
  
  // Glow effects
  glow: {
    success: '0 0 20px rgba(75, 139, 157, 0.5)', // Teal glow
    warning: '0 0 20px rgba(91, 140, 173, 0.5)', // Brighter blue glow
    danger: '0 0 20px rgba(244, 249, 255, 0.5)', // Light glow
    accent: '0 0 20px rgba(161, 198, 212, 0.5)', // Light blue glow
  },
  
  // Opacity levels
  opacity: {
    hover: 0.8,
    active: 0.9,
    disabled: 0.5,
  },
  
  // Shadows for 3D effects
  shadows: {
    sm: '0 2px 4px rgba(91, 140, 173, 0.1)',
    md: '0 4px 6px rgba(91, 140, 173, 0.1)',
    lg: '0 10px 15px rgba(91, 140, 173, 0.1)',
    glow: '0 0 30px rgba(161, 198, 212, 0.2)',
  },
}; 