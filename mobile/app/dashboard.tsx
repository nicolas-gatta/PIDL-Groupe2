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
  Alert,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';

const BACKEND = 'http://10.0.2.2:8000';

const DashboardPage = () => {
  const [models, setModels] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    
    const token = await SecureStore.getItemAsync('token');
    try {
      const response = await fetch(`${BACKEND}/models/get_simplify_data_models/?page=1&page_size=10`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();
      const newModels = data.models?.results || [];
      setModels(newModels);
      setHasMore(!!data.models?.next);
      if (!!data.models?.next){
        setPage(2);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles', error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchModels = useCallback(async () => {

    if (loading || !hasMore) return;

    setLoading(true);
    const token = await SecureStore.getItemAsync('token');
    let data;
    try {
      const response = await fetch(`${BACKEND}/models/get_simplify_data_models/?page=${page}&page_size=10`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      data = await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des modèles', error);
    } finally {
      const newModels = data.models?.results || [];
      setModels(prev => [...prev, ...newModels]);
      setHasMore(!!data.models?.next);
      setPage(p => p + 1);
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
      <View style={styles.underline} />

      <View style={styles.infoContainer}>
        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Format:</Text>
          <Text>{item.precision}</Text>

          <Text style={styles.infoLabel}>Params (M):</Text>
          <Text>{item.parameters_m}</Text>

          <Text style={styles.infoLabel}>Taille (Mo):</Text>
          <Text>{item.model_size}</Text>
        </View>

        <View style={styles.infoColumn}>
          <Text style={styles.infoLabel}>Couches:</Text>
          <Text>{item.layers}</Text>

          <Text style={styles.infoLabel}>FLOPs (B):</Text>
          <Text>{item.flops_b}</Text>

          <Text style={styles.infoLabel}>Architecture:</Text>
          <Text>{item.architecture}</Text>
        </View>
      </View>

      <View style={styles.taskContainer}>
        {item.tasks.map((t: any, index: number) => (
          <View key={index} style={[styles.taskBadge, { backgroundColor: t.color }]}>
            <Text style={styles.taskText}>{t.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>👤 {item.creator}</Text>
        <Text style={styles.footerText}>📅 {item.creation_date}</Text>
      </View>
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
        refreshing={refreshing} 
        onRefresh={onRefresh}   
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
    underline: {
    height: 2,
    backgroundColor: '#ccc',
    marginVertical: 8,
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
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontWeight: '600',
    marginTop: 8,
  },
  taskContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  taskBadge: {
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  taskText: {
    fontSize: 12,
    color: '#ffffff',
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    color: '#555',
  },
});

export default DashboardPage;
