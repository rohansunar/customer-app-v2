import { useProfile } from '@/features/profile/hooks/useProfile';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { IconSymbol } from '../../components/ui/icon-symbol';

export default function ProfileScreen() {
  // console.log('ProfileScreen render');
  const { data, isLoading, error } = useProfile();
  const { mutate, isPending } = useUpdateProfile();

  // Local editable state
  const [name, setName] = useState('');
  const [email, setEmail] = useState<string | null>(null);

  // console.log('Data', data);
  // Populate form when profile loads
  useEffect(() => {
    if (data) {
      setName(data.name ?? '');
      setEmail(data.email);
    }
  }, [data]);

  if (isLoading) {
    return <Text>Loading profile...</Text>;
  }

  if (error) {
    return <Text>Error loading profile: {error.message}</Text>;
  }

  if (!data) {
    return <Text>No profile data available.</Text>;
  }

  function handleSave() {
    mutate({
      name,
      email,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {/* Status */}
      <Text>Status</Text>
      <IconSymbol
        name={data.isActive ? 'checkmark.circle.fill' : 'xmark.circle.fill'}
        size={24}
        color={data.isActive ? 'green' : 'red'}
      />

      {/* Phone (disabled) */}
      <Text>Phone</Text>
      <TextInput
        value={data.phone}
        editable={false}
        style={styles.disabledInput}
      />

      {/* Name */}
      <Text>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        style={styles.input}
      />

      {/* Email */}
      <Text>Email</Text>
      <TextInput
        value={email ?? ''}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        style={styles.input}
      />

      <Button
        title={isPending ? 'Saving...' : 'Save Changes'}
        onPress={handleSave}
        disabled={isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
  },
  disabledInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
});
