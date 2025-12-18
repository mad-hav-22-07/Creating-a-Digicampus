import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import { classAPI } from '../services/api';
import { COLORS } from '../constants/colors';

const ClassManagementScreen = ({ navigation }) => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [searchQuery, classes]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const res = await classAPI.getAllClasses();
      setClasses(res?.data || []);
    } catch {
      Alert.alert('Error', 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const filterClasses = () => {
    if (!searchQuery.trim()) {
      setFilteredClasses(classes);
      return;
    }

    const filtered = classes.filter((item) =>
      `${item.class_name} ${item.section_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredClasses(filtered);
  };

  const deleteClass = async (classId, className) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete ${className}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await classAPI.deleteClass(classId);
              Alert.alert('Success', 'Class deleted successfully');
              loadClasses();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete class');
            }
          },
        },
      ]
    );
  };

  const renderClass = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('ClassDetails', {
          classId: item.class_id,
          className: item.class_name,
          sectionName: item.section_name,
        })
      }
    >
      <View style={styles.cardContent}>
        <View style={styles.classIconContainer}>
          <MaterialCommunityIcons
            name="google-classroom"
            size={24}
            color={COLORS.primary}
          />
        </View>

        <View style={styles.classInfo}>
          <Text style={styles.className}>
            {item.class_name} - {item.section_name}
          </Text>
          <View style={styles.metaRow}>
            <MaterialCommunityIcons
              name="account-outline"
              size={14}
              color={COLORS.textLight}
            />
            <Text style={styles.metaText}>
              {item.student_count || 0} students
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('EditClassDetails', {
                classId: item.class_id,
                className: item.class_name,
                sectionName: item.section_name,
              });
            }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={(e) => {
              e.stopPropagation();
              navigation.navigate('SetMarksByClass', {
                classId: item.class_id,
                className: item.class_name,
                sectionName: item.section_name,
              });
            }}
          >
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={20}
              color="#10b981"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={(e) => {
              e.stopPropagation();
              deleteClass(
                item.class_id,
                `${item.class_name}-${item.section_name}`
              );
            }}
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={20}
              color="#ef4444"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name="school-outline"
        size={64}
        color="#e5e7eb"
      />
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No classes found' : 'No classes yet'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? 'Try a different search term'
          : 'Create your first class to get started'}
      </Text>
    </View>
  );

  const totalStudents = classes.reduce(
    (sum, c) => sum + parseInt(c.student_count || 0, 10),
    0
  );

  return (
    <View style={styles.container}>
      <Header
        title="Classes"
        showBack
        onBackPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Stats Bar */}
        {classes.length > 0 && (
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{classes.length}</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalStudents}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={COLORS.textLight}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search classes..."
            placeholderTextColor={COLORS.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateClass')}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Create Class</Text>
        </TouchableOpacity>

        {/* Classes List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredClasses}
            keyExtractor={(item) => item.class_id.toString()}
            renderItem={renderClass}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<EmptyState />}
          />
        )}
      </View>
    </View>
  );
};

export default ClassManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    marginLeft: 8,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 15,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  classIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});