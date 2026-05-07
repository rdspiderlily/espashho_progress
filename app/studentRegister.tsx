import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
// CHANGED: Using @sesamsolutions/phone-input instead of react-native-phone-number-input
import PhoneInput from "@sesamsolutions/phone-input";
import { auth, db } from "../firebaseConfig";

const { width } = Dimensions.get("window");

export default function StudentRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);

  // States for interactive fields
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobText, setDobText] = useState("Date of Birth");
  const [sex, setSex] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ADDED: Inline validation states for password fields
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  // ADDED: Inline validation states for username
  const [usernameError, setUsernameError] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  // Personal Details States
  const [universityName, setUniversityName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Sign In Details States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const sexData = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  // FIXED: Date picker - only updates when user presses OK
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

  // ADDED: Function to validate username inline (shows errors while typing)
  const validateUsername = (user: string) => {
    if (!user) {
      setUsernameError("");
      setIsUsernameValid(false);
      return false;
    }

    const usernameHasLetter = /[a-zA-Z]/.test(user);
    const usernameHasNumber = /[0-9]/.test(user);

    if (!usernameHasLetter || !usernameHasNumber) {
      setUsernameError(
        "❌ Username must contain at least 1 letter and 1 number",
      );
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

  // ADDED: Function to validate password inline (shows errors while typing)
  const validatePassword = (pass: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

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
      setPasswordError(
        "❌ Password must contain: 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)",
      );
      setIsPasswordValid(false);
      return false;
    }

    setPasswordError("");
    setIsPasswordValid(true);
    return true;
  };

  // ADDED: Function to validate confirm password inline
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

  // Validation Functions (UPDATED: No popup alerts for password)
  const validatePersonalDetails = () => {
    const trimmedUniv = universityName.trim();
    const trimmedStudentId = studentId.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedUniv) {
      Alert.alert("Missing School Name", "Please input your school name.");
      return false;
    }

    if (!trimmedStudentId) {
      Alert.alert("Missing Student ID", "Please enter your Student ID Number.");
      return false;
    }

    if (!trimmedFirstName) {
      Alert.alert("Missing First Name", "Please enter your First Name.");
      return false;
    }

    if (!trimmedLastName) {
      Alert.alert("Missing Last Name", "Please enter your Last Name.");
      return false;
    }

    if (dobText === "Date of Birth") {
      Alert.alert("Missing Date of Birth", "Please select your Date of Birth.");
      return false;
    }

    if (!sex) {
      Alert.alert("Missing Sex", "Please select your Sex at Birth.");
      return false;
    }

    if (!phoneNumber || !isPhoneValid) {
      Alert.alert("Missing Phone Number", "Please enter a valid phone number.");
      return false;
    }

    return true;
  };

  // UPDATED: Validate sign in details with inline errors (no popups)
  const validateSignInDetails = () => {
    // Use inline validation results instead of popups
    if (!isUsernameValid) {
      Alert.alert(
        "Invalid Username",
        "Please fix the username errors above before continuing.",
      );
      return false;
    }

    if (!username) {
      Alert.alert("Missing Username", "Please enter a username.");
      return false;
    }

    if (!isPasswordValid) {
      Alert.alert(
        "Invalid Password",
        "Please fix the password errors above before continuing.",
      );
      return false;
    }

    if (!password) {
      Alert.alert("Missing Password", "Please enter a password.");
      return false;
    }

    if (!confirmPassword) {
      Alert.alert("Missing Confirmation", "Please confirm your password.");
      return false;
    }

    if (confirmPassword !== password) {
      Alert.alert(
        "Password Mismatch",
        "The passwords you entered do not match.",
      );
      return false;
    }

    return true;
  };

  const handleConfirmDetails = () => {
    if (validatePersonalDetails()) {
      setStep(2);
    }
  };

  const handleCreateAccount = async () => {
    if (!validateSignInDetails()) return;

    setLoading(true);

    // Create a temporary email using username for Firebase auth
    const tempEmail = `${username.trim().toLowerCase()}@espashho.temp`;

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        tempEmail,
        password,
      );
      const userId = userCredential.user.uid;

      // Prepare user data for Firestore
      const userData = {
        userId: userId,
        username: username.trim(),
        email: tempEmail,
        personalDetails: {
          universityName: universityName.trim(),
          studentId: studentId.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          dateOfBirth: dobText,
          sex: sex,
          phoneNumber: phoneNumber, // Now stores clean +639XXXXXXXXX format
        },
        createdAt: new Date().toISOString(),
        userType: "student",
        isActive: true,
      };

      // Save user data to Firestore in 'users' collection
      await setDoc(doc(db, "users", userId), userData);

      // Also create a reference document with username for easy lookup
      await setDoc(doc(db, "usernames", username.trim().toLowerCase()), {
        userId: userId,
        username: username.trim(),
      });

      console.log("User registered and saved to Firestore:", userId);
      setStep(3);
    } catch (error: any) {
      let errorMessage = "Registration failed. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "This username is already taken. Please choose a different username.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please follow the password requirements.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid username format.";
          break;
        default:
          errorMessage =
            "Registration failed. Please check your connection and try again.";
      }

      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" },
            ]}
          />
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {step < 3 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
            >
              <Ionicons name="arrow-back" size={30} color="#042652" />
            </TouchableOpacity>
          )}

          {/* STEP 1: PERSONAL DETAILS */}
          {step === 1 && (
            <View style={styles.stepView}>
              <Text style={styles.title}>Personal Details</Text>
              <Text style={styles.subTitle}>
                Please enter your personal details below to continue
              </Text>

              <TextInput
                placeholder="University Name"
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                style={styles.input}
                value={universityName}
                onChangeText={setUniversityName}
                maxLength={50}
              />
              <TextInput
                placeholder="Student ID Number"
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                style={styles.input}
                keyboardType="numeric"
                value={studentId}
                onChangeText={setStudentId}
                maxLength={50}
              />
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

              {/* Calendar Picker - FIXED */}
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowDatePicker(true)}
              >
                <Text
                  style={{
                    flex: 1,
                    color:
                      dobText === "Date of Birth"
                        ? "rgba(9, 136, 238, 0.6)"
                        : "#0988EE",
                    fontFamily: "Inter_400Regular",
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
                onChange={(item) => setSex(item.value)}
                renderRightIcon={() => (
                  <Ionicons name="chevron-down" size={20} color="#0988EE" />
                )}
              />

              {/* Phone Input - UPDATED to use @sesamsolutions/phone-input */}
              <PhoneInput
                initialCountry="PH"
                onChange={(data) => {
                  if (data.isValid) {
                    setPhoneNumber(data.e164); // Returns +639XXXXXXXXX format
                    setIsPhoneValid(true);
                  } else {
                    setIsPhoneValid(false);
                  }
                }}
                style={styles.phoneInputContainer}
                textStyle={styles.phoneInputText}
                flagStyle={styles.phoneFlag}
              />

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleConfirmDetails}
              >
                <Text style={styles.buttonText}>Confirm Details</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: SIGN IN DETAILS - UPDATED with inline validation for username */}
          {step === 2 && (
            <View style={styles.stepView}>
              <Text style={styles.title}>Sign In Details</Text>
              <Text style={styles.subTitle}>
                Please enter your username and password below to continue
              </Text>

              {/* Username Field with inline validation */}
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
                {isUsernameValid && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="green"
                    style={{ marginLeft: 8 }}
                  />
                )}
              </View>

              {/* Show username error message inline */}
              {usernameError ? (
                <Text style={styles.errorText}>{usernameError}</Text>
              ) : isUsernameValid && username ? (
                <Text style={styles.successText}>✓ Username is valid!</Text>
              ) : null}

              {/* Password Field with inline validation */}
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
                    if (confirmPassword)
                      validateConfirmPassword(confirmPassword);
                  }}
                  maxLength={20}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="rgba(9, 136, 238, 0.6)"
                  />
                </TouchableOpacity>
              </View>

              {/* Show password error message inline */}
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : isPasswordValid && password ? (
                <Text style={styles.successText}>
                  ✓ Password meets all requirements!
                </Text>
              ) : null}

              {/* Confirm Password Field with inline validation */}
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
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="rgba(9, 136, 238, 0.6)"
                  />
                </TouchableOpacity>
                {confirmPassword &&
                  confirmPassword === password &&
                  isPasswordValid && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="green"
                      style={{ marginLeft: 8 }}
                    />
                  )}
              </View>

              {/* Show confirm password error message inline */}
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : confirmPassword &&
                confirmPassword === password &&
                password &&
                isPasswordValid ? (
                <Text style={styles.successText}>✓ Passwords match!</Text>
              ) : null}

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

          {/* STEP 3: SUCCESS */}
          {step === 3 && (
            <View
              style={[styles.stepView, { alignItems: "center", marginTop: 50 }]}
            >
              <Text style={styles.title}>Registration Successful!</Text>
              <Text style={styles.subTitle}>
                Welcome to Espashho! You can now sign in using your new
                credentials.
              </Text>

              <View style={styles.successCard}>
                <Image
                  source={require("../assets/images/spaceCustomer.png")}
                  style={styles.successImage}
                  resizeMode="contain"
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.replace("/")}
              >
                <Text style={styles.buttonText}>Sign In Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // --- LAYOUT ---
  container: {
    flex: 1,
    backgroundColor: "#F0F7FF",
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  stepView: {
    marginTop: 20,
    width: "100%",
  },
  progressBarBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#E0E0E0",
    marginTop: 40,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#0988EE",
  },
  backButton: {
    marginTop: 20,
    alignSelf: "flex-start",
  },

  // --- TEXT ---
  title: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 26,
    color: "#042652",
    textAlign: "center",
    marginBottom: 10,
  },
  subTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#042652",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },

  // --- INPUTS & FORMS ---
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
  },
  inputContainer: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  flexInput: {
    flex: 1,
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
  },
  dropdown: {
    height: 55,
    borderColor: "#0988EE",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    marginBottom: 15,
  },
  placeholderStyle: {
    fontSize: 15,
    color: "rgba(9, 136, 238, 0.6)",
    fontFamily: "Inter_400Regular",
  },
  selectedTextStyle: {
    fontSize: 15,
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
  },

  // --- PHONE INPUT STYLES (UPDATED for @sesamsolutions/phone-input) ---
  phoneInputContainer: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  phoneInputText: {
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlignVertical: "center",
    padding: 0,
    margin: 0,
  },
  phoneFlag: {
    width: 35,
    height: 35,
  },

  // --- BUTTONS ---
  primaryButton: {
    backgroundColor: "#0988EE",
    width: "100%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFF",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },

  // --- SUCCESS STATE ---
  successCard: {
    width: width * 0.65,
    aspectRatio: 1,
    backgroundColor: "#FFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0988EE",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  successImage: {
    width: "80%",
    height: "80%",
  },

  // --- INLINE FEEDBACK STYLES ---
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#FF4D4D",
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5,
  },
  successText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#28a745",
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5,
  },
});
