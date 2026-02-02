import { ViewStyle, TextStyle, Animated } from 'react-native';

/**
 * Props for the SplashScreen component
 */
export interface SplashScreenProps {
  /** Duration in milliseconds before onFinish is called */
  duration?: number;
  /** Callback fired when splash duration completes */
  onFinish: () => void;
  /** Optional custom logo component */
  LogoComponent?: React.ReactNode;
  /** Optional override for app name */
  appName?: string;
  /** Optional override for tagline */
  tagline?: string;
  /** Optional override for bottom tagline */
  bottomTagline?: string;
  /** Test identifier for E2E testing */
  testID?: string;
}

/**
 * Animation state for the splash screen
 */
export interface SplashAnimationState {
  /** Logo bounce animation value */
  logoOpacity: Animated.Value;
  /** Logo scale animation value */
  logoScale: Animated.Value;
  /** Background circle scale animation */
  circleScale: Animated.Value;
  /** Background circle opacity */
  circleOpacity: Animated.Value;
  /** Loading dots animation values */
  dotsOpacity: Animated.Value[];
  /** Loading dots scale animation values */
  dotsScale: Animated.Value[];
  /** Fade out animation for exit */
  fadeOut: Animated.Value;
}

/**
 * Style types for splash screen components
 */
export type SplashScreenStyles = {
  container: ViewStyle;
  gradient: ViewStyle;
  backgroundCircles: ViewStyle;
  circle: ViewStyle;
  circleTopLeft: ViewStyle;
  circleBottomRight: ViewStyle;
  content: ViewStyle;
  logoContainer: ViewStyle;
  logoWrapper: ViewStyle;
  logoIcon: ViewStyle;
  appName: TextStyle;
  tagline: TextStyle;
  loadingDotsContainer: ViewStyle;
  loadingDot: ViewStyle;
  bottomTaglineContainer: ViewStyle;
  bottomTagline: TextStyle;
};
