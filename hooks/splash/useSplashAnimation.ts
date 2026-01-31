import { useRef, useCallback } from 'react';
import { Animated, Easing } from 'react-native';

interface UseSplashAnimationReturn {
    logoAnimations: {
        opacity: Animated.Value;
        scale: Animated.Value;
    };
    circleAnimations: {
        scale: Animated.Value;
        opacity: Animated.Value;
    };
    dotsAnimations: {
        opacity: Animated.Value[];
        scale: Animated.Value[];
    };
    fadeOutAnimation: Animated.Value;
    startAnimations: () => void;
    startExitAnimation: () => Animated.CompositeAnimation;
}

export function useSplashAnimation(): UseSplashAnimationReturn {
    // Logo animations
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;

    // Background circle animations
    const circleScale = useRef(new Animated.Value(0.8)).current;
    const circleOpacity = useRef(new Animated.Value(0)).current;

    // Loading dots animations
    const dotsOpacity = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;
    const dotsScale = useRef([
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ]).current;

    // Fade out animation for exit
    const fadeOut = useRef(new Animated.Value(1)).current;



    const startAnimations = useCallback(() => {
        // console.debug('[SplashAnimation] Starting entry animations');

        // Logo bounce in
        Animated.parallel([
            Animated.timing(logoOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
                easing: Easing.out(Easing.ease),
            }),
            Animated.spring(logoScale, {
                toValue: 1,
                damping: 12,
                mass: 1,
                stiffness: 150,
                useNativeDriver: true,
            }),
        ]).start();

        // Background circles pulse
        Animated.loop(
            Animated.sequence([
                Animated.timing(circleScale, {
                    toValue: 1.2,
                    duration: 2000,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.ease),
                }),
                Animated.timing(circleOpacity, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Loading dots bounce animation
        dotsOpacity.forEach((opacity, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(index * 150),
                    Animated.parallel([
                        Animated.timing(opacity, {
                            toValue: 1,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.spring(dotsScale[index], {
                            toValue: 1,
                            damping: 12,
                            mass: 1,
                            stiffness: 200,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.parallel([
                        Animated.timing(opacity, {
                            toValue: 0,
                            duration: 400,
                            useNativeDriver: true,
                        }),
                        Animated.spring(dotsScale[index], {
                            toValue: 0,
                            damping: 12,
                            mass: 1,
                            stiffness: 200,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            ).start();
        });
    }, []); // Dependencies are refs, safe to omit or include if strictly needed, but refs are stable.

    const startExitAnimation = useCallback(() => {
        // console.debug('[SplashAnimation] Starting exit animation');
        return Animated.timing(fadeOut, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.in(Easing.quad),
        });
    }, []);

    return {
        logoAnimations: { opacity: logoOpacity, scale: logoScale },
        circleAnimations: { scale: circleScale, opacity: circleOpacity },
        dotsAnimations: { opacity: dotsOpacity, scale: dotsScale },
        fadeOutAnimation: fadeOut,
        startAnimations,
        startExitAnimation,
    };
}
