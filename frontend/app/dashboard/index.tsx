// app/dashboard/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Platform, Picker, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Dashboard = () => {
    const navigation = useNavigation();

    // Données d'exemple pour les modèles IA
    const data = [
        {
            id: 1,
            modelName: 'GPT-4',
            size: 'Très grand',
            type: 'GPT-4',
            task: 'Génération de texte',
            accuracy: '92%',
            finalLoss: '0.02',
            numLayers: 48,
            numParameters: '175B',
            parameters: { learningRate: '0.001', epochs: 10, batchSize: 32 },
            flops: '1.5E+12',
            fps: '50 images/sec',
            co2Emissions: '0.5 kg',
            avgEnergyConsumption: '200 kWh',
            mAP50: '0.85',
            mAP095: '0.90',
            totalTrainingTime: '15 jours'
        },
        {
            id: 2,
            modelName: 'BERT',
            size: 'Moyen',
            type: 'BERT',
            task: 'Classification',
            accuracy: '89%',
            finalLoss: '0.05',
            numLayers: 24,
            numParameters: '110M',
            parameters: { learningRate: '0.0005', epochs: 5, batchSize: 64 },
            flops: '3.2E+11',
            fps: '40 images/sec',
            co2Emissions: '0.3 kg',
            avgEnergyConsumption: '150 kWh',
            mAP50: '0.80',
            mAP095: '0.85',
            totalTrainingTime: '7 jours'
        },
        {
            id: 3,
            modelName: 'Llama',
            size: 'Grand',
            type: 'Llama',
            task: 'Détection',
            accuracy: '91%',
            finalLoss: '0.03',
            numLayers: 32,
            numParameters: '100B',
            parameters: { learningRate: '0.0008', epochs: 8, batchSize: 64 },
            flops: '1.2E+12',
            fps: '60 images/sec',
            co2Emissions: '0.4 kg',
            avgEnergyConsumption: '180 kWh',
            mAP50: '0.82',
            mAP095: '0.88',
            totalTrainingTime: '10 jours'
        }
    ];

    // États pour les filtres
    const [selectedTask, setSelectedTask] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedEmissionRange, setSelectedEmissionRange] = useState('');
    const [selectedEnergyConsumptionRange, setSelectedEnergyConsumptionRange] = useState('');
    const [selectedTrainingTimeRange, setSelectedTrainingTimeRange] = useState('');

    // Fonction pour filtrer les données en fonction des critères sélectionnés
    const filteredData = data.filter(item => {
        return (
            (selectedTask ? item.task === selectedTask : true) &&
            (selectedType ? item.type === selectedType : true) &&
            (selectedEmissionRange ? item.co2Emissions === selectedEmissionRange : true) &&
            (selectedEnergyConsumptionRange ? item.avgEnergyConsumption === selectedEnergyConsumptionRange : true) &&
            (selectedTrainingTimeRange ? item.totalTrainingTime === selectedTrainingTimeRange : true)
        );
    });

    const userFirstName = 'John';
    const userLastName = 'Doe';
    const userEmail = 'john.doe@example.com';
    const profileImageUrl = 'https://www.photoprof.fr/images_dp/photographes/profil_vide.jpg';

    const handleLogout = () => {
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            {/* Sidebar (Menu) */}
            <View style={[styles.sidebar, Platform.OS === 'android' || Platform.OS === 'ios' ? styles.sidebarMobile : null]}>
                <Image
                    source={{ uri: profileImageUrl }}
                    style={styles.profileImage}
                />
                <Text style={styles.username}>{`${userFirstName} ${userLastName}`}</Text>
                <Text style={styles.email}>{userEmail}</Text>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>Déconnexion</Text>
                </TouchableOpacity>

                {/* Filtres */}
                <Text style={styles.filterLabel}>Filtrer par Tâche</Text>
                <Picker
                    selectedValue={selectedTask}
                    onValueChange={(itemValue) => setSelectedTask(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Tous" value="" />
                    <Picker.Item label="Génération de texte" value="Génération de texte" />
                    <Picker.Item label="Classification" value="Classification" />
                    <Picker.Item label="Détection" value="Détection" />
                </Picker>

                <Text style={styles.filterLabel}>Filtrer par Type de Modèle</Text>
                <Picker
                    selectedValue={selectedType}
                    onValueChange={(itemValue) => setSelectedType(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Tous" value="" />
                    <Picker.Item label="GPT-4" value="GPT-4" />
                    <Picker.Item label="BERT" value="BERT" />
                    <Picker.Item label="Llama" value="Llama" />
                </Picker>

                <Text style={styles.filterLabel}>Filtrer par Tranche d’Émission CO2</Text>
                <Picker
                    selectedValue={selectedEmissionRange}
                    onValueChange={(itemValue) => setSelectedEmissionRange(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Toutes" value="" />
                    <Picker.Item label="0-0.5 kg" value="0.5 kg" />
                    <Picker.Item label="0.5-1 kg" value="1 kg" />
                </Picker>

                <Text style={styles.filterLabel}>Filtrer par Tranche de Consommation Énergétique</Text>
                <Picker
                    selectedValue={selectedEnergyConsumptionRange}
                    onValueChange={(itemValue) => setSelectedEnergyConsumptionRange(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Toutes" value="" />
                    <Picker.Item label="0-100 kWh" value="100 kWh" />
                    <Picker.Item label="100-200 kWh" value="200 kWh" />
                </Picker>

                <Text style={styles.filterLabel}>Filtrer par Temps d’Entraînement</Text>
                <Picker
                    selectedValue={selectedTrainingTimeRange}
                    onValueChange={(itemValue) => setSelectedTrainingTimeRange(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Toutes" value="" />
                    <Picker.Item label="0-7 jours" value="7 jours" />
                    <Picker.Item label="7-14 jours" value="14 jours" />
                </Picker>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
                <Text style={styles.text}>Gestion des modèles IA</Text>

                <View style={styles.tableContainer}>
                    <ScrollView horizontal={true}>
                        <View style={styles.table}>
                            <View style={styles.tableRow}>
                                <Text style={styles.tableHeaderCell}>Nom du Modèle</Text>
                                <Text style={styles.tableHeaderCell}>Taille</Text>
                                <Text style={styles.tableHeaderCell}>Type</Text>
                                <Text style={styles.tableHeaderCell}>Tâche</Text>
                                <Text style={styles.tableHeaderCell}>Précision</Text>
                                <Text style={styles.tableHeaderCell}>Perte Finale</Text>
                                <Text style={styles.tableHeaderCell}>Nombre de Couches</Text>
                                <Text style={styles.tableHeaderCell}>Paramètres</Text>
                                <Text style={styles.tableHeaderCell}>Flops</Text>
                                <Text style={styles.tableHeaderCell}>FPS</Text>
                                <Text style={styles.tableHeaderCell}>Émission CO2</Text>
                                <Text style={styles.tableHeaderCell}>Consommation Énergie</Text>
                                <Text style={styles.tableHeaderCell}>Précision moyenne (mAP 0.5)</Text>
                                <Text style={styles.tableHeaderCell}>Précision moyenne (mAP 0.5 -> 0.95)</Text>
                                <Text style={styles.tableHeaderCell}>Temps Entraînement</Text>
                            </View>

                            <FlatList
                                data={filteredData}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{item.modelName}</Text>
                                        <Text style={styles.tableCell}>{item.size}</Text>
                                        <Text style={styles.tableCell}>{item.type}</Text>
                                        <Text style={styles.tableCell}>{item.task}</Text>
                                        <Text style={styles.tableCell}>{item.accuracy}</Text>
                                        <Text style={styles.tableCell}>{item.finalLoss}</Text>
                                        <Text style={styles.tableCell}>{item.numLayers}</Text>
                                        <Text style={styles.tableCell}>{item.numParameters}</Text>
                                        <Text style={styles.tableCell}>{item.flops}</Text>
                                        <Text style={styles.tableCell}>{item.fps}</Text>
                                        <Text style={styles.tableCell}>{item.co2Emissions}</Text>
                                        <Text style={styles.tableCell}>{item.avgEnergyConsumption}</Text>
                                        <Text style={styles.tableCell}>{item.mAP50}</Text>
                                        <Text style={styles.tableCell}>{item.mAP095}</Text>
                                        <Text style={styles.tableCell}>{item.totalTrainingTime}</Text>
                                    </TouchableOpacity>
                                )}
                                keyExtractor={(item) => item.id.toString()}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    sidebar: {
        width: Platform.OS === 'web' ? 250 : 0, // Affiche la sidebar uniquement sur PC (Web)
        padding: 20,
        backgroundColor: '#007BFF', // Changer la couleur de fond en bleu
        alignItems: 'center',
        display: Platform.OS === 'web' ? 'flex' : 'none', // Affiche seulement sur le Web
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    email: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 20,
    },
    filterLabel: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 10,
    },
    picker: {
        width: 200,
        height: 50,
        color: '#fff',
        backgroundColor: '#0056b3',
    },
    logoutButton: {
        backgroundColor: '#ff4444', // Rouge pour le bouton de déconnexion
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    mainContent: {
        flex: 1,
        padding: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    tableContainer: {
        marginTop: 20,
    },
    table: {
        width: '100%',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    tableHeaderCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#007BFF',
        color: '#fff',
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
});

export default Dashboard;
