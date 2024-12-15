import * as React from 'react'
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Dimensions
} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const navigateToSignIn = () => {
    router.replace('/sign-in')
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/ai-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)']}
          style={styles.overlay}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          <View style={styles.card}>
            <Text style={styles.headerText}>Chronicle the Journey</Text>
            <Text style={styles.subHeaderText}>
              {!pendingVerification
                ? 'Create Your Account'
                : 'Verify Your Email'}
            </Text>

            {!pendingVerification && (
              <>
                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  onChangeText={(email) => setEmailAddress(email)}
                />
                <TextInput
                  style={styles.input}
                  value={password}
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry={true}
                  onChangeText={(password) => setPassword(password)}
                />
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onSignUpPress}
                >
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={navigateToSignIn}
                >
                  <Text style={styles.secondaryButtonText}>
                    Already have an account? Sign In
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {pendingVerification && (
              <>
                <Text style={styles.verificationText}>
                  Check your email for the verification code
                </Text>
                <TextInput
                  style={styles.input}
                  value={code}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#888"
                  onChangeText={(code) => setCode(code)}
                  keyboardType="number-pad"
                />
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onPressVerify}
                >
                  <Text style={styles.buttonText}>Verify Email</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    opacity: 0.5
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  card: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5
  },
  headerText: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
    letterSpacing: -1
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#666'
  },
  input: {
    backgroundColor: 'rgba(240,240,240,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(200,200,200,0.5)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#333'
  },
  primaryButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(0,123,255,0.1)'
  },
  secondaryButtonText: {
    color: '#007bff',
    textAlign: 'center',
    fontWeight: '600'
  },
  verificationText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
    fontSize: 16
  }
})