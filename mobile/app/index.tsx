import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    Platform,
    Dimensions, 
} from 'react-native';
import { router } from 'expo-router';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Logo from '../assets/logo/DeepCompare.png'; 

import * as SecureStore from 'expo-secure-store';

export default function LoginPage() {
    const [showSignup, setShowSignup] = useState(false);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [signupError, setSignupError] = useState('');
    const [signupSuccess, setSignupSuccess] = useState('');

    const BACKEND = 'http://10.0.2.2:8000'; 

    const checkTokenAndRedirect = async () => {
        const token = await SecureStore.getItemAsync('token');
        if (!token) return;

        try {
            const res = await fetch(`${BACKEND}/auth/validate_token/`, {
                method: 'GET',
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            const responseText = await res.text();

            if (res.ok) {
                router.replace('/dashboard');
                let data = JSON.parse(responseText);
                Alert.alert('Re-Connexion réussie', `Bienvenue ${data.user.first_name} ${data.user.last_name} !`);
            } else {
                console.log('Token found but invalid, staying on login.');
            }
        } catch (e) {
            console.error('Token check failed', e);
        }
    };

    const handleLogin = async () => {
        setLoginError('');
        if (!username || !password) {
            setLoginError('Tous les champs doivent être remplis');
            return;
        }

        try {
            const res = await fetch(`${BACKEND}/auth/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const responseText = await res.text();

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (jsonParseError) {
                console.error(`[${Platform.OS}] handleLogin: ERREUR DE PARSING JSON: Le serveur n'a pas renvoyé un JSON valide ou le corps est vide.`, jsonParseError);
                if (res.ok) {
                    if (data.token) {
                        await SecureStore.setItemAsync('token', data.token);
                    }
                    Alert.alert('Connexion réussie', `Bienvenue ${data.user.first_name} ${data.user.last_name} !`);
                    router.replace('/dashboard');
                    return;
                } else {
                    setLoginError('Réponse inattendue du serveur (erreur non-JSON).');
                    return;
                }
            }

            if (res.ok) {
                if (data.token) {
                    await SecureStore.setItemAsync('token', data.token);
                }
                Alert.alert('Connexion réussie', `Bienvenue ${username} !`);
                router.replace('/dashboard');
            } else {
                setLoginError(data.error || 'échec de la connexion. Vérifiez vos identifiants.');
            }
        } catch (e) {
            console.error(`[${Platform.OS}] handleLogin: ERREUR RESEAU GLOBALE:`, e);
            setLoginError('Erreur réseau. Impossible de se connecter au serveur. Vérifiez la connexion et l\'adresse du backend.');
        }
    };

    const handleSignup = async () => {
        setSignupError('');
        setSignupSuccess('');
        if (!firstName || !lastName || !regEmail || !regPassword) {
            setSignupError('Tous les champs doivent être remplis');
            return;
        }
        try {
            const res = await fetch(`${BACKEND}/auth/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: regEmail,
                    password: regPassword,
                    first_name: firstName,
                    last_name: lastName
                })
            });

            const responseText = await res.text();

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (jsonParseError) {
                console.error(`[${Platform.OS}] handleSignup: ERREUR DE PARSING JSON INSCRIPTION: Le serveur n'a pas renvoyé un JSON valide ou le corps est vide.`, jsonParseError);
                if (res.ok) {
                    setSignupSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                    setFirstName('');
                    setLastName('');
                    setRegEmail('');
                    setRegPassword('');
                    setShowSignup(false);
                    return;
                } else {
                    setSignupError('Réponse inattendue du serveur lors de l\'inscription.');
                    return;
                }
            }

            if (res.ok) {
                setSignupSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
                setFirstName('');
                setLastName('');
                setRegEmail('');
                setRegPassword('');
                setShowSignup(false);
            } else {
                setSignupError(data.error || "échec de l'inscription. Veuillez réessayer.");
                console.log(`[${Platform.OS}] handleSignup: échec d'inscription. Message serveur:`, data.error || 'Aucun message d\'erreur du serveur.');
            }
        } catch (e) {
            console.error(`[${Platform.OS}] handleSignup: ERREUR RESEAU GLOBALE INSCRIPTION:`, e);
            setSignupError('Erreur réseau. Impossible de contacter le serveur.');
        }
    };

    useEffect(() => {
        checkTokenAndRedirect();
    }, []);

    return (

        <KeyboardAwareScrollView
            style={styles.fullScreenBackground} 
            contentContainerStyle={styles.scrollContentContainer} 
            keyboardShouldPersistTaps="handled" // G�re la fermeture du clavier au toucher en dehors
            showsVerticalScrollIndicator={false} // Cache la barre de d�filement verticale
            enableOnAndroid={true} // Assure que le composant fonctionne correctement sur Android
            extraScrollHeight={20} // D�calage suppl�mentaire pour �viter que le clavier ne cache le champ
        // Si vous avez une barre de statut transparente, vous pourriez avoir besoin de :
        // enableAutomaticScroll={true}
        // extraHeight={Platform.select({ ios: 0, android: StatusBar.currentHeight })}
        >
            <View style={styles.loginHeader}>
                {Logo && <Image source={Logo} style={styles.loginLogo} />}
                <Text style={styles.brandTitle}>DeepCompare</Text>
            </View>

            <View style={styles.loginBox}>
                {!showSignup ? (
                    <>
                        <Text style={styles.h2}>Se Connecter</Text>
                        {loginError ? <Text style={styles.errorMessage}>{loginError}</Text> : null}

                        <TextInput
                            style={styles.loginInput}
                            placeholder="Email"
                            placeholderTextColor="#a0bcd7"
                            value={username}
                            onChangeText={setUsername}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.loginInput}
                            placeholder="Mot de passe"
                            placeholderTextColor="#a0bcd7"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={() => {
                                handleLogin();
                            }}
                        >
                            <Text style={styles.loginButtonText}>Se connecter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setShowSignup(true);
                                setLoginError('');
                                setUsername('');
                                setPassword('');
                            }}
                            style={styles.switchButton}
                        >
                            <Text style={styles.switchButtonText}>Créer un compte</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.h2}>S'inscrire</Text>
                        {signupError ? <Text style={styles.errorMessage}>{signupError}</Text> : null}
                        {signupSuccess ? <Text style={styles.successMessage}>{signupSuccess}</Text> : null}

                        <TextInput
                            style={styles.loginInput}
                            placeholder="Prénom"
                            placeholderTextColor="#a0bcd7"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <TextInput
                            style={styles.loginInput}
                            placeholder="Nom"
                            placeholderTextColor="#a0bcd7"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <TextInput
                            style={styles.loginInput}
                            placeholder="Email"
                            placeholderTextColor="#a0bcd7"
                            value={regEmail}
                            onChangeText={setRegEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.loginInput}
                            placeholder="Mot de passe"
                            placeholderTextColor="#a0bcd7"
                            value={regPassword}
                            onChangeText={setRegPassword}
                            secureTextEntry
                        />

                        <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
                            <Text style={styles.loginButtonText}>S'inscrire</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                setShowSignup(false);
                                setSignupError('');
                                setSignupSuccess('');
                                setFirstName('');
                                setLastName('');
                                setRegEmail('');
                                setRegPassword('');
                            }}
                            style={styles.switchButton}
                        >
                            <Text style={styles.switchButtonText}>Déjà un compte ? Se connecter</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    fullScreenBackground: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
    scrollContentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    loginHeader: {
        marginBottom: 30,
        alignItems: 'center',
    },
    brandTitle: {
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: '#00a8ff',
    },
    loginLogo: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 15,
    },
    loginBox: {
        backgroundColor: 'rgba(44, 62, 80, 0.85)',
        borderWidth: 1,
        borderColor: 'rgba(0, 168, 255, 0.6)',
        borderRadius: 12,
        padding: 25,
        width: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
        elevation: 8,
    },
    h2: {
        marginBottom: 15,
        fontWeight: '600',
        textAlign: 'center',
        color: '#00a8ff',
        fontSize: 20,
    },
    loginInput: {
        width: '100%',
        padding: 10,
        marginBottom: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#ecf0f1',
        fontSize: 14,
    },
    loginButton: {
        width: '100%',
        padding: 10,
        marginTop: 8,
        borderRadius: 6,
        backgroundColor: '#00a8ff',
        alignItems: 'center',
    },
    loginButtonText: {
        color: '#2c3e50',
        fontWeight: 'bold',
        fontSize: 15,
    },
    errorMessage: {
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 12,
    },
    successMessage: {
        color: '#2ecc71',
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 12,
    },
    switchButton: {
        marginTop: 12,
        padding: 8,
        alignItems: 'center',
    },
    switchButtonText: {
        color: '#00a8ff',
        fontSize: 13,
        textDecorationLine: 'underline',
    },
});