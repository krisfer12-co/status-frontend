import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const API = "https://status-api-8f7v.onrender.com/api";

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    person1_name: '',
    person1_email: '',
    person1_city: '',
    person1_state: '',
    person2_name: '',
    person2_email: '',
    person2_city: '',
    person2_state: '',
    relationship_start_date: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = [
      'person1_name', 'person1_email', 'person1_city', 'person1_state',
      'person2_name', 'person2_email', 'person2_city', 'person2_state',
      'relationship_start_date'
    ];
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]?.trim()) {
        const fieldName = field.replace(/_/g, ' ').replace(/person1/g, 'Person 1').replace(/person2/g, 'Person 2');
        Alert.alert('Missing Field', `Please fill in ${fieldName}`);
        return false;
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.person1_email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email for Person 1');
      return false;
    }
    if (!emailRegex.test(formData.person2_email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email for Person 2');
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // Create checkout session
      const response = await fetch(`${API}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          person1: {
            name: formData.person1_name.trim(),
            email: formData.person1_email.trim().toLowerCase(),
            city: formData.person1_city.trim(),
            state: formData.person1_state.trim(),
          },
          person2: {
            name: formData.person2_name.trim(),
            email: formData.person2_email.trim().toLowerCase(),
            city: formData.person2_city.trim(),
            state: formData.person2_state.trim(),
          },
          relationship_start_date: formData.relationship_start_date.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Open Stripe checkout in browser
        const supported = await Linking.canOpenURL(data.url);
        if (supported) {
          await Linking.openURL(data.url);
          Alert.alert(
            'Payment Page Opened',
            'Complete your payment in the browser to finish registration. The registration costs $0.99.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Error', 'Cannot open payment page. Please try again.');
        }
      } else if (data.error) {
        Alert.alert('Error', data.error);
      } else {
        Alert.alert('Error', 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Registration failed. Please check your internet connection and try again.');
    }
    
    setLoading(false);
  };

  const openWebsite = () => {
    Linking.openURL('https://vite-react-rouge-omega-62.vercel.app');
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
          <Text style={styles.subtitle}>Register Your Relationship</Text>
        </View>

        {/* Price Badge */}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>Only $0.99</Text>
          <Text style={styles.priceSubtext}>One-time registration fee</Text>
        </View>

        {/* Person 1 Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={24} color="#10b981" />
            <Text style={styles.cardTitle}>Person 1</Text>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#64748b"
            value={formData.person1_name}
            onChangeText={(v) => updateField('person1_name', v)}
            autoCapitalize="words"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#64748b"
            value={formData.person1_email}
            onChangeText={(v) => updateField('person1_email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City"
              placeholderTextColor="#64748b"
              value={formData.person1_city}
              onChangeText={(v) => updateField('person1_city', v)}
              autoCapitalize="words"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State"
              placeholderTextColor="#64748b"
              value={formData.person1_state}
              onChangeText={(v) => updateField('person1_state', v)}
              autoCapitalize="characters"
              maxLength={2}
            />
          </View>
        </View>

        {/* Heart Connector */}
        <View style={styles.connector}>
          <Ionicons name="heart" size={32} color="#10b981" />
        </View>

        {/* Person 2 Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={24} color="#10b981" />
            <Text style={styles.cardTitle}>Person 2</Text>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#64748b"
            value={formData.person2_name}
            onChangeText={(v) => updateField('person2_name', v)}
            autoCapitalize="words"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#64748b"
            value={formData.person2_email}
            onChangeText={(v) => updateField('person2_email', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City"
              placeholderTextColor="#64748b"
              value={formData.person2_city}
              onChangeText={(v) => updateField('person2_city', v)}
              autoCapitalize="words"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State"
              placeholderTextColor="#64748b"
              value={formData.person2_state}
              onChangeText={(v) => updateField('person2_state', v)}
              autoCapitalize="characters"
              maxLength={2}
            />
          </View>
        </View>

        {/* Relationship Date */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={24} color="#10b981" />
            <Text style={styles.cardTitle}>Anniversary Date</Text>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD (e.g., 2023-06-15)"
            placeholderTextColor="#64748b"
            value={formData.relationship_start_date}
            onChangeText={(v) => updateField('relationship_start_date', v)}
            keyboardType="numbers-and-punctuation"
          />
        </View>

        {/* Register Button */}
        <TouchableOpacity 
          style={[styles.registerBtn, loading && styles.btnDisabled]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="checkmark-circle" size={24} color="#fff" />
          )}
          <Text style={styles.registerBtnText}>
            {loading ? 'Processing...' : 'Register for $0.99'}
          </Text>
        </TouchableOpacity>

        {/* Alternative Option */}
        <TouchableOpacity style={styles.webLink} onPress={openWebsite}>
          <Ionicons name="globe-outline" size={20} color="#10b981" />
          <Text style={styles.webLinkText}>Or register on our website</Text>
        </TouchableOpacity>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="shield-checkmark" size={20} color="#10b981" />
            <Text style={styles.featureText}>Secure payment via Stripe</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="search" size={20} color="#10b981" />
            <Text style={styles.featureText}>Searchable by anyone</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="infinite" size={20} color="#10b981" />
            <Text style={styles.featureText}>Lifetime registration</Text>
          </View>
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
    marginBottom: 16,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  priceBadge: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  priceSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: 14,
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  connector: {
    alignItems: 'center',
    marginVertical: 8,
  },
  registerBtn: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  webLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  webLinkText: {
    color: '#10b981',
    fontSize: 16,
  },
  features: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    color: '#94a3b8',
    fontSize: 14,
    marginLeft: 12,
  },
});
