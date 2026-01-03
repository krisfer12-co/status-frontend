import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const API = "https://status-api-8f7v.onrender.com/api";

export default function SearchScreen() {
  const [name, setName] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!name) { Alert.alert('Error', 'Enter a name'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/search?name=${name}`);
      const data = await res.json();
      setResults(data.results || []);
      if (data.results?.length === 0) Alert.alert('No Results', 'No relationships found');
    } catch (e) { Alert.alert('Error', 'Search failed'); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={s.container}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.header}>
          <View style={s.logo}><Ionicons name="heart" size={32} color="#0f172a" /></View>
          <Text style={s.title}>STATUS</Text>
          <Text style={s.subtitle}>Relationship Registry</Text>
        </View>
        <View style={s.card}>
          <Text style={s.cardTitle}>Search Someone</Text>
          <TextInput style={s.input} placeholder="Enter name" placeholderTextColor="#64748b" value={name} onChangeText={setName} />
          <TouchableOpacity style={s.btn} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={s.btnText}>{loading ? 'Searching...' : 'Search'}</Text>
          </TouchableOpacity>
        </View>
        {results.map((r, i) => (
          <View key={i} style={s.result}>
            <Ionicons name="heart-circle" size={40} color="#10b981" />
            <View style={s.resultText}>
              <Text style={s.resultName}>{r.person1?.name} & {r.person2?.name}</Text>
              <Text style={s.resultInfo}>{r.person1?.state} • Since {r.relationship_start_date}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', letterSpacing: 4 },
  subtitle: { fontSize: 14, color: '#94a3b8' },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginBottom: 20 },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  input: { backgroundColor: '#0f172a', borderRadius: 10, padding: 14, color: '#fff', marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  btn: { backgroundColor: '#10b981', borderRadius: 10, padding: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  result: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  resultText: { marginLeft: 12 },
  resultName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  resultInfo: { fontSize: 12, color: '#94a3b8' },
});
