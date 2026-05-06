import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import PhoneInput from "react-native-phone-number-input";
import { auth, db } from "../firebaseConfig";

const { width } = Dimensions.get("window");

export default function StudentRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const phoneInput = useRef<PhoneInput>(null);
  const scrollViewRef = useRef<ScrollView>(null); // ADD THIS LINE

  // States for interactive fields
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobText, setDobText] = useState("Date of Birth");
  const [sex, setSex] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

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

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDate(selectedDate);
      setDobText(selectedDate.toLocaleDateString());
    }
  };

  // Validation Functions
  const validatePersonalDetails = () => {
    const trimmedUniv = universityName.trim();
    const trimmedStudentId = studentId.trim();
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (
      !trimmedUniv &&
      !trimmedStudentId &&
      !trimmedFirstName &&
      !trimmedLastName &&
      !sex &&
      dobText === "Date of Birth" &&
      !phoneNumber
    ) {
      Alert.alert("Incomplete Details", "Please fill in all personal details.");
      return false;
    }

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

    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert("Missing Phone Number", "Please enter a valid phone number.");
      return false;
    }

    return true;
  };

  const validateSignInDetails = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (!trimmedUsername && !trimmedPassword && !trimmedConfirm) {
      Alert.alert("Incomplete Details", "Please fill in all sign in details.");
      return false;
    }

    if (!trimmedUsername) {
      Alert.alert("Missing Username", "Please enter a Username.");
      return false;
    }

    // Username validation: at least 1 letter, 1 number, max 20 characters
    const usernameHasLetter = /[a-zA-Z]/.test(trimmedUsername);
    const usernameHasNumber = /[0-9]/.test(trimmedUsername);

    if (!usernameHasLetter || !usernameHasNumber) {
      Alert.alert(
        "Invalid Username",
        "Username must contain at least 1 letter and 1 number.",
      );
      return false;
    }

    if (trimmedUsername.length > 20) {
      Alert.alert(
        "Invalid Username",
        "Username must be 20 characters or less.",
      );
      return false;
    }

    if (!trimmedPassword) {
      Alert.alert("Missing Password", "Please enter a Password.");
      return false;
    }

    // Password validation: 8+ chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special character, max 20
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    if (!passwordRegex.test(trimmedPassword)) {
      Alert.alert(
        "Invalid Password",
        "Password must be 8-20 characters and contain:\n• At least 1 capital letter\n• At least 1 small letter\n• At least 1 number\n• At least 1 special character (@$!%*?&)",
      );
      return false;
    }

    if (!trimmedConfirm) {
      Alert.alert("Missing Confirmation", "Please confirm your Password.");
      return false;
    }

    if (trimmedPassword !== trimmedConfirm) {
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
        password.trim(),
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
          phoneNumber: phoneNumber,
        },
        createdAt: new Date().toISOString(),
        userType: "student", // or 'customer' based on your flow
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

            {/* Calendar Picker */}
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

            {/* Phone Input with Flag */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollTo({ y: 800, animated: true });
                }, 100);
              }}
            >
              <PhoneInput
                ref={phoneInput}
                defaultValue={phoneNumber}
                defaultCode="PH"
                layout="first"
                onChangeFormattedText={(text) => setPhoneNumber(text)}
                containerStyle={styles.phoneContainer}
                textContainerStyle={styles.phoneTextContainer}
                codeTextStyle={{
                  color: "#0988EE",
                  fontFamily: "Inter_400Regular",
                }}
                textInputStyle={{
                  color: "#0988EE",
                  fontFamily: "Inter_400Regular",
                  height: 45,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleConfirmDetails}
            >
              <Text style={styles.buttonText}>Confirm Details</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 2: SIGN IN DETAILS */}
        {step === 2 && (
          <View style={styles.stepView}>
            <Text style={styles.title}>Sign In Details</Text>
            <Text style={styles.subTitle}>
              Please enter your username and confirm password below to continue
            </Text>

            <TextInput
              placeholder="Username"
              placeholderTextColor="rgba(9, 136, 238, 0.6)"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              maxLength={20}
            />

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Password"
                secureTextEntry={!passwordVisible}
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                style={{
                  flex: 1,
                  color: "#0988EE",
                  fontFamily: "Inter_400Regular",
                }}
                value={password}
                onChangeText={setPassword}
                maxLength={20}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="rgba(9, 136, 238, 0.6)"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm Password"
                secureTextEntry={!confirmVisible}
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                style={{
                  flex: 1,
                  color: "#0988EE",
                  fontFamily: "Inter_400Regular",
                }}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setConfirmVisible(!confirmVisible)}
              >
                <Ionicons
                  name={confirmVisible ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="rgba(9, 136, 238, 0.6)"
                />
              </TouchableOpacity>
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

  // --- PHONE INPUT SPECIAL STYLING ---
  phoneContainer: {
    width: "100%",
    height: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0988EE",
    marginBottom: 15,
    backgroundColor: "#FFF",
    overflow: "hidden",
  },
  phoneTextContainer: {
    backgroundColor: "#FFF",
    paddingVertical: 0,
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
});
