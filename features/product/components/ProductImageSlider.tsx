import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';

const { width: WINDOW_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = spacing.m * 2;
const SLIDER_WIDTH = WINDOW_WIDTH - CARD_MARGIN;

interface ProductImageSliderProps {
  images: string[];
}

export function ProductImageSlider({ images }: ProductImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const timerRef = useRef<number | null>(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    if (images.length > 1) {
      timerRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % images.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }, 3000);
    }
  };

  const stopAutoPlay = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startAutoPlay();
    return () => stopAutoPlay();
  }, [activeIndex, images.length]);

  if (!images || images.length === 0) {
    return (
      <View style={styles.placeholderContainer}>
        <Image
          source={require('@/assets/images/product-placeholder.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SLIDER_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={stopAutoPlay}
        onScrollEndDrag={startAutoPlay}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      />
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    overflow: 'hidden',
    borderRadius: spacing.radius.l,
    backgroundColor: colors.surface,
  },
  placeholderContainer: {
    height: 250,
    width: '100%',
    borderRadius: spacing.radius.l,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: SLIDER_WIDTH,
    height: 250,
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: spacing.m,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.xl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: colors.surface,
    width: 12, // Pill shape for active dot
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
});
