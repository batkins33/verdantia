export const colors = {
  primary: '#1B4332',      // Dark green
  background: '#F8F5F0',  // Cream/off-white
  accent: '#E0B45C',      // Golden yellow
  text: '#1B4332',        // Dark green for text
  textSecondary: '#6B7280', // Gray for secondary text
  error: '#DC2626',       // Red for errors
  success: '#059669',     // Green for success
  warning: '#D97706',     // Orange for warnings
  border: '#D1D5DB',      // Light gray for borders
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type Colors = typeof colors;
