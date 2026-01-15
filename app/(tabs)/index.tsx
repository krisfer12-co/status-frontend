import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const API = "https://status-api-8f7v.onrender.com/api";

export default function SearchScreen() {
  const [name, setName] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name to search');
      return;
    }
    
    setLoading(true);
    setSearched(true);
    
    try {
      const response = await fetch(`${API}/search?name=${encodeURIComponent(name.trim())}`);
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setResults([]);
        Alert.alert('No Results', `No relationships found for "${name}"`);
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Search failed. Please check your internet connection.');
      setResults([]);
    }
    
    setLoading(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Ionicons name="heart" size={36} color="#0f172a" />
          </View>
          <Text style={styles.title}>STATUS</Text>
          <Text style={styles.subtitle}>Relationship Registry</Text>
        </View>

        {/* Search Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔍 Search Someone</Text>
          <Text style={styles.cardDesc}>Check if someone is in a registered relationship</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Enter first or last name"
            placeholderTextColor="#64748b"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          
          <TouchableOpacity 
            style={[styles.btn, loading && styles.btnDisabled]} 
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="search" size={20} color="#fff" />
            )}
            <Text style={styles.btnText}>{loading ? 'Searching...' : 'Search'}</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {searched && !loading && results.length === 0 && (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={50} color="#64748b" />
            <Text style={styles.noResultsText}>No relationships found</Text>
            <Text style={styles.noResultsSubtext}>Try searching a different name</Text>
          </View>
        )}

        {results.map((r, i) => (
          <View key={i} style={styles.result}>
            <View style={styles.resultIcon}>
              <Ionicons name="heart-circle" size={50} color="#10b981" />
            </View>
            <View style={styles.resultContent}>
              <Text style={styles.resultNames}>
                {r.person1?.name || 'Unknown'} & {r.person2?.name || 'Unknown'}
              </Text>
              <View style={styles.resultDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color="#10b981" />
                  <Text style={styles.resultInfo}>
                    {r.person1?.city || 'N/A'}, {r.person1?.state || 'N/A'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={14} color="#10b981" />
                  <Text style={styles.resultInfo}>
                    Together since {formatDate(r.relationship_start_date)}
                  </Text>
                </View>
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.verifiedText}>Verified Relationship</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color="#10b981" />
          <Text style={styles.infoText}>
            Search is free! Register your relationship for only $0.99
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  btn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noResults: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#1e293b',
    borderRadius: 20,
    marginBottom: 20,
  },
  noResultsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  noResultsSubtext: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 8,
  },
  result: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  resultIcon: {
    marginRight: 16,
  },
  resultContent: {
    flex: 1,
  },
  resultNames: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  resultDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  resultInfo: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  infoText: {
    color: '#94a3b8',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
});
