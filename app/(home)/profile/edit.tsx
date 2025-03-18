import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable } from "react-native";

export default function EditProfileScreen() {
  const { user } = useUser();
  const { isLoaded } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [profileImage, setProfileImage] = useState(user?.imageUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Request permissions for accessing the image library
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to upload images."
        );
      }
    })();
  }, []);

  // Convert image URI to base64
  const convertImageToBase64 = async (uri: string) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists && fileInfo.size && fileInfo.size > 2 * 1024 * 1024) {
        Alert.alert("Error", "Image size must be less than 2MB.");
        return null;
      }

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error converting image to base64:", error);
      Alert.alert("Error", "Failed to process image. Please try again.");
      return null;
    }
  };

  // Handle image selection from the gallery
  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Ensure 1:1 aspect ratio
        quality: 0.7, // Compress image to reduce size
      });

      if (!result.canceled) {
        // Resize and compress the image
        const manipulatedImage = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 500, height: 500 } }], // Resize to 500x500 (1:1 aspect ratio)
          { compress: 0.7, format: SaveFormat.JPEG }
        );

        // Convert the image to base64
        const base64Image = await convertImageToBase64(manipulatedImage.uri);
        if (base64Image) {
          setProfileImage(base64Image);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  // Handle GIF selection from the document picker
  const handleGifPicker = async () => {
    try {
      setUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: "image/gif", // Allow only GIF files
      });

      if (result.canceled) {
        console.log("User cancelled file picker.");
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        throw new Error("No file selected.");
      }

      const file = result.assets[0];
      if (!file.uri) {
        throw new Error("No file URI found.");
      }

      // Convert the file to base64
      const base64Gif = await convertImageToBase64(file.uri);
      if (base64Gif) {
        setProfileImage(base64Gif);
      }
    } catch (error) {
      console.error("Error picking GIF:", error);
      Alert.alert("Error", "Failed to pick GIF. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!isLoaded || !user) {
      Alert.alert("Error", "User not loaded. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      // Update profile image if changed
      if (profileImage !== user.imageUrl) {
        await user.setProfileImage({ file: profileImage });
      }

      // Update first and last name
      await user.update({ firstName, lastName });

      Alert.alert("Success", "Profile updated successfully!");
      router.back(); // Navigate back to the previous screen
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        error.errors?.[0]?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#6a11cb", "#2575fc"]} // Purple to blue gradient
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Edit Profile</Text>

        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("@/assets/images/icon.png")
            }
            style={styles.profileImage}
          />
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed, // Add pressed state
            ]}
            onPress={handleImagePicker}
            disabled={uploading || isLoading}
          >
            <Text style={styles.buttonText}>Change Photo</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.outlineButton,
              pressed && styles.outlineButtonPressed, // Add pressed state
            ]}
            onPress={handleGifPicker}
            disabled={uploading || isLoading}
          >
            <Text style={[styles.buttonText, styles.outlineButtonText]}>
              Upload GIF
            </Text>
          </Pressable>
          {(uploading || isLoading) && <ActivityIndicator size="small" />}
        </View>

        {/* First Name Input */}
        <TextInput
          style={styles.input}
          value={firstName}
          placeholder="First Name"
          placeholderTextColor="#999"
          onChangeText={setFirstName}
          editable={!isLoading}
        />

        {/* Last Name Input */}
        <TextInput
          style={styles.input}
          value={lastName}
          placeholder="Last Name"
          placeholderTextColor="#999"
          onChangeText={setLastName}
          editable={!isLoading}
        />

        {/* Update Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed, // Add pressed state
          ]}
          onPress={handleUpdateProfile}
          disabled={isLoading || uploading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Updating..." : "Update Profile"}
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins_Bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    fontFamily: "Poppins_Medium",
    color: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#fff", // White background
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // For Android
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }], // Slightly shrink on press
    opacity: 0.9, // Slightly fade on press
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins_SemiBold",
    color: "#2575fc", // Blue text
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#fff", // White border
  },
  outlineButtonPressed: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Slight white overlay on press
  },
  outlineButtonText: {
    color: "#fff", // White text
  },
});
