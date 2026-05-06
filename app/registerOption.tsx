import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RegisterOption() {
  const router = useRouter();

  const scaleValueCustomer = React.useRef(new Animated.Value(1)).current;
  const scaleValueBusiness = React.useRef(new Animated.Value(1)).current;

  const animateButton = (value: Animated.Value, toValue: number) => {
    Animated.spring(value, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#042652" />
      </TouchableOpacity>

      <Text style={styles.title}>Register</Text>

      <View style={styles.optionsContainer}>
        {/* Space Customer Option */}
        <Animated.View style={{ transform: [{ scale: scaleValueCustomer }] }}>
          <Pressable
            onPressIn={() => animateButton(scaleValueCustomer, 0.95)}
            onPressOut={() => animateButton(scaleValueCustomer, 1)}
            onPress={() => router.push('/spaceCustomerRole')}
            style={styles.card}
          >
            <Image 
              source={require('../assets/images/spaceCustomer.png')} 
              style={styles.cardImage} 
              resizeMode="contain" 
            />
            <Text style={styles.cardText}>Space Customer</Text>
          </Pressable>
        </Animated.View>

        {/* Business Owner Option */}
        <Animated.View style={{ transform: [{ scale: scaleValueBusiness }] }}>
          <Pressable
            onPressIn={() => animateButton(scaleValueBusiness, 0.95)}
            onPressOut={() => animateButton(scaleValueBusiness, 1)}
            onPress={() => alert("Business Owner Registration Coming Soon!")}
            style={styles.card}
          >
            <Image 
              source={require('../assets/images/businessOwner.png')} 
              style={styles.cardImage} 
              resizeMode="contain" 
            />
            <Text style={styles.cardText}>Business Owner</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Footer Link - No longer absolute, follows the flow */}
      <View style={styles.footer}>
        <Text style={styles.footerBaseText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text style={styles.loginLink}>Log In</Text>
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
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 60,
  },
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 28,
    color: '#042652',
    marginTop: 10,
    marginBottom: 40,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 25,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: width * 0.65,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0988EE',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: '80%',
    height: '80%',
    marginBottom: 0, // No space between image and text
  },
  cardText: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 20,
    color: '#042652',
    textAlign: 'center',
    marginTop: 0, // No space between image and text
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 10,
  },
  footerBaseText: {
    fontFamily: 'Inter_400Regular',
    color: '#000000',
    fontSize: 14,
  },
  loginLink: {
    fontFamily: 'Inter_400Regular',
    color: '#042652',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});