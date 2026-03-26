import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  View,
} from 'react-native';
import Header from '../../../components/Header';
import { Tag, fetchTagsForTask } from '../../../services/todoService';
import { Colors } from '../../../theme/colors';
import { TAGS_LIST_STRINGS } from './TagsList.constants';
import { styles } from './TagsList.styles';

export default function TagsList() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTagsForTask();
      setTags(data);
    } catch {
      setError(TAGS_LIST_STRINGS.ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTags();
  }, [loadTags]);

  const keyExtractor = useCallback((item: Tag) => item.id, []);

  const renderTag: ListRenderItem<Tag> = useCallback(({ item }) => (
    <View style={styles.tagCard}>
      <Text style={styles.tagName}>{item.name}</Text>
    </View>
  ), []);

  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{TAGS_LIST_STRINGS.EMPTY}</Text>
      <Text style={styles.emptySubText}>{TAGS_LIST_STRINGS.EMPTY_SUB}</Text>
    </View>
  ), []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title={TAGS_LIST_STRINGS.TITLE} showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Header title={TAGS_LIST_STRINGS.TITLE} showBack />
        <Text style={styles.emptyText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={TAGS_LIST_STRINGS.TITLE} showBack />
      <FlatList
        data={tags}
        keyExtractor={keyExtractor}
        renderItem={renderTag}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
