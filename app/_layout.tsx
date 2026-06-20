import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

// Font Imports
import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts
} from '@expo-google-fonts/inter';
import {
  Montserrat_800ExtraBold
} from '@expo-google-fonts/montserrat';

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const { width } = Dimensions.get('window');

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  // Load all required fonts for Espashho
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Montserrat_800ExtraBold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Initial 1-second delay for the very first native boot
        await new Promise(resolve => setTimeout(resolve, 1000)); 
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        // Hide the static native splash screen
        SplashScreen.hideAsync(); 
        
        // Show the Custom Splash (with slogans/text) for 4 more seconds
        // Total splash time: 5 seconds
        setTimeout(() => {
          setShowCustomSplash(false);
        }, 4000);
      }
    }
    prepare();
  }, []);

  // Ensure fonts are loaded before rendering anything
  if (!appIsReady || !fontsLoaded) return null;

  // Custom Splash Screen UI (The one with slogans and footer)
  if (showCustomSplash) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.centerContent}>
          <Image 
            source={require('../assets/images/espashhoLogo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.slogan}>Your quiet space for connection</Text>
        </View>
        
        <Text style={styles.footerText}>Developed by Aespasho</Text>
      </View>
    );
  }

  // Main Navigation Stack
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Login Screen */}
      <Stack.Screen name="index" /> 
      
      {/* Registration Options (Customer vs Business) */}
      <Stack.Screen name="registerOption" /> 
      
      {/* Specific Registration/Profile Screens */}
      <Stack.Screen name="spaceCustomerRole" />
      <Stack.Screen name="studentRegister" />
      <Stack.Screen name="spaceCustomerProfile" />
      
      {/* Data Privacy & Terms */}
      <Stack.Screen name="data-privacy" />
      <Stack.Screen name="terms-and-conditions" />
      
      {/* Business Owner Screens */}
      <Stack.Screen name="businessOwnerRegister" />
      <Stack.Screen name="businessHome" />        
      <Stack.Screen name="businessDiscover" />  
      
      {/* Other Screens */}
      <Stack.Screen name="forgotPassword" />
      <Stack.Screen name="individualRegister" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: 5,
  },
  slogan: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#042652',
    textAlign: 'center',
    marginTop: 5,
  },
  footerText: {
    position: 'absolute',
    bottom: 90,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#042652',
  },
});