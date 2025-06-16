// mobile/app/_layout.tsx

import { Stack } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, Alert, StyleSheet, Image, View  } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export default function RootLayout() {

    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />

            <Stack.Screen
                name="dashboard"
                options={{
                headerStyle: { backgroundColor: '#2c3e50' },
                headerTintColor: '#00a8ff',
                headerTitleAlign: 'center',
                headerTitle: () => (
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.title}>DeepCompare</Text>
                    </View>
                )
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3498db',
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
});