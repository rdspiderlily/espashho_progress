import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SpaceCustomerRole() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#042652" />
      </TouchableOpacity>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>Tell us who you are</Text>
        <Text style={styles.subTitle}>We'll help find the best spot for your needs.</Text>
      </View>

      <View style={styles.optionsContainer}>
        {/* Student Option */}
        <TouchableOpacity 
          style={styles.roleCard} 
          onPress={() => router.push('/studentRegister')}
        >
          <Text style={styles.roleTitle}>I am a Student</Text>
          <Text style={styles.roleDescription}>
            Find spaces that suit your study needs and university requirements.
          </Text>
        </TouchableOpacity>

        {/* Individual Option - Now navigates to individualRegister */}
        <TouchableOpacity 
          style={styles.roleCard} 
          onPress={() => router.push('/individualRegister')}
        >
          <Text style={styles.roleTitle}>I am an Individual</Text>
          <Text style={styles.roleDescription}>
            Find a quiet place to work, focus, or relax.
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    paddingHorizontal: 30,
  },
  backButton: {
    marginTop: 60,
    alignSelf: 'flex-start',
  },
  headerContainer: {
    marginTop: 80,
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 28,
    color: '#042652',
    textAlign: 'center',
  },
  subTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#042652',
    textAlign: 'center',
    marginTop: 10,
  },
  optionsContainer: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 25,
    borderWidth: 1,
    borderColor: '#0988EE',
    alignItems: 'center',
    // Shadow
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  roleTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    color: '#042652',
    marginBottom: 8,
  },
  roleDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#042652',
    textAlign: 'center',
    lineHeight: 20,
  },
});