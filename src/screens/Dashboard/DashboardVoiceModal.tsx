import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import Voice, { SpeechErrorEvent, SpeechResultsEvent } from '@react-native-voice/voice';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../theme/colors';
import { modalStyles as styles } from './Dashboard.styles';
import { DASHBOARD_STRINGS } from './Dashboard.constants';
import {
  processVoiceQuery,
  type StructuredData,
  type ProjectInfo,
  type SearchResultItem,
  type MemberProjectItem,
  type MemberTaskItem,
} from '../../services/voiceAssistantService';

// ─── Constants ────────────────────────────────────────────────────────────────

const SILENCE_TIMEOUT_MS = 2500;

// ─── Props ────────────────────────────────────────────────────────────────────

interface DashboardVoiceModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  isAdmin: boolean;
  autoStart?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TaskStatsResult({ payload }: { payload: StructuredData & { type: 'task_stats' } extends { payload: infer P } ? { payload: P } : never }) {
  return (
    <View style={styles.statsResultRow}>
      <View style={[styles.statsResultCard, { backgroundColor: Colors.primary }]}>
        <Text style={styles.statsResultValue}>{(payload as any).total}</Text>
        <Text style={styles.statsResultLabel}>{DASHBOARD_STRINGS.STAT_TOTAL}</Text>
      </View>
      <View style={[styles.statsResultCard, { backgroundColor: Colors.priorityHigh }]}>
        <Text style={styles.statsResultValue}>{(payload as any).todo}</Text>
        <Text style={styles.statsResultLabel}>{DASHBOARD_STRINGS.STAT_TODO}</Text>
      </View>
      <View style={[styles.statsResultCard, { backgroundColor: Colors.priorityMedium }]}>
        <Text style={styles.statsResultValue}>{(payload as any).pending}</Text>
        <Text style={styles.statsResultLabel}>{DASHBOARD_STRINGS.STAT_PENDING}</Text>
      </View>
      <View style={[styles.statsResultCard, { backgroundColor: Colors.priorityLow }]}>
        <Text style={styles.statsResultValue}>{(payload as any).completed}</Text>
        <Text style={styles.statsResultLabel}>{DASHBOARD_STRINGS.STAT_COMPLETED}</Text>
      </View>
    </View>
  );
}

