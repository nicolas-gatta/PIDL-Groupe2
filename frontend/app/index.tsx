// app/index.tsx
import { useRouter } from 'expo-router';
import { View, Button, Text } from 'react-native';

export default function Index() {
    const router = useRouter();

    // Fonction de redirection vers login
    const goToLogin = () => {
        router.push('/login');
    };

    // Fonction de redirection vers dashboard
    const goToDashboard = () => {
        router.push('/dashboard');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Choisissez une page :</Text>

            <Button title="Aller au Login" onPress={goToLogin} />
            <Button title="Aller au Dashboard" onPress={goToDashboard} />
        </View>
    );
}
