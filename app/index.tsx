import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../firebaseConfig";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const getFriendlyErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case "auth/invalid-credential":
        return "Invalid login. Please try again.";
      case "auth/too-many-requests":
        return "Too many failed attempts! Try again after a few minutes.";
      default:
        return "Error. Please check your connection.";
    }
  };

  const validateFields = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername && !trimmedPassword) {
      Alert.alert(
        "Invalid Credentials",
        "Please enter your username and password.",
      );
      return false;
    }
    if (!trimmedUsername) {
      Alert.alert("Missing Username", "Please enter your username.");
      return false;
    }
    if (!trimmedPassword) {
      Alert.alert("Missing Password", "Please enter your password.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    setLoading(true);

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    try {
      // Step 1: Find the user document by username
      const usernameDocRef = doc(
        db,
        "usernames",
        trimmedUsername.toLowerCase(),
      );
      const usernameDoc = await getDoc(usernameDocRef);

      if (!usernameDoc.exists()) {
        Alert.alert(
          "Login Failed",
          "Username not found. Please check your username.",
        );
        setLoading(false);
        return;
      }

      // Step 1.5: Check if the username is active (not marked as inactive from username change)
      const usernameData = usernameDoc.data();
      if (usernameData.isActive === false) {
        Alert.alert(
          "Login Failed",
          "This username has been changed. Please use your new username.",
        );
        setLoading(false);
        return;
      }

      // Step 2: Get the user ID from the username document
      const userId = usernameData.userId;

      // Step 3: Get the user's email from their user document
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        Alert.alert("Login Failed", "User data not found.");
        setLoading(false);
        return;
      }

      const userEmail = userDoc.data().email;

      // Step 4: Sign in with the retrieved email
      await signInWithEmailAndPassword(auth, userEmail, trimmedPassword);

      setLoading(false);
      router.replace("/spaceCustomerProfile");
    } catch (error: any) {
      setLoading(false);
      const message = getFriendlyErrorMessage(error.code);
      Alert.alert("Login Failed", message);
    }
  };

  const handleRegisterPress = () => {
    // Reset login fields
    setUsername("");
    setPassword("");
    // Navigate to registration
    router.push("/registerOption");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/espashhoLogo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.signInTitle}>Sign In</Text>
      <Text style={styles.subTitle}>Enter your details to continue</Text>

      {/* Username Input - Now used as Email */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          placeholderTextColor="rgba(9, 136, 238, 0.6)"
          style={[styles.input, { flex: 1 }]}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="rgba(9, 136, 238, 0.6)"
          secureTextEntry={!passwordVisible}
          style={[styles.input, { flex: 1 }]}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
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
        style={[styles.signInButton, loading && styles.disabledButton]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.signInBtnText}>Sign In</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footerRow}>
        <Text style={styles.footerBaseText}>Don’t have an account? </Text>
        <TouchableOpacity onPress={handleRegisterPress}>
          <Text style={styles.signUpLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
  },
  signInTitle: {
    fontFamily: "Montserrat_800ExtraBold",
    fontSize: 28,
    color: "#042652",
    marginBottom: 40,
  },
  subTitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#042652",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0988EE",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  input: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "#0988EE",
    height: "100%",
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#000000",
  },
  signInButton: {
    backgroundColor: "#0988EE",
    width: "100%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  signInBtnText: {
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    fontSize: 18,
  },
  footerRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  footerBaseText: {
    fontFamily: "Inter_400Regular",
    color: "#000000",
    fontSize: 14,
  },
  signUpLink: {
    fontFamily: "Inter_700Bold",
    color: "#042652",
    fontSize: 14,
  },
});
