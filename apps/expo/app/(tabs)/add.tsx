import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from "@/utils/api";

const PROMPTS = [
  "What just happened?",
  "What's the tea?",
  "Spill the beans...",
  "Something interesting?",
  "Who did what now?",
] as const;

export default function AddMoment() {
  const [text, setText] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const promptFade = React.useRef(new Animated.Value(0)).current;
  const inputFade = React.useRef(new Animated.Value(0)).current;
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: moments } = api.moments.getAll.useQuery();
  const utils = api.useContext();

  useEffect(() => {
    fadePromptIn().start();
  }, []);

  const fadePromptOut = () => {
    return Animated.timing(promptFade, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    });
  };

  const fadePromptIn = () => {
    return Animated.timing(promptFade, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    });
  };

  const fadeInputIn = () => {
    return Animated.timing(inputFade, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    });
  };

  const fadeInputOut = () => {
    return Animated.timing(inputFade, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    });
  };

  const handleStartWriting = () => {
    setIsWriting(true);
    Animated.parallel([
      fadePromptOut(),
      fadeInputIn(),
    ]).start();
  };

  const handleKeyboardDismiss = () => {
    Keyboard.dismiss();
    if (!text.trim()) {
      Animated.parallel([
        fadePromptIn(),
        fadeInputOut(),
      ]).start(() => {
        setIsWriting(false);
        fadePromptIn().start();
      });
    }
  };

  const addMoment = api.moments.add.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
      Keyboard.dismiss();
      setTimeout(() => {
        Animated.parallel([
          fadePromptIn(),
          fadeInputOut(),
        ]).start(() => {
          setShowSuccess(false);
          setText("");
          setIsWriting(false);
          fadePromptIn().start();
        });
      }, 1500);
      utils.moments.getAll.invalidate();
    },
  });

  const handleAddMoment = async () => {
    if (!text.trim()) return;
    await addMoment.mutateAsync(text);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.mainContent}
      >
        <TouchableWithoutFeedback onPress={handleKeyboardDismiss}>
          <View style={styles.content}>
            <Animated.View 
              style={[
                styles.promptSection, 
                { opacity: promptFade },
                isWriting && styles.hidden
              ]}
            >
              <Text style={styles.promptText}>
                {PROMPTS[Math.floor(Math.random() * PROMPTS.length)]}
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartWriting}
              >
                <Text style={styles.buttonText}>Add a moment</Text>
                <MaterialIcons name="add" size={20} color="#F5F5F5" />
              </TouchableOpacity>
            </Animated.View>

            <Animated.View 
              style={[
                styles.writeSection, 
                { 
                  opacity: inputFade,
                },
                !isWriting && styles.hidden
              ]}
            >
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                multiline
                autoFocus
                textAlign="center"
                textAlignVertical="center"
              />
              {text.trim().length > 0 && (
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { opacity: addMoment.isPending ? 0.7 : showSuccess ? 1 : 0.7 }
                  ]}
                  onPress={handleAddMoment}
                  disabled={addMoment.isPending || showSuccess}
                >
                  <View style={styles.buttonContent}>
                    {addMoment.isPending ? (
                      <ActivityIndicator color="#F5F5F5" />
                    ) : showSuccess ? (
                      <MaterialIcons name="check" size={24} color="#4CAF50" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Add moment</Text>
                        <MaterialIcons 
                          name="add-circle-outline" 
                          size={20} 
                          color="#F5F5F5" 
                          style={{marginLeft: 8}} 
                        />
                      </>
                    )}
                  </View>
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <View style={styles.momentsPreview}>
        <Text style={styles.previewTitle}>Today's Moments</Text>
        <View style={styles.orbContainer}>
          {moments?.map((moment, index) => (
            <LinearGradient
              key={moment.id}
              colors={['#1A1A1A', '#2C2C2E']}
              style={styles.orbWrapper}
            >
              <LinearGradient
                colors={['#4169E1', '#1E90FF']}
                style={styles.orb}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            </LinearGradient>
          ))}
          {(!moments || moments.length === 0) && (
            <Text style={styles.emptyText}>No moments yet today</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  mainContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  promptSection: {
    alignItems: 'center',
    marginTop: -100,
  },
  promptText: {
    fontSize: 24,
    color: '#F5F5F5',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  writeSection: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 24,
    color: '#FFFFFF',
    width: '100%',
    textAlign: 'center',
    padding: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  addButton: {
    backgroundColor: '#1E1E1E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonText: {
    color: '#F5F5F5',
    fontSize: 16,
    fontWeight: '600',
  },
  momentsPreview: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#121212',
  },
  previewTitle: {
    fontSize: 18,
    color: '#F5F5F5',
    marginBottom: 16,
    fontWeight: '600',
  },
  orbContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 60,
    alignItems: 'center',
  },
  orbWrapper: {
    padding: 2,
    borderRadius: 14,
  },
  orb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    shadowColor: '#4169E1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 24,
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
  hidden: {
    display: 'none',
  },
});