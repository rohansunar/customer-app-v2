import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/core/theme/colors';
import type { SplashScreenProps } from './SplashScreen.types';

export default function SplashScreen({
  duration = 2500,
  onFinish,
  appName = 'AquaFlow',
  tagline = 'Pure water, delivered',
  testID = 'splash-screen',
}: SplashScreenProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;
  const ripple1Progress = useRef(new Animated.Value(0)).current;
  const ripple2Progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ExpoSplashScreen.hideAsync().catch(() => {
      // no-op: native splash may already be hidden
    });

    const entranceAnimation = Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(titleTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(subtitleOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(subtitleTranslateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]);

    const ripple1 = Animated.loop(
      Animated.sequence([
        Animated.timing(ripple1Progress, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ]),
    );

    const ripple2 = Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(ripple2Progress, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(300),
      ]),
    );

    entranceAnimation.start();
    ripple1.start();
    ripple2.start();

    const timer = setTimeout(() => {
      onFinish();
    }, duration);

    return () => {
      clearTimeout(timer);
      ripple1.stop();
      ripple2.stop();
      ripple1Progress.stopAnimation();
      ripple2Progress.stopAnimation();
    };
  }, [
    duration,
    logoOpacity,
    logoScale,
    onFinish,
    ripple1Progress,
    ripple2Progress,
    subtitleOpacity,
    subtitleTranslateY,
    titleOpacity,
    titleTranslateY,
  ]);

  const ripple1Scale = ripple1Progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5],
  });

  const ripple1Opacity = ripple1Progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0],
  });

  const ripple2Scale = ripple2Progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.5],
  });

  const ripple2Opacity = ripple2Progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 0],
  });

  return (
    <View testID={`${testID}-container`} style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <LinearGradient
            colors={[colors.splashBlue500, colors.splashBlue700]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBackground}
          >
            <Ionicons name="water" size={36} color={colors.splashWhite} />
          </LinearGradient>

          <Animated.View
            style={[
              styles.ripple,
              styles.ripplePrimary,
              { opacity: ripple1Opacity, transform: [{ scale: ripple1Scale }] },
            ]}
          />

          <Animated.View
            style={[
              styles.ripple,
              styles.rippleSecondary,
              { opacity: ripple2Opacity, transform: [{ scale: ripple2Scale }] },
            ]}
          />
        </Animated.View>

        <Animated.Text
          testID={`${testID}-app-name`}
          style={[
            styles.appName,
            { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] },
          ]}
        >
          {appName}
        </Animated.Text>

        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleTranslateY }],
            },
          ]}
        >
          {tagline}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoBackground: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 112,
    height: 72,
    borderRadius: 56,
    left: -20,
    top: 0,
    borderWidth: 3,
  },
  ripplePrimary: {
    borderColor: colors.splashBlue400,
  },
  rippleSecondary: {
    borderColor: colors.splashBlue300,
  },
  appName: {
    fontSize: 30,
    color: colors.splashGray900,
    marginTop: 2,
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    color: colors.splashGray500,
  },
});
