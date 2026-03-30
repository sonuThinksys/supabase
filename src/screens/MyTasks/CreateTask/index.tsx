import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ListRenderItemInfo,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../../../navigation/types';
import { Project, Tag, fetchProjectsForTask, fetchTagsForTask, createFullTodo } from '../../../services/taskService';
import Header from '../../../components/Header';
import { styles } from './CreateTask.styles';
import { CREATE_TASK_STRINGS, PRIORITIES, Priority } from './CreateTask.constants';
import { useAppSelector } from '../../../store/hooks';

export interface SubtaskItem {
  id: string;
  title: string;
}

type Props = {
  navigation: NativeStackNavigationProp<DashboardStackParamList>;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ProjectChipProps {
  item: Project;
  selected: boolean;
  onSelect: (id: string) => void;
}

function ProjectChip({ item, selected, onSelect }: ProjectChipProps) {
  const onPress = useCallback(() => onSelect(item.id), [item.id, onSelect]);
  return (
    <TouchableOpacity style={[styles.chip, selected && styles.activeChip]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.activeChipText]}>{item.name}</Text>
    </TouchableOpacity>
  );
}

interface TagChipProps {
  item: Tag;
  selected: boolean;
  onToggle: (id: string) => void;
}

function TagChip({ item, selected, onToggle }: TagChipProps) {
  const onPress = useCallback(() => onToggle(item.id), [item.id, onToggle]);
  return (
    <TouchableOpacity style={[styles.chip, selected && styles.activeChip]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.activeChipText]}>{item.name}</Text>
    </TouchableOpacity>
  );
}

interface PriorityChipProps {
  value: Priority;
  selected: boolean;
  onSelect: (value: Priority) => void;
}

function PriorityChip({ value, selected, onSelect }: PriorityChipProps) {
  const onPress = useCallback(() => onSelect(value), [value, onSelect]);
  return (
    <TouchableOpacity style={[styles.chip, selected && styles.activeChip]} onPress={onPress}>
      <Text style={[styles.chipText, selected && styles.activeChipText]}>{value}</Text>
    </TouchableOpacity>
  );
}

