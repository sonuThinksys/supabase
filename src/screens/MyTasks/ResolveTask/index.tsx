import { useState, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { resolveTask } from '../../../services/taskService';
import { styles } from './ResolveTask.styles';
import {
  PRIORITY_COLOR,
  PRIORITY_LABEL,
  RESOLVE_TASK_STRINGS,
} from './ResolveTask.constants';

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

type Props = {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
  onResolved: (taskId: string) => void;
};

export default function ResolveTask({ task, visible, onClose, onResolved }: Props) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResolve = useCallback(async () => {
    if (!task) return;
    setLoading(true);
    try {
      await resolveTask(task.id, note);
      setNote('');
      onResolved(task.id);
    } catch {
      Alert.alert(
        RESOLVE_TASK_STRINGS.ALERT_ERROR_TITLE,
        RESOLVE_TASK_STRINGS.ALERT_ERROR_MSG,
      );
    } finally {
      setLoading(false);
    }
  }, [task,note, onResolved]);

  const handleClose = useCallback(() => {
    setNote('');
    onClose();
  }, [onClose]);

  if (!task) return null;

  const priorityColor = PRIORITY_COLOR[task.priority];
  const priorityLabel = PRIORITY_LABEL[task.priority];
  const formattedDate = new Date(task.created_at).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />

              <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>
                  {RESOLVE_TASK_STRINGS.TITLE}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.taskTitle}>{task.title}</Text>

              <View style={styles.metaRow}>
                <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
                  <Text style={styles.priorityText}>{priorityLabel}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>
                    {RESOLVE_TASK_STRINGS.STATUS_PENDING} · {formattedDate}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.label}>{RESOLVE_TASK_STRINGS.LABEL_NOTE}</Text>
              <TextInput
                style={styles.noteInput}
                placeholder={RESOLVE_TASK_STRINGS.NOTE_PLACEHOLDER}
                value={note}
                onChangeText={setNote}
                multiline
                maxLength={300}
              />

              <TouchableOpacity
                style={[styles.resolveButton, loading && styles.resolveButtonDisabled]}
                onPress={handleResolve}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.resolveButtonText}>
                    {RESOLVE_TASK_STRINGS.BUTTON_RESOLVE}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>
                  {RESOLVE_TASK_STRINGS.BUTTON_CANCEL}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}