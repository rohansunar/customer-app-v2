import { useAuth } from '@/core/providers/AuthProvider';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {

  useAuthGuard();

  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <View style={styles.container}>
      <Text>Welcome Home</Text>
      <Button
        title="Logout"
        onPress={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    alignItems:"center",
    justifyContent:"center"
  }
})