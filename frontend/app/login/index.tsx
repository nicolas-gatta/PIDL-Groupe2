import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { useRouter } from 'expo-router'
import Icon from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BACKEND_URL } from '../config'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/login/`, {
        username,
        password,
      })

      if (response.data?.token) {
        // Stocker le token dans AsyncStorage
        await AsyncStorage.setItem('auth_token', response.data.token)
        router.replace('/')
      } else {
        setError("Réponse inattendue du serveur")
      }
    } catch (err) {
      setError("Nom d'utilisateur ou mot de passe invalide")
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle} />
      <View style={styles.formBox}>
        <Icon name="log-in-outline" size={64} color="white" />

        <TextInput
          style={styles.input}
          placeholder="USERNAME"
          placeholderTextColor="#FFFFFFAA"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="PASSWORD"
          placeholderTextColor="#FFFFFFAA"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <Text style={styles.forgot}>🔓 Mot de passe oublié ?</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4973FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgCircle: {
    position: 'absolute',
    width: 700,
    height: 700,
    borderRadius: 350,
    backgroundColor: '#264ECA',
    top: -200,
    left: -250,
    opacity: 0.3,
  },
  formBox: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: 'transparent',
    padding: 24,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#ffffffaa',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    color: 'white',
    fontWeight: '500',
  },
  button: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
    elevation: 2,
  },
  buttonText: {
    color: '#2148C0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgot: {
    marginTop: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 14,
  },
  error: {
    color: '#ffdddd',
    fontSize: 13,
    marginBottom: 8,
  },
})
