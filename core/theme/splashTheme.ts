// Theme colors for splash screen
export const splashTheme = {
    // Gradient colors (Purple → Blue → Indigo)
    gradientColors: {
        start: '#9333EA', // Purple-600
        center: '#2563EB', // Blue-600
        end: '#4F46E5', // Indigo-700
    },
    // Background circle colors
    circleColors: {
        primary: 'rgba(255, 255, 255, 0.05)',
        secondary: 'rgba(255, 255, 255, 0.05)',
    },
    // Logo container
    logoContainer: {
        size: 128,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOpacity: 0.3,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 4 },
    },
    // Typography
    appName: {
        fontSize: 40,
        fontWeight: '700' as const,
        color: '#FFFFFF',
        letterSpacing: -0.5,
    },
    tagline: {
        fontSize: 18,
        fontWeight: '500' as const,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    bottomTagline: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    // Animation durations
    animations: {
        logoBounce: 800,
        dotsBounce: 400,
        circlePulse: 2000,
        fadeOut: 300,
    },
    // Loading dots
    loadingDots: {
        size: 12,
        count: 3,
        delay: [0, 150, 300],
    },
};

// Export colors for gradient
export const splashGradientColors = [
    splashTheme.gradientColors.start,
    splashTheme.gradientColors.center,
    splashTheme.gradientColors.end,
] as const;
