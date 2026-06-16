import { Ionicons } from "@expo/vector-icons";
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

export default function BusinessOwnerRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Steps: 1 (Permit), 2 (Business Info), 3 (Secure Account), 4 (Success)
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const phoneInputRef = useRef<PhoneInput>(null);

  // Step 1: Permit State
  const [permitPhoto, setPermitPhoto] = useState<string | null>(null);

  // Step 2: Business Info States
  const [businessName, setBusinessName] = useState("");
  const [permitNumber, setPermitNumber] = useState("");
  const [businessType, setBusinessType] = useState(null);
  const [businessEmail, setBusinessEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [minimumPurchase, setMinimumPurchase] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Step 3: Secure Account States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [personalEmail, setPersonalEmail] = useState(""); 
  const [otp, setOtp] = useState(["", "", "", ""]);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation UI Feedback States
  const [usernameError, setUsernameError] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [loading, setLoading] = useState(false);

  const businessTypeData = [
    { label: "Coworking Space", value: "coworking" },
    { label: "Study Lounge", value: "studylounge" },
    { label: "Cafe / Coffee Shop", value: "cafe" },
    { label: "Library Space", value: "library" },
  ];

  const handleOtpChange = (text: string, index: number) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text.slice(-1);
    setOtp(updatedOtp);
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

  const handlePermitUploadPress = () => {
    setPermitPhoto("mock-permit-uri-data-link");
  };

  const handleNextFromPermit = () => {
    if (!permitPhoto) {
      Alert.alert("Almost There!", "Please upload a clear photo of your Business Permit to continue.");
      return;
    }
    setStep(2);
    scrollViewRef.current?.scrollToPosition?.(0, 0, false);
  };

  const validateBusinessDetails = () => {
    const name = businessName.trim();
    const permit = permitNumber.trim();
    const email = businessEmail.trim();
    const contact = contactPerson.trim();
    const phone = phoneNumber.trim();
    const isValidPhone = phone.length > 0 && phone.replace(/\D/g, "").length >= 10;

    if (!name && !permit && !businessType && !email && !contact && !minimumPurchase && !isValidPhone) {
      Alert.alert("Let's Setup Your Business", "Please fill in your company information details below to proceed.");
      return false;
    }

    const missingFields = [];
    if (!name) missingFields.push("Business Name");
    if (!permit) missingFields.push("Permit Number");
    if (!businessType) missingFields.push("Business Type");
    if (!email) missingFields.push("Business Email");
    if (!contact) missingFields.push("Contact Person");
    if (!minimumPurchase) missingFields.push("Minimum Purchase");
    if (!isValidPhone) missingFields.push("Phone Number");

    if (missingFields.length > 0) {
      Alert.alert("Almost There!", `Please fill out the following remaining items:\n\n• ${missingFields.join("\n• ")}`);
      return false;
    }
    return true;
  };

  const validateSecureAccountDetails = () => {
    if (!username && !password && !confirmPassword && !personalEmail) {
      Alert.alert("Complete Credentials", "Please set up your login options and email token verification fields.");
      return false;
    }
    if (!isUsernameValid || !username) {
      Alert.alert("Check Username", "Please make sure your unique username matches system syntax layouts.");
      return false;
    }
    if (!isPasswordValid || !password) {
      Alert.alert("Check Password", "Please optimize password data parameters according to firewall requirements.");
      return false;
    }
    if (confirmPassword !== password) {
      Alert.alert("Password Error", "The validation credentials written inside verification containers do not match.");
      return false;
    }
    if (!personalEmail.trim() || !personalEmail.includes("@")) {
      Alert.alert("Verification Email Required", "Please enter a valid personal email destination address to authorize verification.");
      return false;
    }
    return true;
  };

  const handleConfirmDetails = () => {
    if (validateBusinessDetails()) {
      setStep(3);
      scrollViewRef.current?.scrollToPosition?.(0, 0, false);
    }
  };

  const handleCreateAccount = async () => {
    if (!validateSecureAccountDetails()) return;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, personalEmail.trim(), password);
      const userId = userCredential.user.uid;

      const businessData = {
        userId: userId,
        username: username.trim(),
        email: personalEmail.trim().toLowerCase(),
        createdAt: new Date().toISOString(),
        userType: "business_owner",
        isActive: true,
        businessDetails: {
          businessName: businessName.trim(),
          permitNumber: permitNumber.trim(),
          businessType: businessType,
          businessEmail: businessEmail.trim().toLowerCase(),
          contactPerson: contactPerson.trim(),
          minimumPurchase: minimumPurchase.trim(),
          phoneNumber: phoneNumber,
          permitPhotoUri: permitPhoto,
        },
      };

      await setDoc(doc(db, "users", userId), businessData);
      await setDoc(doc(db, "usernames", username.trim().toLowerCase()), {
        userId: userId,
        username: username.trim(),
      });

      setStep(4);
    } catch (error: any) {
      console.error("Owner register breakdown:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This registration email profile is already attached to an active workspace owner configuration.";
      }
      Alert.alert("Setup Blocked", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const doPasswordsMatch = confirmPassword.length > 0 && confirmPassword === password && isPasswordValid;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.container}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: step === 1 ? "25%" : step === 2 ? "50%" : step === 3 ? "75%" : "100%" },
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
          {step < 4 && (
            <TouchableOpacity style={styles.backButton} onPress={() => (step > 1 ? setStep(step - 1) : router.back())}>
              <Ionicons name="arrow-back" size={28} color="#042652" />
            </TouchableOpacity>
          )}

          {/* STEP 1: UPLOAD PERMIT */}
          {step === 1 && (
            <View style={styles.stepView}>
              <Text style={styles.title}>Upload your Business Permit</Text>
              <Text style={styles.subTitle}>Please upload a clear photo of your Business Permit to continue.</Text>

              <TouchableOpacity style={styles.uploadCardContainer} onPress={handlePermitUploadPress} activeOpacity={0.8}>
                {permitPhoto ? (
                  <View style={{ alignItems: "center" }}>
                    <Ionicons name="document-attach-outline" size={55} color="#0988EE" />
                    <Text style={styles.uploadCardTextSuccess}>Business Permit Attached!</Text>
                  </View>
                ) : (
                  <View style={{ alignItems: "center" }}>
                    <Ionicons name="cloud-upload-outline" size={55} color="#0988EE" />
                    <Text style={styles.uploadCardText}>Tap to browse or take photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryButton} onPress={handleNextFromPermit}>
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: BUSINESS INFORMATION */}
          {step === 2 && (
            <View style={styles.stepView}>
              <Text style={styles.title}>Business Information</Text>
              <Text style={styles.subTitle}>Please complete each field. If anything is blank, enter it manually.</Text>

              <TextInput
                placeholder="Business Name"
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                style={styles.input}
                value={businessName}
                onChangeText={setBusinessName}
              />
              
              {/* FIXED: Changed onChangeText to call setPermitNumber with a capital N */}
              <TextInput
                placeholder="Permit Number"
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                style={styles.input}
                value={permitNumber}
                onChangeText={setPermitNumber}
              />

              <View style={styles.inputWrapper}>
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={businessTypeData}
                  labelField="label"
                  valueField="value"
                  placeholder="Business Type"
                  value={businessType}
                  onChange={(item) => setBusinessType(item.value)}
                  renderRightIcon={() => <Ionicons name="chevron-down" size={20} color="#0988EE" />}
                />
              </View>

              <TextInput
                placeholder="Business Email"
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                value={businessEmail}
                onChangeText={setBusinessEmail}
              />
              <TextInput
                placeholder="Contact Person"
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                style={styles.input}
                value={contactPerson}
                onChangeText={setContactPerson}
              />
              <TextInput
                placeholder="Minimum Purchase"
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                keyboardType="numeric"
                style={styles.input}
                value={minimumPurchase}
                onChangeText={setMinimumPurchase}
              />

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

          {/* STEP 3: SECURE YOUR ACCOUNT WITH OTP */}
          {step === 3 && (
            <View style={styles.stepView}>
              <Text style={styles.title}>Secure Your Account</Text>
              <Text style={styles.subTitle}>Complete this verification to ensure your account is secure and protected.</Text>

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
                {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
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
                      if (confirmPassword) validateConfirmPassword(confirmPassword);
                    }}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconButton}>
                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={22} color="rgba(9, 136, 238, 0.6)" />
                  </TouchableOpacity>
                </View>
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
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
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.iconButton}>
                      <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={22} color="rgba(9, 136, 238, 0.6)" />
                    </TouchableOpacity>
                    {confirmPassword.length > 0 && (
                      <Ionicons name={doPasswordsMatch ? "checkmark-circle" : "close-circle"} size={22} color={doPasswordsMatch ? "#00C851" : "#FF4D4D"} />
                    )}
                  </View>
                </View>
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="rgba(9, 136, 238, 0.6)"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.flexInput}
                    value={personalEmail}
                    onChangeText={setPersonalEmail}
                  />
                  <TouchableOpacity activeOpacity={0.6}>
                    <Text style={styles.sendInlineLinkText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.otpSectionHeading}>OTP</Text>
              <View style={styles.otpRowContainer}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={`owner-otp-${idx}`}
                    style={styles.otpBoxField}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, idx)}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.resendCodeButtonWrapper}>
                <Text style={styles.resendCodeText}>Didn't receive code? Resend</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.primaryButton, loading && styles.disabledButton]} onPress={handleCreateAccount} disabled={loading}>
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 4 && (
            <View style={[styles.stepView, { alignItems: "center", paddingTop: 40 }]}>
              <View style={styles.successIconWrapper}>
                <Ionicons name="checkmark-circle" size={100} color="#00C851" />
              </View>
              <Text style={styles.title}>Registration Successful!</Text>
              <Text style={styles.subTitle}>Welcome to Espashho! You can now sign in using your new credentials.</Text>
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
  uploadCardContainer: {
    width: "100%",
    aspectRatio: 1.25,
    borderWidth: 2,
    borderColor: "#0988EE",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
    padding: 20,
  },
  uploadCardText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: "rgba(4, 38, 82, 0.6)",
    marginTop: 12,
    textAlign: "center",
  },
  uploadCardTextSuccess: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: "#00C851",
    marginTop: 12,
    textAlign: "center",
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
  sendInlineLinkText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "rgba(9, 136, 238, 0.6)",
    paddingLeft: 10,
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
  otpSectionHeading: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#042652",
    marginBottom: 10,
    marginTop: 5,
  },
  otpRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  otpBoxField: {
    width: width * 0.17,
    height: 55,
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#042652",
    backgroundColor: "#FFFFFF",
  },
  resendCodeButtonWrapper: {
    alignSelf: "center",
    marginBottom: 30,
    padding: 4,
  },
  resendCodeText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#718096",
  },
  primaryButton: {
    backgroundColor: "#0988EE",
    width: "100%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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