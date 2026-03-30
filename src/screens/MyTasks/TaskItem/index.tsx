import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { toggleSubtaskStatus } from '../../../services/taskService';
import { styles } from './TaskItem.styles';
import { TASK_ITEM_STRINGS } from './TaskItem.constants';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Subtask {
  id: string;
  title: string;
  is_completed: boolean;
}

type Props = {
  item: any;
  isAdmin?: boolean;
  onDelete: (id: string) => void;
  onResolve: (item: any) => void;
  resolveRef?: React.MutableRefObject<(() => void) | null>;
  closeRef?: React.MutableRefObject<(() => void) | null>;
};

// ── SubtaskRow ────────────────────────────────────────────────────────────────

type SubtaskRowProps = {
  subtask: Subtask;
  onToggle: (id: string, current: boolean) => void;
};

function SubtaskRow({ subtask, onToggle }: SubtaskRowProps) {
  const handlePress = useCallback(() => {
    onToggle(subtask.id, subtask.is_completed);
  }, [onToggle, subtask.id, subtask.is_completed]);

  return (
    <TouchableOpacity style={styles.subtaskRow} onPress={handlePress} activeOpacity={0.7}>
      <View style={[styles.checkbox, subtask.is_completed && styles.checkboxCompleted]}>
        {subtask.is_completed && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
      <Text style={[styles.subtaskTitle, subtask.is_completed && styles.subtaskTitleCompleted]}>
        {subtask.title}
      </Text>
    </TouchableOpacity>
  );
}

// ── TaskItem ──────────────────────────────────────────────────────────────────

export default function TaskItem({ item, isAdmin = false, onDelete, onResolve, resolveRef, closeRef }: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const swipeableRef = useRef<Swipeable>(null);
  const heightAnim = useRef(new Animated.Value(0)).current;
  const measuredHeight = useRef(0);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const [subtasks, setSubtasks] = useState<Subtask[]>(item.subtasks ?? []);
  const completedCount = subtasks.filter(s => s.is_completed).length;

  // Keep subtasks in sync if parent re-renders with fresh data
  useEffect(() => {
    setSubtasks(item.subtasks ?? []);
  }, [item.subtasks]);

  const onContainerLayout = (e: LayoutChangeEvent) => {
    if (!isCollapsing) {
      measuredHeight.current = e.nativeEvent.layout.height;
    }
  };

  const runCollapseAnimation = (onDone?: () => void) => {
    heightAnim.setValue(measuredHeight.current);
    setIsCollapsing(true);
    requestAnimationFrame(() => {
      Animated.sequence([
        Animated.timing(translateX, {
          toValue: -500,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(onDone);
    });
  };

  const handleDelete = () => {
    runCollapseAnimation(() => onDelete(item.id));
  };

  const handleResolve = () => {
    onResolve(item);
  };

  const onToggleSubtask = useCallback((subtaskId: string, current: boolean) => {
    setSubtasks(prev =>
      prev.map(s => s.id === subtaskId ? { ...s, is_completed: !current } : s),
    );
    toggleSubtaskStatus(subtaskId, !current);
  }, []);

  useEffect(() => {
    if (resolveRef) { resolveRef.current = () => runCollapseAnimation(); }
    if (closeRef) { closeRef.current = () => swipeableRef.current?.close(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderRightActions = () => (
    <View style={styles.actionsRow}>
      <TouchableOpacity style={styles.deleteBox} onPress={handleDelete}>
        <Text style={styles.deleteText}>{TASK_ITEM_STRINGS.DELETE}</Text>
      </TouchableOpacity>
      {isAdmin && item.status === 'pending' && (
        <TouchableOpacity style={styles.resolveBox} onPress={handleResolve}>
          <Text style={styles.resolveText}>{TASK_ITEM_STRINGS.MARK_RESOLVED}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
  const ownerEmail: string | undefined = item.profiles?.email;

  const cardContent = (
    <Animated.View style={[styles.card, { transform: [{ translateX }] }]}>
      {/* ── Task title ── */}
      <Text style={styles.title}>{item.title}</Text>
      {isAdmin && ownerEmail ? (
        <View style={styles.ownerRow}>
          <Text style={styles.ownerLabel}>{TASK_ITEM_STRINGS.CREATED_BY}</Text>
          <Text style={styles.ownerEmail}>{ownerEmail}</Text>
        </View>
      ) : null}

      {/* ── Subtask list ── */}
      {subtasks.length > 0 && (
        <View style={styles.subtasksContainer}>
          <View style={styles.subtasksDivider} />
          {subtasks.map(subtask => (
            <SubtaskRow
              key={subtask.id}
              subtask={subtask}
              onToggle={onToggleSubtask}
            />
          ))}
          {/* Progress indicator */}
          <View style={styles.progressRow}>
            <Text style={styles.progressCount}>{completedCount}/{subtasks.length} </Text>
            <Text style={styles.progressText}>{TASK_ITEM_STRINGS.SUBTASKS_DONE}</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );

  if (isCollapsing) {
    return (
      <Animated.View style={{ height: heightAnim, overflow: 'hidden' }}>
        {cardContent}
      </Animated.View>
    );
  }

  return (
    <View style={styles.cardContainer} onLayout={onContainerLayout}>
      <Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
        {cardContent}
      </Swipeable>
    </View>
  );
}
