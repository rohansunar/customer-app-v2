import { StyleSheet } from 'react-native';

export const orderCardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  info: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  price: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
    fontFamily: 'Inter',
  },
});
