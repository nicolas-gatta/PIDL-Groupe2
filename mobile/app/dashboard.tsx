// mobile/components/DashboardPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { router } from 'expo-router';

const BACKEND = 'http://10.0.2.2:8000';

const DashboardPage = () => {
  const [models, setModels] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchModels = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const token = await SecureStore.getItemAsync('token');

    try {
      const response = await fetch(`${BACKEND}/models/get_simplify_data_models/?page=${page}&page_size=10`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const data = await response.json();
      const newModels = data.models?.results || [];
      setModels(prev => [...prev, ...newModels]);
      setHasMore(!!data.models?.next);
      setPage(p => p + 1);
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchModels();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    Alert.alert('Déconnexion', 'Vous avez été déconnecté.');
    router.replace('/');
  };

  const renderCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.modelName}>{item.name}</Text>
      <Text>Architecture: {item.architecture}</Text>
      <Text>Tâches: {item.tasks.map((t: any) => t.name).join(', ')}</Text>
      <Text>Format: {item.precision}</Text>
      <Text>Couches: {item.layers}</Text>
      <Text>Params (M): {item.parameters_m}</Text>
      <Text>FLOPs (B): {item.flops_b}</Text>
      <Text>Taille (Mo): {item.model_size}</Text>
      <Text>Créateur: {item.creator}</Text>
      <Text>Date de création: {item.creation_date}</Text>

    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      <FlatList
        data={models}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.cardList}
        onEndReached={fetchModels}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#0000ff" /> : null
        }
        ListEmptyComponent={
          !loading && (
            <Text style={styles.emptyText}>Aucun modèle trouvé.</Text>
          )
        }
      />
     <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
     </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  logoutButton: {
    backgroundColor: '#00a8ff',
    padding: 12,
    borderRadius: 6,
    margin: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardList: {
    padding: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  modelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  }
});

export default DashboardPage;
