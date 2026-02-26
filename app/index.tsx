import SplashScreen from '@/core/ui/SplashScreen';
import { useSplashNavigation } from '@/hooks/splash/useSplashNavigation';

export default function AppEntry() {
  const { navigateBasedOnAuth } = useSplashNavigation();

  return <SplashScreen onFinish={navigateBasedOnAuth} />;
}
