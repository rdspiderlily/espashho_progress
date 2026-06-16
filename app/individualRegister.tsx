import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PhoneInput from "react-native-phone-number-input";
import { auth, db } from "../firebaseConfig";

const { width } = Dimensions.get("window");

export default function IndividualRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1); 
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const phoneInputRef = useRef<PhoneInput>(null);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobText, setDobText] = useState("Date of Birth");
  const [sex, setSex] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [loading, setLoading] = useState(false);

  const sexData = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        setDate(selectedDate);
        setDobText(selectedDate.toLocaleDateString());
      }
    } else {
      if (selectedDate) {
        setDate(selectedDate);
        setDobText(selectedDate.toLocaleDateString());
      }
    }
  };

  const validateUsername = (user: string) => {
    if (!user) {
      setUsernameError("");
      setIsUsernameValid(false);
      return false;
    }
    const usernameHasLetter = /[a-zA-Z]/.test(user);
    const usernameHasNumber = /[0-9]/.test(user);

    if (!usernameHasLetter || !usernameHasNumber) {
      setUsernameError("❌ Username must contain at least 1 letter and 1 number");
      setIsUsernameValid(false);
      return false;
    }
    if (user.length > 20) {
      setUsernameError("❌ Username must be 20 characters or less");
      setIsUsernameValid(false);
      return false;
    }
    setUsernameError("");
    setIsUsernameValid(true);
    return true;
  };

  const validatePassword = (pass: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (!pass) {
      setPasswordError("");
      setIsPasswordValid(false);
      return false;
    }
    if (pass.length < 8) {
      setPasswordError("❌ Password must be at least 8 characters");
      setIsPasswordValid(false);
      return false;
    }
    if (pass.length > 20) {
      setPasswordError("❌ Password must be no more than 20 characters");
      setIsPasswordValid(false);
      return false;
    }
    if (!passwordRegex.test(pass)) {
      setPasswordError("❌ Password must contain: 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)");
      setIsPasswordValid(false);
      return false;
    }
    setPasswordError("");
    setIsPasswordValid(true);
    return true;
  };

  const validateConfirmPassword = (confirm: string) => {
    if (!confirm) {
      setConfirmPasswordError("");
      return false;
    }
    if (confirm !== password) {
      setConfirmPasswordError("❌ Passwords do not match");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const validatePersonalDetails = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const phoneNumberTrimmed = phoneNumber.trim();
    const isValidPhone = phoneNumberTrimmed.length > 0 && phoneNumberTrimmed.replace(/\D/g, '').length >= 10;

    if (!trimmedFirstName && !trimmedLastName && dobText === "Date of Birth" && !sex && !isValidPhone) {
      Alert.alert(
        "Let's Complete Your Profile",
        "Please fill in your personal details below so we can set up your account."
      );
      return false;
    }

    const missingFields = [];
    if (!trimmedFirstName) missingFields.push("First Name");
    if (!trimmedLastName) missingFields.push("Last Name");
    if (dobText === "Date of Birth") missingFields.push("Date of Birth");
    if (!sex) missingFields.push("Sex at Birth");
    if (!isValidPhone) missingFields.push("Phone Number");

    if (missingFields.length > 0) {
      Alert.alert(
        "Almost There!",
        `Please provide the following remaining details to continue:\n\n• ${missingFields.join("\n• ")}`
      );
      return false;
    }
    return true;
  };

  const validateSignInDetails = () => {
    if (!username && !password && !confirmPassword) {
      Alert.alert(
        "Setup Account Details",
        "Please choose a username and password to complete your registration."
      );
      return false;
    }
    if (!isUsernameValid || !username) { 
      Alert.alert("Check Username", "Please make sure your username follows the requirements."); 
      return false; 
    }
    if (!isPasswordValid || !password) { 
      Alert.alert("Check Password", "Please make sure your password follows the security rules."); 
      return false; 
    }
    if (!confirmPassword || confirmPassword !== password) { 
      Alert.alert("Password Mismatch", "The passwords you entered do not match. Please verify them."); 
      return false; 
    }
    return true;
  };

  const handleConfirmDetails = () => {
    if (validatePersonalDetails()) {
      setStep(2);
      scrollViewRef.current?.scrollToPosition(0, 0, false);
    }
  };

  const handleCreateAccount = async () => {
    if (!validateSignInDetails()) return;
    setLoading(true);

    const sanitizedUsername = username.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const email = `${sanitizedUsername}@espashho.com`;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userData = {
        userId: userId,
        username: username.trim(),
        email: email,
        personalDetails: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          dateOfBirth: dobText,
          sex: sex,
          phoneNumber: phoneNumber,
        },
        createdAt: new Date().toISOString(),
        userType: "individual", 
        isActive: true,
      };

      await setDoc(doc(db, "users", userId), userData);
      await setDoc(doc(db, "usernames", username.trim().toLowerCase()), {
        userId: userId,
        username: username.trim(),
      });

      setStep(3);
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This username is already taken. Please choose a different username.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid username configuration template format.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const doPasswordsMatch = confirmPassword.length > 0 && confirmPassword === password && isPasswordValid;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: step === 1 ? "33.3%" : step === 2 ? "66.6%" : "100%" },
            ]}
          />
        </View>

        <KeyboardAwareScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
          enableOnAndroid={true}
          extraScrollHeight={40}
        >
          {step < 3 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
            >
              <Ionicons name="arrow-back" size={28} color="#042652" />
            </TouchableOpacity>
          )}

          {step === 1 && (
            <View style={styles.stepView}>
              <Text style={styles.title}>Personal Details</Text>
              <Text style={styles.subTitle}>
                Please enter your personal details below to continue
              </Text>

              <TextInput
                placeholder="First Name"
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                maxLength={50}
              />
              <TextInput
                placeholder="Last Name"
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                maxLength={50}
              />

              <View style={styles.inputWrapper}>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    style={{
                      flex: 1,
                      color: dobText === "Date of Birth" ? "rgba(9, 136, 238, 0.6)" : "#0988EE",
                      fontFamily: "Inter_400Regular",
                      fontSize: 16,
                    }}
                  >
                    {dobText}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#0988EE" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
              </View>

              <View style={styles.inputWrapper}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={sexData}
                  labelField="label"
                  valueField="value"
                  placeholder="Sex at Birth"
                  value={sex}
                  onChange={(item) => setSex(item.value)}
                  renderRightIcon={() => (
                    <Ionicons name="chevron-down" size={20} color="#0988EE" />
                  )}
                />
              </View>

              <View style={styles.inputWrapper}>
                <PhoneInput
                  ref={phoneInputRef}
                  defaultCode="PH"
                  placeholder="Phone Number"
                  placeholderTextColor="rgba(9, 136, 238, 0.6)"
                  onChangeFormattedText={(text) => {
                    setPhoneNumber(text);
                    setIsPhoneValid(true);
                  }}
                  containerStyle={styles.phoneInputContainer}
                  textContainerStyle={styles.phoneInputTextContainer}
                  textInputStyle={styles.phoneInputText}
                  flagButtonStyle={styles.phoneFlag}
                  codeTextStyle={styles.phoneCodeText}
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleConfirmDetails}>
                <Text style={styles.buttonText}>Confirm Details</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepView}>
              <Text style={styles.title}>Sign In Details</Text>
              <Text style={styles.subTitle}>
                Please enter your username and password below to continue
              </Text>

              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Username"
                    placeholderTextColor="rgba(9, 136, 238, 0.6)"
                    style={styles.flexInput}
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      validateUsername(text);
                    }}
                    autoCapitalize="none"
                    maxLength={20}
                  />
                  {username.length > 0 && (
                    <Ionicons 
                      name={isUsernameValid ? "checkmark-circle" : "close-circle"} 
                      size={22} 
                      color={isUsernameValid ? "#00C851" : "#FF4D4D"} 
                    />
                  )}
                </View>
                {usernameError ? (
                  <Text style={styles.errorText}>{usernameError}</Text>
                ) : isUsernameValid && username ? (
                  <Text style={styles.successText}>✓ Username is valid!</Text>
                ) : null}
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    placeholderTextColor="rgba(9, 136, 238, 0.6)"
                    style={styles.flexInput}
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      validatePassword(text);
                      if (confirmPassword) {
                        validateConfirmPassword(confirmPassword);
                      }
                    }}
                    maxLength={20}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.iconButton}
                  >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={22}
                      color="rgba(9, 136, 238, 0.6)"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : isPasswordValid && password ? (
                  <Text style={styles.successText}>✓ Password meets all requirements!</Text>
                ) : null}
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Confirm Password"
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="rgba(9, 136, 238, 0.6)"
                    style={styles.flexInput}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      validateConfirmPassword(text);
                    }}
                  />
                  <View style={styles.rightIconsContainer}>
                    <TouchableOpacity 
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.iconButton}
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                        size={22}
                        color="rgba(9, 136, 238, 0.6)"
                      />
                    </TouchableOpacity>
                    {confirmPassword.length > 0 && (
                      <Ionicons 
                        name={doPasswordsMatch ? "checkmark-circle" : "close-circle"} 
                        size={22} 
                        color={doPasswordsMatch ? "#00C851" : "#FF4D4D"} 
                      />
                    )}
                  </View>
                </View>
                {confirmPasswordError ? (
                  <Text style={styles.errorText}>{confirmPasswordError}</Text>
                ) : doPasswordsMatch ? (
                  <Text style={styles.successText}>✓ Passwords match!</Text>
                ) : confirmPassword.length > 0 ? (
                  <Text style={styles.errorText}>❌ Passwords do not match</Text>
                ) : null}
              </View>

              <TouchableOpacity 
                style={[styles.primaryButton, loading && styles.disabledButton]} 
                onPress={handleCreateAccount}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={[styles.stepView, { alignItems: "center", paddingTop: 40 }]}>
              <View style={styles.successIconWrapper}>
                <Ionicons name="checkmark-circle" size={100} color="#00C851" />
              </View>
              
              <Text style={styles.title}>Registration Successful!</Text>
              <Text style={styles.subTitle}>
                Welcome to Espashho! You can now sign in using your new credentials.
              </Text>

              <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/")}>
                <Text style={styles.buttonText}>Sign In Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 75, 
  },
  stepView: {
    marginTop: 20,
    width: "100%",
  },
  progressBarBackground: {
    width: "100%",
    height: 4,
    backgroundColor: "#E2E8F0",
    marginTop: 50,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0988EE",
  },
  backButton: {
    marginTop: 25,
    alignSelf: "flex-start",
    marginBottom: 20,
    padding: 5,
  },
  title: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 28,
    color: "#042652",
    textAlign: "center",
    marginBottom: 12,
  },
  subTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#4A5568",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 35,
    paddingHorizontal: 10,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  inputContainer: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
  },
  flexInput: {
    flex: 1,
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    height: "100%",
    paddingVertical: 0,
  },
  iconButton: {
    padding: 4,
  },
  rightIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdown: {
    height: 55,
    borderColor: "#0988EE",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "rgba(9, 136, 238, 0.6)",
    fontFamily: "Inter_400Regular",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
  },
  phoneInputContainer: {
    width: "100%",
    height: 55,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0988EE",
  },
  phoneInputTextContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 0,
  },
  phoneInputText: {
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    height: 55,
    padding: 0,
  },
  phoneFlag: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  phoneCodeText: {
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#0988EE",
    width: "100%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  successIconWrapper: {
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#FF4D4D",
    marginTop: 6,
    marginLeft: 5,
  },
  successText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#28a745",
    marginTop: 6,
    marginLeft: 5,
  },
});