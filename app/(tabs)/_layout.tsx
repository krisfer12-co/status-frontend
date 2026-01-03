import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: '#1e293b', borderTopColor: '#334155' }, tabBarActiveTintColor: '#10b981', tabBarInactiveTintColor: '#64748b' }}>
      <Tabs.Screen name="index" options={{ title: 'Search', tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} /> }} />
      <Tabs.Screen name="register" options={{ title: 'Register', tabBarIcon: ({ color, size }) => <Ionicons name="heart" size={size} color={color} /> }} />
    </Tabs>
  );
}
