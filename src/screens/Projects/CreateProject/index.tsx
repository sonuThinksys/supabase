import { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProjectsStackParamList } from '../../../navigation/types';
import Header from '../../../components/Header';
import { createProject } from '../../../services/todoService';
import { styles } from './CreateProject.styles';
import { CREATE_PROJECT_STRINGS } from './CreateProject.constants';

type Props = {
  navigation: NativeStackNavigationProp<ProjectsStackParamList>;
};

export default function CreateProjectScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = useCallback(async () => {
    if (!name.trim()) {
      Alert.alert(
        CREATE_PROJECT_STRINGS.ALERT_VALIDATION_TITLE,
        CREATE_PROJECT_STRINGS.ALERT_VALIDATION_EMPTY,
      );
      return;
    }
    setLoading(true);
    try {
      const result = await createProject(name.trim());
      if (!result) {
        Alert.alert(
          CREATE_PROJECT_STRINGS.ALERT_ERROR_TITLE,
          CREATE_PROJECT_STRINGS.ALERT_ERROR_MSG,
        );
        return;
      }
      navigation.goBack();
    } catch {
      Alert.alert(
        CREATE_PROJECT_STRINGS.ALERT_ERROR_TITLE,
        CREATE_PROJECT_STRINGS.ALERT_ERROR_MSG,
      );
    } finally {
      setLoading(false);
    }
  }, [name, navigation]);

  return (
    <>
      <Header title={CREATE_PROJECT_STRINGS.HEADER_TITLE} />
      <View style={styles.container}>
        <Text style={styles.label}>{CREATE_PROJECT_STRINGS.LABEL}</Text>
        <View style={styles.content}>
          <TextInput
            placeholder={CREATE_PROJECT_STRINGS.PLACEHOLDER}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreate}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              {loading
                ? CREATE_PROJECT_STRINGS.BUTTON_LOADING
                : CREATE_PROJECT_STRINGS.BUTTON_IDLE}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}