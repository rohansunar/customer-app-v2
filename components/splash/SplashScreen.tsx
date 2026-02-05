import { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ExpoSplashScreen from 'expo-splash-screen';

import { useSplashAnimation } from '@/hooks/splash/useSplashAnimation';
import { useSplashDuration } from '@/hooks/splash/useSplashDuration';
import { splashTheme, splashGradientColors } from '@/core/theme/splashTheme';
import type { SplashScreenProps } from './SplashScreen.types';

const NO_OP = () => { };

export default function SplashScreen({
    duration = 2500,
    onFinish,
    testID = 'splash-screen',
}: SplashScreenProps) {
    const {
        logoAnimations,
        circleAnimations,
        dotsAnimations,
        fadeOutAnimation,
        startAnimations,
        startExitAnimation,
    } = useSplashAnimation();

    // Stable callback for timer to prevent re-renders
    const timerCallback = useMemo(() => NO_OP, []);

    const { isComplete, start: startTimer } = useSplashDuration({
        duration,
        onComplete: timerCallback
    });

    useEffect(() => {
        // console.debug('[SplashScreen] Mounting and starting sequence');
        // Hide native splash screen once custom splash is mounted
        ExpoSplashScreen.hideAsync();
        startAnimations();
        startTimer();
    }, [startAnimations, startTimer]);

    useEffect(() => {
        if (isComplete) {
            // console.debug('[SplashScreen] Duration complete, starting exit animation');
            const exitAnimation = startExitAnimation();
            exitAnimation.start(() => {
                console.debug('[SplashScreen] Exit animation complete, calling onFinish');
                onFinish();
            });
        }
    }, [isComplete, onFinish, startExitAnimation]);

    return (
        <Animated.View testID={`${testID}-container`} style={[styles.container, { opacity: fadeOutAnimation }]}>
            {/* Gradient Background */}
            <LinearGradient
                colors={splashGradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />

            {/* Animated Background Circles */}
            <View style={styles.backgroundCircles}>
                <Animated.View
                    style={[
                        styles.circle,
                        styles.circleTopLeft,
                        {
                            transform: [{ scale: circleAnimations.scale }],
                            opacity: circleAnimations.opacity,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.circle,
                        styles.circleBottomRight,
                        {
                            transform: [{ scale: circleAnimations.scale }],
                            opacity: circleAnimations.opacity,
                        },
                    ]}
                />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {/* Logo Container with Bounce */}
                <Animated.View
                    testID={`${testID}-logo`}
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoAnimations.opacity,
                            transform: [{ scale: logoAnimations.scale }],
                        },
                    ]}
                >
                    <View style={styles.logoWrapper}>
                        {/* Logo Icon Placeholder - Replace with actual icon */}
                        <View style={styles.logoIcon} />
                    </View>
                </Animated.View>

                {/* App Name */}
                <Animated.Text
                    testID={`${testID}-app-name`}
                    style={[styles.appName, { opacity: logoAnimations.opacity }]}
                >
                    QuickServe
                </Animated.Text>

                {/* Tagline */}
                <Animated.Text
                    style={[styles.tagline, { opacity: logoAnimations.opacity }]}
                >
                    Your Daily Essentials Delivered
                </Animated.Text>

                {/* Loading Dots */}
                <View style={styles.loadingDotsContainer}>
                    {dotsAnimations.opacity.map((opacity, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.loadingDot,
                                {
                                    opacity: opacity,
                                    transform: [{ scale: dotsAnimations.scale[index] }],
                                },
                            ]}
                        />
                    ))}
                </View>
            </View>

            {/* Bottom Tagline */}
            <View style={styles.bottomTaglineContainer}>
                <Text style={styles.bottomTagline}>Fast • Fresh • Reliable</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    backgroundCircles: {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        borderRadius: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    circleTopLeft: {
        top: -100,
        left: -100,
        width: 400,
        height: 400,
    },
    circleBottomRight: {
        bottom: -100,
        right: -100,
        width: 400,
        height: 400,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        marginBottom: 32,
    },
    logoWrapper: {
        width: splashTheme.logoContainer.size,
        height: splashTheme.logoContainer.size,
        borderRadius: splashTheme.logoContainer.borderRadius,
        backgroundColor: splashTheme.logoContainer.backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: splashTheme.logoContainer.shadowColor,
        shadowOffset: splashTheme.logoContainer.shadowOffset,
        shadowOpacity: splashTheme.logoContainer.shadowOpacity,
        shadowRadius: splashTheme.logoContainer.shadowRadius,
        elevation: 8,
    },
    logoIcon: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#9333EA',
    },
    appName: {
        ...splashTheme.appName,
        marginBottom: 12,
        textAlign: 'center',
    },
    tagline: {
        ...splashTheme.tagline,
        textAlign: 'center',
        marginBottom: 48,
    },
    loadingDotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingDot: {
        width: splashTheme.loadingDots.size,
        height: splashTheme.loadingDots.size,
        borderRadius: splashTheme.loadingDots.size / 2,
        backgroundColor: '#FFFFFF',
    },
    bottomTaglineContainer: {
        position: 'absolute',
        bottom: 48,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    bottomTagline: {
        ...splashTheme.bottomTagline,
    },
});