function SubtaskRow({ item }: { item: SubtaskItem }) {
  return <Text style={styles.subtask}>• {item.title}</Text>;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreateTaskScreen({ navigation }: Props) {
  const role = useAppSelector(state => state.user.role);
  const userId = useAppSelector(state => state.user.userId);
  const isAdmin = role === 'admin';

  const [title, setTitle] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<SubtaskItem[]>([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    title: '',
    project: '',
    priority: '',
    tags: '',
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projectsData, tagsData] = await Promise.all([
          // Admin sees all projects; others see only their assigned ones
          fetchProjectsForTask(isAdmin, userId ?? ''),
          fetchTagsForTask(),
        ]);
        setProjects(projectsData);
        setTags(tagsData);
      } catch {
        Alert.alert(CREATE_TASK_STRINGS.ERROR_TITLE, 'Failed to load projects and tags.');
      }
    };
    loadData();
  }, [isAdmin, userId]);

  const onChangeTitle = useCallback((value: string) => {
    setTitle(value);
    if (value.trim()) setErrors(prev => ({ ...prev, title: '' }));
  }, []);

  const onSelectProject = useCallback((id: string) => {
    setSelectedProject(id);
    setErrors(prev => ({ ...prev, project: '' }));
  }, []);

  const onToggleTag = useCallback((id: string) => {
    setSelectedTags(prev => {
      const next = prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id];
      if (next.length > 0) setErrors(e => ({ ...e, tags: '' }));
      return next;
    });
  }, []);

  const onSelectPriority = useCallback((value: Priority) => {
    setPriority(value);
    setErrors(prev => ({ ...prev, priority: '' }));
  }, []);

  const onAddSubtask = useCallback(() => {
    const trimmed = subtaskInput.trim();
    if (!trimmed) return;
    setSubtasks(prev => [...prev, { id: Date.now().toString(), title: trimmed }]);
    setSubtaskInput('');
  }, [subtaskInput]);

  const handleCreate = useCallback(async () => {
    const newErrors = {
      title: !title.trim() ? CREATE_TASK_STRINGS.VALIDATION_TITLE : '',
      project: !selectedProject ? CREATE_TASK_STRINGS.VALIDATION_PROJECT : '',
      priority: !priority ? CREATE_TASK_STRINGS.VALIDATION_PRIORITY : '',
      tags: !selectedTags.length ? CREATE_TASK_STRINGS.VALIDATION_TAGS : '',
    };
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(e => e !== '');
    if (hasError) return;

    setLoading(true);
    try {
      await createFullTodo({
        title: title.trim(),
        projectId: selectedProject,
        subtasks: subtasks.map(s => s.title),
        tagIds: selectedTags,
        priority: priority as Priority,
      });
      navigation.goBack();
    } catch {
      Alert.alert(CREATE_TASK_STRINGS.ERROR_TITLE, CREATE_TASK_STRINGS.ERROR_CREATE_FAILED);
    } finally {
      setLoading(false);
    }
  }, [title, selectedProject, selectedTags, subtasks, priority, navigation]);

  const renderProjectItem = useCallback(
    ({ item }: ListRenderItemInfo<Project>) => (
      <ProjectChip item={item} selected={selectedProject === item.id} onSelect={onSelectProject} />
    ),
    [selectedProject, onSelectProject],
  );

  const renderTagItem = useCallback(
    ({ item }: ListRenderItemInfo<Tag>) => (
      <TagChip item={item} selected={selectedTags.includes(item.id)} onToggle={onToggleTag} />
    ),
    [selectedTags, onToggleTag],
  );

  const renderSubtaskItem = useCallback(
    ({ item }: ListRenderItemInfo<SubtaskItem>) => <SubtaskRow item={item} />,
    [],
  );

  return (
    <>
      <Header title={CREATE_TASK_STRINGS.HEADER_TITLE} showBack/>
      <View style={styles.container}>
        <View>
          {/* Title */}
          <TextInput
            placeholder={CREATE_TASK_STRINGS.PLACEHOLDER_TITLE}
            value={title}
            onChangeText={onChangeTitle}
            style={[styles.input, !!errors.title && styles.inputError]}
          />
          {!!errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          {/* Project */}
          <View style={styles.section}>
            <Text style={styles.label}>{CREATE_TASK_STRINGS.LABEL_PROJECT}</Text>
            <FlatList
              horizontal
              data={projects}
              keyExtractor={item => item.id}
              renderItem={renderProjectItem}
              showsHorizontalScrollIndicator={false}
            />
            {!!errors.project && <Text style={styles.errorText}>{errors.project}</Text>}
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.label}>{CREATE_TASK_STRINGS.LABEL_PRIORITY}</Text>
            <View style={[styles.priorityRow, !!errors.priority && styles.sectionError]}>
              {PRIORITIES.map(p => (
                <PriorityChip
                  key={p}
                  value={p}
                  selected={priority === p}
                  onSelect={onSelectPriority}
                />
              ))}
            </View>
            {!!errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
          </View>

          {/* Subtasks (optional) */}
          <Text style={styles.label}>{CREATE_TASK_STRINGS.LABEL_SUBTASKS}</Text>
          <View style={styles.row}>
            <TextInput
              placeholder={CREATE_TASK_STRINGS.PLACEHOLDER_SUBTASK}
              value={subtaskInput}
              onChangeText={setSubtaskInput}
              style={styles.subtaskInput}
            />
            <TouchableOpacity onPress={onAddSubtask} style={styles.addBtn}>
              <Text style={styles.addBtnText}>{CREATE_TASK_STRINGS.BTN_ADD}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={subtasks}
            keyExtractor={item => item.id}
            renderItem={renderSubtaskItem}
            scrollEnabled={false}
          />

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.label}>{CREATE_TASK_STRINGS.LABEL_TAGS}</Text>
            <FlatList
              horizontal
              data={tags}
              keyExtractor={item => item.id}
              renderItem={renderTagItem}
              showsHorizontalScrollIndicator={false}
            />
            {!!errors.tags && <Text style={styles.errorText}>{errors.tags}</Text>}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCreate}
          disabled={loading || projects.length === 0}
        >
          <Text style={styles.buttonText}>
            {loading ? CREATE_TASK_STRINGS.BTN_CREATING : CREATE_TASK_STRINGS.BTN_CREATE}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
