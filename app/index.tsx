import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/espashhoLogo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.signInTitle}>Sign In</Text>
      <Text style={styles.subTitle}>Enter your details to continue</Text>

      {/* Username Input - Fixed with flex: 1 */}
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Username" 
          placeholderTextColor="rgba(9, 136, 238, 0.6)" 
          style={[styles.input, { flex: 1 }]} 
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Password" 
          placeholderTextColor="rgba(9, 136, 238, 0.6)" 
          secureTextEntry={!passwordVisible}
          style={[styles.input, { flex: 1 }]}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons 
            name={passwordVisible ? "eye-outline" : "eye-off-outline"} 
            size={24} 
            color="rgba(9, 136, 238, 0.6)" 
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotBtn}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.signInButton} 
        onPress={() => router.replace('/spaceCustomerProfile')}
      >
        <Text style={styles.signInBtnText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerBaseText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/registerOption')}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
  },
  signInTitle: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 28,
    color: '#042652',
    marginBottom: 40,
  },
  subTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#042652',
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0988EE',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 15,
    backgroundColor: '#fff', 
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#0988EE',
    height: '100%', // Para ma-click ang tibuok height sa box
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#000000',
  },
  signInButton: {
    backgroundColor: '#0988EE',
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInBtnText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    fontSize: 18,
  },
  footerRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  footerBaseText: {
    fontFamily: 'Inter_400Regular',
    color: '#000000',
    fontSize: 14,
  },
  signUpLink: {
    fontFamily: 'Inter_700Bold',
    color: '#042652',
    fontSize: 14,
  },
});