function ProjectResultCard({ item }: { item: ProjectInfo }) {
  return (
    <View style={styles.resultCard}>
      <View style={styles.resultCardRow}>
        <Text style={styles.resultCardTitle}>{item.projectName}</Text>
        <View style={styles.resultBadge}>
          <Text style={styles.resultBadgeText}>{item.taskCount} tasks</Text>
        </View>
      </View>
      {item.members.map((m, i) => (
        <View key={`${m.email}-${i}`} style={styles.resultMemberRow}>
          <View style={styles.resultAvatar}>
            <Text style={styles.resultAvatarText}>{m.email.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.resultMemberEmail} numberOfLines={1}>{m.email}</Text>
          <View style={styles.resultRoleBadge}>
            <Text style={styles.resultRoleText}>{m.role}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function SearchResultCard({ item }: { item: SearchResultItem }) {
  const color =
    item.status === 'completed'
      ? Colors.priorityLow
      : item.status === 'pending'
      ? Colors.priorityMedium
      : Colors.priorityHigh;
  return (
    <View style={styles.resultCard}>
      <View style={styles.resultCardRow}>
        <View style={[styles.resultDot, { backgroundColor: color }]} />
        <Text style={styles.resultCardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.resultBadge, { backgroundColor: color }]}>
          <Text style={[styles.resultBadgeText, { color: Colors.card }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.resultSubText}>{item.projectName}</Text>
    </View>
  );
}

function MemberProjectCard({ item }: { item: MemberProjectItem }) {
  return (
    <View style={styles.resultCard}>
      <View style={styles.resultCardRow}>
        <Text style={styles.resultCardTitle}>{item.projectName}</Text>
        <View style={styles.resultRoleBadge}>
          <Text style={styles.resultRoleText}>{item.role}</Text>
        </View>
      </View>
      <Text style={styles.resultSubText}>{item.taskCount} tasks</Text>
    </View>
  );
}

function MemberTaskCard({ item }: { item: MemberTaskItem }) {
  const color =
    item.status === 'completed'
      ? Colors.priorityLow
      : item.status === 'pending'
      ? Colors.priorityMedium
      : Colors.priorityHigh;
  return (
    <View style={styles.resultCard}>
      <View style={styles.resultCardRow}>
        <View style={[styles.resultDot, { backgroundColor: color }]} />
        <Text style={styles.resultCardTitle} numberOfLines={1}>{item.title}</Text>
        <View style={[styles.resultBadge, { backgroundColor: color }]}>
          <Text style={[styles.resultBadgeText, { color: Colors.card }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.resultSubText}>{item.projectName}</Text>
    </View>
  );
}

// ─── Results Section ──────────────────────────────────────────────────────────

function VoiceResultsSection({ data }: { data: StructuredData }) {
  const renderProject = useCallback(
    ({ item }: ListRenderItemInfo<ProjectInfo>) => <ProjectResultCard item={item} />, [],
  );
  const renderSearch = useCallback(
    ({ item }: ListRenderItemInfo<SearchResultItem>) => <SearchResultCard item={item} />, [],
  );
  const renderMemberProject = useCallback(
    ({ item }: ListRenderItemInfo<MemberProjectItem>) => <MemberProjectCard item={item} />, [],
  );
  const renderMemberTask = useCallback(
    ({ item }: ListRenderItemInfo<MemberTaskItem>) => <MemberTaskCard item={item} />, [],
  );

  const projectKey = useCallback((item: ProjectInfo) => item.projectName, []);
  const searchKey = useCallback((item: SearchResultItem) => item.id, []);
  const memberProjectKey = useCallback((item: MemberProjectItem) => item.projectName, []);
  const memberTaskKey = useCallback((item: MemberTaskItem) => item.id, []);

  if (data.type === 'task_stats') {
    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsSectionTitle}>{DASHBOARD_STRINGS.VOICE_STATS_TITLE}</Text>
        <TaskStatsResult payload={data.payload as any} />
      </View>
    );
  }

  if (data.type === 'project_info') {
    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsSectionTitle}>{DASHBOARD_STRINGS.VOICE_PROJECTS_TITLE}</Text>
        <FlatList
          data={data.payload}
          keyExtractor={projectKey}
          renderItem={renderProject}
          scrollEnabled={false}
        />
      </View>
    );
  }

  if (data.type === 'search_results') {
    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsSectionTitle}>
          {DASHBOARD_STRINGS.VOICE_SEARCH_TITLE} ({data.payload.length})
        </Text>
        {data.payload.length === 0 ? (
          <Text style={styles.resultEmptyText}>{DASHBOARD_STRINGS.VOICE_NO_RESULTS}</Text>
        ) : (
          <FlatList
            data={data.payload}
            keyExtractor={searchKey}
            renderItem={renderSearch}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  }

  if (data.type === 'member_projects') {
    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsSectionTitle}>
          {DASHBOARD_STRINGS.VOICE_MEMBER_PROJECTS}: {data.payload.memberName}
        </Text>
        {data.payload.projects.length === 0 ? (
          <Text style={styles.resultEmptyText}>{DASHBOARD_STRINGS.VOICE_NO_RESULTS}</Text>
        ) : (
          <FlatList
            data={data.payload.projects}
            keyExtractor={memberProjectKey}
            renderItem={renderMemberProject}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  }

  if (data.type === 'member_tasks') {
    const { memberName, status, tasks } = data.payload;
    const label = status === 'all'
      ? DASHBOARD_STRINGS.VOICE_ALL_TASKS
      : `${status.charAt(0).toUpperCase() + status.slice(1)} tasks`;
    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsSectionTitle}>
          {label} — {memberName}
        </Text>
        {tasks.length === 0 ? (
          <Text style={styles.resultEmptyText}>{DASHBOARD_STRINGS.VOICE_NO_RESULTS}</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={memberTaskKey}
            renderItem={renderMemberTask}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  }

  if (data.type === 'tag_created') {
    return (
      <View style={styles.createdCard}>
        <Icon name="pricetag" size={20} color={Colors.priorityLow} />
        <View style={styles.createdCardText}>
          <Text style={styles.createdCardLabel}>{DASHBOARD_STRINGS.VOICE_TAG_CREATED}</Text>
          <Text style={styles.createdCardName}>{data.payload.name}</Text>
        </View>
        <Icon name="checkmark-circle" size={22} color={Colors.priorityLow} />
      </View>
    );
  }

  if (data.type === 'project_created') {
    return (
      <View style={styles.createdCard}>
        <Icon name="folder" size={20} color={Colors.primary} />
        <View style={styles.createdCardText}>
          <Text style={styles.createdCardLabel}>{DASHBOARD_STRINGS.VOICE_PROJECT_CREATED}</Text>
          <Text style={styles.createdCardName}>{data.payload.name}</Text>
        </View>
        <Icon name="checkmark-circle" size={22} color={Colors.primary} />
      </View>
    );
  }

  return null;
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function DashboardVoiceModal({
  visible,
  onClose,
  userId,
  isAdmin,
  autoStart = true,
}: DashboardVoiceModalProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [structuredData, setStructuredData] = useState<StructuredData | null>(null);

  const transcriptRef = useRef('');        // live partial (display fallback)
  const finalTranscriptRef = useRef('');   // accurate final from onSpeechResults
  const isProcessingRef = useRef(false);
  const isListeningRef = useRef(false);
  const aiResponseRef = useRef('');
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Pulse animation ──────────────────────────────────────────────────────

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const startPulse = useCallback(() => {
    pulseLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.35, duration: 650, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      ]),
    );
    pulseLoopRef.current.start();
  }, [pulseAnim]);

  const stopPulse = useCallback(() => {
    pulseLoopRef.current?.stop();
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  // ── Silence timer ────────────────────────────────────────────────────────

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const stopPulseRef = useRef(stopPulse);
  useEffect(() => { stopPulseRef.current = stopPulse; });
  const clearSilenceTimerRef = useRef(clearSilenceTimer);
  useEffect(() => { clearSilenceTimerRef.current = clearSilenceTimer; });

  // ── Reset ────────────────────────────────────────────────────────────────

  const onReset = useCallback(async () => {
    clearSilenceTimer();
    if (isListeningRef.current) {
      await Voice.stop().catch(() => {});
      isListeningRef.current = false;
      setIsListening(false);
      stopPulse();
    }
    setTranscript('');
    setAiResponse('');
    setStructuredData(null);
    transcriptRef.current = '';
    finalTranscriptRef.current = '';
    aiResponseRef.current = '';
  }, [clearSilenceTimer, stopPulse]);

  // ── Submit query ─────────────────────────────────────────────────────────

  const submitQuery = useCallback(async (query: string) => {
    if (!query.trim() || isProcessingRef.current) { return; }
    setAiResponse('');
    setStructuredData(null);
    aiResponseRef.current = '';
    isProcessingRef.current = true;
    setIsProcessing(true);
    try {
      const onToken = (delta: string) => {
        aiResponseRef.current += delta;
        setAiResponse(prev => prev + delta);
      };
      const onData = (data: StructuredData) => { setStructuredData(data); };
      await processVoiceQuery(query.trim(), userId, isAdmin, onToken, onData);
    } catch {
      setAiResponse(DASHBOARD_STRINGS.VOICE_ERROR);
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
    }
  }, [userId, isAdmin]);

  const submitQueryRef = useRef(submitQuery);
  useEffect(() => { submitQueryRef.current = submitQuery; });

  // ── Voice listeners (set up / tear down with modal visibility) ───────────

  useEffect(() => {
    if (!visible) {
      clearSilenceTimerRef.current();
      Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
      return;
    }

    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      // Partial results — show live for feedback only, do NOT submit from here
      const text = e.value?.[0] ?? '';
      transcriptRef.current = text;
      setTranscript(text);

      // Silence detected → just stop Voice; onSpeechEnd will submit the accurate final text
      clearSilenceTimerRef.current();
      silenceTimerRef.current = setTimeout(async () => {
        if (!isListeningRef.current) { return; }
        await Voice.stop().catch(() => {});
        // onSpeechEnd fires after stop and handles submission
      }, SILENCE_TIMEOUT_MS);
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      // Final accurate result — store separately so onSpeechEnd can prefer it
      const text = e.value?.[0] ?? '';
      finalTranscriptRef.current = text;
      setTranscript(text); // update display with accurate version
    };

    Voice.onSpeechEnd = () => {
      clearSilenceTimerRef.current();
      isListeningRef.current = false;
      setIsListening(false);
      stopPulseRef.current();
      // Prefer the accurate final result; fall back to partial if final hasn't arrived yet
      const textToSubmit = (finalTranscriptRef.current || transcriptRef.current).trim();
      finalTranscriptRef.current = '';
      transcriptRef.current = '';
      if (textToSubmit) {
        submitQueryRef.current(textToSubmit);
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      clearSilenceTimerRef.current();
      isListeningRef.current = false;
      setIsListening(false);
      stopPulseRef.current();
      console.warn('Voice error:', e.error?.message);
    };

    // Auto-start listening as soon as modal opens
    if (autoStart) {
      const timer = setTimeout(async () => {
        try {
          setTranscript('');
          transcriptRef.current = '';
          finalTranscriptRef.current = '';
          await Voice.start('en-US');
          isListeningRef.current = true;
          setIsListening(true);
          startPulse();
        } catch { /* voice unavailable */ }
      }, 300); // small delay so modal finishes animating
      return () => {
        clearTimeout(timer);
        clearSilenceTimerRef.current();
        Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
        };
    }

    return () => {
      clearSilenceTimerRef.current();
      Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
    };
  }, [visible, autoStart, startPulse]);

  // ── Mic toggle ───────────────────────────────────────────────────────────

  const onToggleMic = useCallback(async () => {
    if (isListeningRef.current) {
      clearSilenceTimer();
      await Voice.stop().catch(() => {});
      isListeningRef.current = false;
      setIsListening(false);
      stopPulse();
    } else {
      try {
        setTranscript('');
        transcriptRef.current = '';
        finalTranscriptRef.current = '';
        await Voice.start('en-US');
        isListeningRef.current = true;
        setIsListening(true);
        startPulse();
      } catch {
        /* voice unavailable */
      }
    }
  }, [clearSilenceTimer, stopPulse, startPulse]);

  // ── Close (also stops everything) ────────────────────────────────────────

  const handleClose = useCallback(async () => {
    clearSilenceTimer();
    if (isListeningRef.current) {
      await Voice.stop().catch(() => {});
      isListeningRef.current = false;
      setIsListening(false);
      stopPulse();
    }
    onClose();
  }, [clearSilenceTimer, stopPulse, onClose]);

  // ── Derived ──────────────────────────────────────────────────────────────

  const hasContent = !!(aiResponse || transcript || structuredData);
  const micHint = isListening
    ? DASHBOARD_STRINGS.VOICE_LISTENING
    : isProcessing
    ? DASHBOARD_STRINGS.VOICE_PROCESSING
    : DASHBOARD_STRINGS.VOICE_TAP_SPEAK;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      {/* Backdrop — tap to close */}
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={handleClose}
      >
        {/* Sheet — stop propagation so taps inside don't close modal */}
        <TouchableOpacity activeOpacity={1} style={styles.modalSheet} onPress={() => {}}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          {/* Header row */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{DASHBOARD_STRINGS.VOICE_TITLE}</Text>
            <View style={styles.modalHeaderActions}>
              {hasContent && (
                <TouchableOpacity style={styles.modalResetBtn} onPress={onReset}>
                  <Icon name="refresh" size={16} color={Colors.primary} />
                  <Text style={styles.modalResetBtnText}>
                    {DASHBOARD_STRINGS.VOICE_RESET}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={handleClose} style={styles.modalCloseBtn}>
                <Icon name="close" size={22} color={Colors.subText} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable content */}
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Transcript */}
            {transcript.length > 0 && (
              <View style={styles.transcriptCard}>
                <Text style={styles.transcriptLabel}>
                  {DASHBOARD_STRINGS.VOICE_YOU_SAID}
                </Text>
                <Text style={styles.transcriptText}>{transcript}</Text>
              </View>
            )}

            {/* AI Response */}
            {(isProcessing || aiResponse.length > 0) && (
              <View style={styles.aiResponseCard}>
                {isProcessing && !aiResponse ? (
                  <View style={styles.processingRow}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.processingText}>
                      {DASHBOARD_STRINGS.VOICE_PROCESSING}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.aiResponseText}>{aiResponse}</Text>
                )}
              </View>
            )}

            {/* Structured results */}
            {structuredData && <VoiceResultsSection data={structuredData} />}

            {/* Idle hint */}
            {!hasContent && !isListening && (
              <Text style={styles.idleHintText}>{DASHBOARD_STRINGS.VOICE_HINT}</Text>
            )}
          </ScrollView>

          {/* Mic area */}
          <View style={styles.micArea}>
            <Animated.View
              style={[
                styles.micRipple,
                isListening && styles.micRippleActive,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
            <TouchableOpacity
              style={[
                styles.micBtn,
                isListening && styles.micBtnActive,
                isProcessing && styles.micBtnDisabled,
              ]}
              onPress={onToggleMic}
              disabled={isProcessing}
            >
              <Icon
                name={isListening ? 'stop' : 'mic'}
                size={30}
                color={Colors.card}
              />
            </TouchableOpacity>
            <Text style={styles.micHint}>{micHint}</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
