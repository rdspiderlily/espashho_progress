import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import PhoneInput from "react-native-phone-number-input";

const { width } = Dimensions.get('window');

export default function StudentRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const phoneInput = useRef<PhoneInput>(null);

  // States for interactive fields
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobText, setDobText] = useState("Date of Birth");
  const [sex, setSex] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const sexData = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
      setDobText(selectedDate.toLocaleDateString());
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }]} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {step < 3 && (
          <TouchableOpacity style={styles.backButton} onPress={() => step > 1 ? setStep(step - 1) : router.back()}>
            <Ionicons name="arrow-back" size={30} color="#042652" />
          </TouchableOpacity>
        )}

        {/* STEP 1: PERSONAL DETAILS */}
        {step === 1 && (
          <View style={styles.stepView}>
            <Text style={styles.title}>Personal Details</Text>
            <Text style={styles.subTitle}>Please enter your personal details below to continue</Text>
            
            <TextInput placeholder="University Name" placeholderTextColor="rgba(9, 136, 238, 0.6)" style={styles.input} />
            <TextInput placeholder="Student ID Number" placeholderTextColor="rgba(9, 136, 238, 0.6)" style={styles.input} keyboardType="numeric" />
            <TextInput placeholder="First Name" placeholderTextColor="rgba(9, 136, 238, 0.6)" style={styles.input} />
            <TextInput placeholder="Last Name" placeholderTextColor="rgba(9, 136, 238, 0.6)" style={styles.input} />
            
            {/* Calendar Picker */}
            <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
              <Text style={{flex: 1, color: dobText === "Date of Birth" ? "rgba(9, 136, 238, 0.6)" : "#0988EE", fontFamily: 'Inter_400Regular'}}>
                {dobText}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#0988EE" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
            )}

            {/* Dropdown for Sex */}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={sexData}
              labelField="label"
              valueField="value"
              placeholder="Sex at Birth"
              value={sex}
              onChange={item => setSex(item.value)}
              renderRightIcon={() => (<Ionicons name="chevron-down" size={20} color="#0988EE" />)}
            />

            {/* Phone Input with Flag */}
            <PhoneInput
              ref={phoneInput}
              defaultValue={phoneNumber}
              defaultCode="PH"
              layout="first"
              onChangeFormattedText={(text) => setPhoneNumber(text)}
              containerStyle={styles.phoneContainer}
              textContainerStyle={styles.phoneTextContainer}
              codeTextStyle={{color: '#0988EE', fontFamily: 'Inter_400Regular'}}
              textInputStyle={{color: '#0988EE', fontFamily: 'Inter_400Regular', height: 45}}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(2)}>
              <Text style={styles.buttonText}>Confirm Details</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: SIGN IN DETAILS */}
        {step === 2 && (
          <View style={styles.stepView}>
            <Text style={styles.title}>Sign In Details</Text>
            <Text style={styles.subTitle}>Please enter your username and confirm password below to continue</Text>
            
            <TextInput placeholder="Username" placeholderTextColor="rgba(9, 136, 238, 0.6)" style={styles.input} />
            
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder="Password" 
                secureTextEntry={!passwordVisible} 
                placeholderTextColor="rgba(9, 136, 238, 0.6)" 
                style={{flex: 1, color: '#0988EE', fontFamily: 'Inter_400Regular'}} 
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="rgba(9, 136, 238, 0.6)" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput 
                placeholder="Confirm Password" 
                secureTextEntry={!confirmVisible} 
                placeholderTextColor="rgba(9, 136, 238, 0.6)" 
                style={{flex: 1, color: '#0988EE', fontFamily: 'Inter_400Regular'}} 
              />
              <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)}>
                <Ionicons name={confirmVisible ? "eye-outline" : "eye-off-outline"} size={20} color="rgba(9, 136, 238, 0.6)" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setStep(3)}>
              <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 3 && (
          <View style={[styles.stepView, { alignItems: 'center', marginTop: 50 }]}>
            <Text style={styles.title}>Registration Successful!</Text>
            <Text style={styles.subTitle}>Welcome to Espashho! You can now sign in using your new credentials.</Text>
            
            <View style={styles.successCard}>
              <Image source={require('../assets/images/spaceCustomer.png')} style={styles.successImage} resizeMode="contain" />
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace('/')}>
              <Text style={styles.buttonText}>Sign In Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- LAYOUT ---
  container: {
    flex: 1,
    backgroundColor: '#F0F7FF',
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  stepView: {
    marginTop: 20,
    width: '100%',
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    marginTop: 40,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0988EE',
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },

  // --- TEXT ---
  title: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 26,
    color: '#042652',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#042652',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },

  // --- INPUTS & FORMS ---
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#0988EE',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
    color: '#0988EE',
    fontFamily: 'Inter_400Regular',
  },
  inputContainer: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0988EE',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FFF',
  },
  dropdown: {
    height: 55,
    borderColor: '#0988EE',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    marginBottom: 15,
  },
  placeholderStyle: {
    fontSize: 15,
    color: "rgba(9, 136, 238, 0.6)",
    fontFamily: 'Inter_400Regular',
  },
  selectedTextStyle: {
    fontSize: 15,
    color: "#0988EE",
    fontFamily: 'Inter_400Regular',
  },

  // --- PHONE INPUT SPECIAL STYLING ---
  phoneContainer: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0988EE',
    marginBottom: 15,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  phoneTextContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 0,
  },

  // --- BUTTONS ---
  primaryButton: {
    backgroundColor: '#0988EE',
    width: '100%',
    height: 55,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },

  // --- SUCCESS STATE ---
  successCard: {
    width: width * 0.65,
    aspectRatio: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0988EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  successImage: {
    width: '80%',
    height: '80%',
  },
}); 