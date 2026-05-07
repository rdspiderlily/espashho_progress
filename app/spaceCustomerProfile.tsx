import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import PhoneInput from "@sesamsolutions/phone-input";
import { useRouter } from "expo-router";
import {
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { db } from "../firebaseConfig";

const { width } = Dimensions.get("window");

export default function SpaceCustomerProfile() {
  const router = useRouter();
  const auth = getAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  // --- STATES ---
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dobText, setDobText] = useState("Date of Birth");
  const [sex, setSex] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Password visibility states for the three password fields
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password field values
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // ADDED: State for current password validation (green checkmark / red X)
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(null);

  // ADDED: State to show/hide new password fields
  const [showPasswordChangeFields, setShowPasswordChangeFields] =
    useState(false);

  // ADDED: State for inline text feedback messages
  const [currentPasswordFeedback, setCurrentPasswordFeedback] = useState("");

  // ADDED: State for debounce timeout
  const [checkTimeout, setCheckTimeout] = useState(null);

  // ADDED: States for new password inline validation
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);

  // ADDED: State for same password warning
  const [samePasswordWarning, setSamePasswordWarning] = useState("");

  // ADDED: Inline validation states for username
  const [usernameError, setUsernameError] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  // ADDED: Store original values for change detection
  const [originalValues, setOriginalValues] = useState({
    firstName: "",
    lastName: "",
    username: "",
    dobText: "",
    sex: null,
    phoneNumber: "",
  });

  // ADDED: State for "no changes" inline message
  const [noChangesMessage, setNoChangesMessage] = useState("");
  const [noChangesTimeout, setNoChangesTimeout] = useState(null);

  // Profile Data States
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  // Modal Visibility States
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [saveModalVisible, setSaveModalVisible] = useState(false);

  const sexData = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];

  // Get current logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchUserData(user.uid);
      } else {
        router.replace("/");
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const personalDetails = userData.personalDetails || {};

        // Prefill ALL fields
        const fetchedFirstName = personalDetails.firstName || "";
        const fetchedLastName = personalDetails.lastName || "";
        const fetchedUsername = userData.username || "";
        let fetchedDobText = "Date of Birth";
        const fetchedSex = personalDetails.sex || null;
        let fetchedPhoneNumber = personalDetails.phoneNumber || "";

        setFirstName(fetchedFirstName);
        setLastName(fetchedLastName);
        setUsername(fetchedUsername);

        // Validate the fetched username for display
        if (fetchedUsername) {
          const usernameHasLetter = /[a-zA-Z]/.test(fetchedUsername);
          const usernameHasNumber = /[0-9]/.test(fetchedUsername);
          if (
            usernameHasLetter &&
            usernameHasNumber &&
            fetchedUsername.length <= 20
          ) {
            setIsUsernameValid(true);
            setUsernameError("");
          } else {
            setIsUsernameValid(false);
            setUsernameError(
              "❌ Username must contain at least 1 letter and 1 number",
            );
          }
        }

        // Prefill date of birth
        if (
          personalDetails.dateOfBirth &&
          personalDetails.dateOfBirth !== "Date of Birth"
        ) {
          fetchedDobText = personalDetails.dateOfBirth;
          setDobText(fetchedDobText);
          const parsedDate = new Date(personalDetails.dateOfBirth);
          if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
          }
        }

        // Prefill sex
        if (personalDetails.sex) {
          setSex(personalDetails.sex);
        }

        // SIMPLIFIED: Prefill phone number - clean any corrupted format
        if (fetchedPhoneNumber) {
          // Extract only digits, then format as E.164
          const digits = fetchedPhoneNumber.match(/\d/g)?.join("");
          if (digits && digits.length >= 10) {
            // Take last 10-13 digits and add +63
            const lastDigits = digits.slice(-10);
            const cleanedPhone = `+63${lastDigits}`;
            setPhoneNumber(cleanedPhone);
            fetchedPhoneNumber = cleanedPhone;
            setIsPhoneValid(true);
          } else {
            setPhoneNumber(fetchedPhoneNumber);
          }
        }

        // Store original values for change detection
        setOriginalValues({
          firstName: fetchedFirstName,
          lastName: fetchedLastName,
          username: fetchedUsername,
          dobText: fetchedDobText,
          sex: fetchedSex,
          phoneNumber: fetchedPhoneNumber,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
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

  // ADDED: Function to check if any profile fields have changed
  const hasProfileChanges = () => {
    return (
      firstName.trim() !== originalValues.firstName ||
      lastName.trim() !== originalValues.lastName ||
      username.trim() !== originalValues.username ||
      dobText !== originalValues.dobText ||
      sex !== originalValues.sex ||
      phoneNumber !== originalValues.phoneNumber
    );
  };

  // ADDED: Function to check if password is being changed
  const isPasswordBeingChanged = () => {
    return currentPassword || newPassword || confirmNewPassword;
  };

  // Date picker onChange - only updates when user presses OK
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

  // MODIFIED: Function to validate new password inline (shows errors while typing)
  const validateNewPassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

    // Check if new password is the same as current password
    if (password && currentPassword && password === currentPassword) {
      setSamePasswordWarning(
        "⚠️ New password cannot be the same as your current password. Please choose a different password.",
      );
      setIsNewPasswordValid(false);
      setNewPasswordError("");
      return false;
    } else {
      setSamePasswordWarning("");
    }

    if (!password) {
      setNewPasswordError("");
      setIsNewPasswordValid(false);
      return false;
    }

    if (password.length < 8) {
      setNewPasswordError("❌ Password must be at least 8 characters");
      setIsNewPasswordValid(false);
      return false;
    }

    if (password.length > 20) {
      setNewPasswordError("❌ Password must be no more than 20 characters");
      setIsNewPasswordValid(false);
      return false;
    }

    if (!passwordRegex.test(password)) {
      setNewPasswordError(
        "❌ Password must contain: 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&)",
      );
      setIsNewPasswordValid(false);
      return false;
    }

    setNewPasswordError("");
    setIsNewPasswordValid(true);
    return true;
  };

  // ADDED: Function to validate confirm password inline
  const validateConfirmPassword = (confirm: string) => {
    if (!confirm) {
      setConfirmPasswordError("");
      return false;
    }

    if (confirm !== newPassword) {
      setConfirmPasswordError("❌ Passwords do not match");
      return false;
    }

    setConfirmPasswordError("");
    return true;
  };

  // MODIFIED: Function to check current password with debounce (checks while typing)
  const checkCurrentPassword = async (password: string) => {
    if (!password) {
      setIsCurrentPasswordValid(null);
      setCurrentPasswordFeedback("");
      setShowPasswordChangeFields(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setNewPasswordError("");
      setConfirmPasswordError("");
      setSamePasswordWarning("");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        setIsCurrentPasswordValid(true);
        setCurrentPasswordFeedback(
          "✓ Current password is correct. You can now set a new password below.",
        );
        setShowPasswordChangeFields(true);
      }
    } catch (error) {
      setIsCurrentPasswordValid(false);
      setCurrentPasswordFeedback(
        "✗ Current password is incorrect. Please try again.",
      );
      setShowPasswordChangeFields(false);
      setNewPassword("");
      setConfirmNewPassword("");
      setNewPasswordError("");
      setConfirmPasswordError("");
      setSamePasswordWarning("");
    }
  };

  // MODIFIED: Function to handle password update - uses inline validation results, NO alert on success
  const handlePasswordUpdate = async () => {
    const isChangingPassword =
      currentPassword || newPassword || confirmNewPassword;

    if (!isChangingPassword) {
      return true;
    }

    if (!currentPassword) {
      Alert.alert("Error", "Please enter your current password");
      return false;
    }

    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password");
      return false;
    }

    if (!confirmNewPassword) {
      Alert.alert("Error", "Please confirm your new password");
      return false;
    }

    if (isCurrentPasswordValid !== true) {
      Alert.alert(
        "Error",
        "Current password is incorrect. Please check and try again.",
      );
      return false;
    }

    // Check if new password is the same as current password
    if (currentPassword === newPassword) {
      Alert.alert(
        "Error",
        "New password must be different from your current password",
      );
      return false;
    }

    if (!isNewPasswordValid) {
      Alert.alert(
        "Error",
        "Please fix the new password errors above before saving.",
      );
      return false;
    }

    if (confirmNewPassword !== newPassword) {
      Alert.alert(
        "Error",
        "Please fix the confirm password error above before saving.",
      );
      return false;
    }

    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword,
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);

        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setIsCurrentPasswordValid(null);
        setCurrentPasswordFeedback("");
        setShowPasswordChangeFields(false);
        setNewPasswordError("");
        setConfirmPasswordError("");
        setIsNewPasswordValid(false);
        setSamePasswordWarning("");

        return true;
      }
      return false;
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        Alert.alert(
          "Error",
          "Current password is incorrect. Please try again.",
        );
      } else if (error.code === "auth/too-many-requests") {
        Alert.alert(
          "Error",
          "Too many failed attempts. Please try again later.",
        );
      } else {
        Alert.alert("Error", "Failed to update password. Please try again.");
      }
      return false;
    }
  };

  // ADDED: Function to show "no changes" message that disappears after 5 seconds
  const showNoChangesMessage = () => {
    setNoChangesMessage("ℹ️ No changes detected - nothing to save");

    if (noChangesTimeout) {
      clearTimeout(noChangesTimeout);
    }

    const timeout = setTimeout(() => {
      setNoChangesMessage("");
    }, 5000);
    setNoChangesTimeout(timeout);
  };

  // MODIFIED: Save profile changes to Firebase with change detection (UPDATED: marks old username as inactive instead of deleting)
  const handleSaveProfile = async () => {
    if (!userId) {
      Alert.alert("Error", "User not logged in");
      return;
    }

    // Validate username before saving
    if (username && !isUsernameValid) {
      Alert.alert(
        "Invalid Username",
        "Username must contain at least 1 letter and 1 number, and be 20 characters or less.",
      );
      return;
    }

    const profileChanged = hasProfileChanges();
    const passwordChanging = isPasswordBeingChanged();

    if (!profileChanged && !passwordChanging) {
      showNoChangesMessage();
      return;
    }

    // Validate phone number if it has changed
    if (phoneNumber && !isPhoneValid) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    setLoading(true);

    try {
      let passwordSuccess = true;
      if (passwordChanging) {
        passwordSuccess = await handlePasswordUpdate();
      }

      if (passwordSuccess === false) {
        setLoading(false);
        return;
      }

      if (profileChanged) {
        // Store the old username before updating
        const oldUsername = originalValues.username;
        const newUsername = username.trim();

        // Update user document
        const userDocRef = doc(db, "users", userId);
        const updatedData = {
          username: newUsername,
          personalDetails: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            dateOfBirth: dobText,
            sex: sex,
            phoneNumber: phoneNumber,
          },
          updatedAt: new Date().toISOString(),
        };
        await setDoc(userDocRef, updatedData, { merge: true });

        // Handle username change - mark old username as inactive instead of deleting
        if (oldUsername && oldUsername !== newUsername) {
          const oldUsernameDocRef = doc(
            db,
            "usernames",
            oldUsername.toLowerCase(),
          );
          await setDoc(oldUsernameDocRef, {
            userId: "INACTIVE",
            username: oldUsername,
            isActive: false,
          });
        }

        // Create/update the username document for the new username
        const usernameDocRef = doc(db, "usernames", newUsername.toLowerCase());
        await setDoc(
          usernameDocRef,
          { userId: userId, username: newUsername, isActive: true },
          { merge: true },
        );

        setOriginalValues({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          username: newUsername,
          dobText: dobText,
          sex: sex,
          phoneNumber: phoneNumber,
        });
      }

      setSaveModalVisible(true);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert(
        "Save Failed",
        "Could not save profile changes. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0988EE" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.headerTitle}>Edit Profile</Text>

          <View style={styles.form}>
            <TextInput
              placeholder="First Name"
              placeholderTextColor="rgba(9, 136, 238, 0.6)"
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="rgba(9, 136, 238, 0.6)"
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />

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

            {/* Phone Input with proper E.164 format */}
            <PhoneInput
              initialCountry="PH"
              value={phoneNumber}
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

            {/* MODIFIED: Current Password Field with debounced auto-check */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Current Password"
                secureTextEntry={!showCurrentPassword}
                placeholderTextColor="rgba(9, 136, 238, 0.6)"
                style={styles.flexInput}
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  setIsCurrentPasswordValid(null);
                  setCurrentPasswordFeedback("");
                  setShowPasswordChangeFields(false);
                  setNewPassword("");
                  setConfirmNewPassword("");
                  setNewPasswordError("");
                  setConfirmPasswordError("");
                  setSamePasswordWarning("");

                  if (checkTimeout) clearTimeout(checkTimeout);

                  const timeout = setTimeout(() => {
                    if (text) checkCurrentPassword(text);
                  }, 500);
                  setCheckTimeout(timeout);
                }}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons
                  name={showCurrentPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#0988EE"
                />
              </TouchableOpacity>
              {isCurrentPasswordValid === true && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="green"
                  style={{ marginLeft: 8 }}
                />
              )}
              {isCurrentPasswordValid === false && (
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="red"
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>

            {currentPasswordFeedback ? (
              <Text
                style={
                  isCurrentPasswordValid === true
                    ? styles.successText
                    : styles.errorText
                }
              >
                {currentPasswordFeedback}
              </Text>
            ) : null}

            {/* Conditionally show New Password fields */}
            {showPasswordChangeFields && (
              <>
                {/* New Password Field with inline validation */}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="New Password"
                    secureTextEntry={!showNewPassword}
                    placeholderTextColor="rgba(9, 136, 238, 0.6)"
                    style={styles.flexInput}
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                      validateNewPassword(text);
                      if (confirmNewPassword)
                        validateConfirmPassword(confirmNewPassword);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Ionicons
                      name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#0988EE"
                    />
                  </TouchableOpacity>
                  {isNewPasswordValid && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="green"
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </View>

                {/* Show same password warning message */}
                {samePasswordWarning ? (
                  <Text style={styles.warningText}>{samePasswordWarning}</Text>
                ) : null}

                {/* Show new password error message inline */}
                {newPasswordError ? (
                  <Text style={styles.errorText}>{newPasswordError}</Text>
                ) : isNewPasswordValid &&
                  newPassword &&
                  !samePasswordWarning ? (
                  <Text style={styles.successText}>
                    ✓ Password meets all requirements!
                  </Text>
                ) : null}

                {/* Confirm New Password Field with inline validation */}
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Confirm New Password"
                    secureTextEntry={!showConfirmPassword}
                    placeholderTextColor="rgba(9, 136, 238, 0.6)"
                    style={styles.flexInput}
                    value={confirmNewPassword}
                    onChangeText={(text) => {
                      setConfirmNewPassword(text);
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
                      color="#0988EE"
                    />
                  </TouchableOpacity>
                  {confirmNewPassword &&
                    confirmNewPassword === newPassword &&
                    isNewPasswordValid &&
                    !samePasswordWarning && (
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
                ) : confirmNewPassword &&
                  confirmNewPassword === newPassword &&
                  newPassword &&
                  !samePasswordWarning ? (
                  <Text style={styles.successText}>✓ Passwords match!</Text>
                ) : null}
              </>
            )}

            <Text style={styles.passwordHint}>
              Leave blank to keep current password
            </Text>

            {/* ADDED: No changes inline message */}
            {noChangesMessage ? (
              <Text style={styles.noChangesText}>{noChangesMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleSaveProfile}
            >
              <Text style={styles.confirmText}>Confirm Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => setLogoutModalVisible(true)}
            >
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={saveModalVisible}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons
                name="checkmark-circle-outline"
                size={60}
                color="#28a745"
              />
              <Text style={styles.modalTitle}>Profile Saved!</Text>
              <Text style={styles.modalSubTitle}>
                Your information has been successfully updated.
              </Text>
              <TouchableOpacity
                style={[styles.modalBtn, styles.saveConfirmBtn]}
                onPress={() => setSaveModalVisible(false)}
              >
                <Text style={styles.confirmBtnText}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={logoutModalVisible}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Ionicons name="help-circle-outline" size={60} color="#0988EE" />
              <Text style={styles.modalTitle}>Log Out?</Text>
              <Text style={styles.modalSubTitle}>
                Are you sure you want to logout? Any unsaved changes will be
                lost.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text style={styles.cancelBtnText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.logoutConfirmBtn]}
                  onPress={() => {
                    setLogoutModalVisible(false);
                    router.replace("/");
                  }}
                >
                  <Text style={styles.confirmBtnText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F7FF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 24,
    color: "#042652",
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },
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
    fontSize: 14,
    color: "rgba(9, 136, 238, 0.6)",
    fontFamily: "Inter_400Regular",
  },
  selectedTextStyle: {
    fontSize: 14,
    color: "#0988EE",
    fontFamily: "Inter_400Regular",
  },
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
    textAlign: "left",
    padding: 0,
    margin: 0,
    height: "100%",
  },
  phoneFlag: {
    width: 35,
    height: 35,
  },
  confirmButton: {
    backgroundColor: "#0988EE",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  confirmText: {
    color: "#FFF",
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  logoutBtn: {
    marginTop: 25,
    alignItems: "center",
  },
  logoutText: {
    fontFamily: "Inter_700Bold",
    color: "#FF4D4D",
    fontSize: 16,
  },
  passwordHint: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(9, 136, 238, 0.6)",
    marginBottom: 15,
    textAlign: "center",
  },
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
  warningText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#FF8C00",
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 5,
  },
  noChangesText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "#FF8C00",
    marginBottom: 15,
    textAlign: "center",
    backgroundColor: "#FFF3E0",
    padding: 10,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  modalTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 22,
    color: "#042652",
    marginTop: 10,
  },
  modalSubTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 15,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalBtn: {
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  saveConfirmBtn: {
    backgroundColor: "#0988EE",
    width: "100%",
  },
  logoutConfirmBtn: {
    backgroundColor: "#FF4D4D",
    flex: 0.45,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "#0988EE",
    flex: 0.45,
  },
  cancelBtnText: {
    color: "#0988EE",
    fontFamily: "Inter_700Bold",
  },
  confirmBtnText: {
    color: "#FFF",
    fontFamily: "Inter_700Bold",
  },
});
