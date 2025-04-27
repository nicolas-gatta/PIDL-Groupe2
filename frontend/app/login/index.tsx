// frontend/app/login/index.tsx

import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import axios from 'axios'
import { BACKEND_URL } from '../config'

export default function LoginPage() {
    const [username, setUsername] = useState('')  // on met l’email ici
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async () => {
        setError('')
        if (!username || !password) {
            setError('Merci de remplir tous les champs')
            return
        }

        try {
            const { data } = await axios.post(
                `${BACKEND_URL}/auth/login/`,
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            )
            if (data.token) {
                // Ici : connexion validée → affiche simplement un message de succès
                setError('Succès : connecté !')
            } else {
                setError('Réponse inattendue du serveur')
            }
        } catch {
            setError('Identifiants invalides')
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.bgCircle} />

            <View style={styles.formBox}>
                <TextInput
                    style={styles.input}
                    placeholder="EMAIL"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={username}
                    onChangeText={setUsername}
                />

                <TextInput
                    style={styles.input}
                    placeholder="MOT DE PASSE"
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {!!error && (
                    <Text style={error.startsWith('Succès') ? styles.success : styles.error}>
                        {error}
                    </Text>
                )}

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
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
        padding: 24,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        borderColor: 'rgba(255,255,255,0.6)',
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
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#2148C0',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: '#FFCCCC',
        marginBottom: 8,
    },
    success: {
        color: '#CCFFCC',
        marginBottom: 8,
    },
})