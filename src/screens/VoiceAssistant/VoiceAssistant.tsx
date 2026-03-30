import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ListRenderItemInfo,
} from 'react-native';
import Voice, { SpeechErrorEvent, SpeechResultsEvent } from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DashboardStackParamList } from '../../navigation/types';
import Header from '../../components/Header';
import { styles } from './VoiceAssistant.styles';
import { VOICE_STRINGS } from './VoiceAssistant.constants';
import {
  processVoiceQuery,
  type StructuredData,
  type ProjectInfo,
  type SearchResultItem,
  type MemberProjectItem,
  type MemberTaskItem,
} from '../../services/voiceAssistantService';
import { useAppSelector } from '../../store/hooks';
import { Colors } from '../../theme/colors';

// ─── Silence timeout (ms) before auto-submitting ──────────────────────────────
const SILENCE_TIMEOUT_MS = 2500;

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  navigation: NativeStackNavigationProp<DashboardStackParamList>;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ExampleChipProps {
  item: string;
  onPress: (question: string) => void;
}

function ExampleChip({ item, onPress }: ExampleChipProps) {
  const handlePress = useCallback(() => onPress(item), [item, onPress]);
  return (
    <TouchableOpacity style={styles.exampleChip} onPress={handlePress}>
      <Text style={styles.exampleChipText}>{item}</Text>
    </TouchableOpacity>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  bgColor: string;
}

function StatCard({ label, value, bgColor }: StatCardProps) {
  return (
    <View style={[styles.statCard, { backgroundColor: bgColor }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────

interface ProjectCardProps {
  item: ProjectInfo;
}

function ProjectCard({ item }: ProjectCardProps) {
  return (
    <View style={styles.projectCard}>
      <View style={styles.projectCardHeader}>
        <Text style={styles.projectCardName}>{item.projectName}</Text>
        <View style={styles.projectTaskBadge}>
          <Text style={styles.projectTaskBadgeText}>
            {item.taskCount} {VOICE_STRINGS.LABEL_TASKS}
          </Text>
        </View>
      </View>
      {item.members.map((member, idx) => (
        <View key={`${member.email}-${idx}`} style={styles.memberRow}>
          <View style={styles.memberLeft}>
            <View style={styles.memberAvatarCircle}>
              <Text style={styles.memberAvatarText}>
                {member.email.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.memberEmail} numberOfLines={1}>
              {member.email}
            </Text>
          </View>
          <View style={styles.memberRoleBadge}>
            <Text style={styles.memberRoleText}>{member.role}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Member Project Card ───────────────────────────────────────────────────────

interface MemberProjectCardProps {
  item: MemberProjectItem;
}

function MemberProjectCard({ item }: MemberProjectCardProps) {
  return (
    <View style={styles.memberProjectCard}>
      <View style={styles.memberProjectLeft}>
        <Text style={styles.memberProjectName}>{item.projectName}</Text>
        <Text style={styles.memberProjectTasks}>
          {item.taskCount} {VOICE_STRINGS.LABEL_TASKS}
        </Text>
      </View>
      <View style={styles.memberRoleBadge}>
        <Text style={styles.memberRoleText}>{item.role}</Text>
      </View>
    </View>
  );
}

// ── Member Task Row ───────────────────────────────────────────────────────────

interface MemberTaskRowProps {
  item: MemberTaskItem;
}

function MemberTaskRow({ item }: MemberTaskRowProps) {
  const statusColor =
    item.status === 'completed'
      ? Colors.priorityLow
      : item.status === 'pending'
      ? Colors.priorityMedium
      : Colors.priorityHigh;
  return (
    <View style={styles.memberTaskRow}>
      <View style={[styles.memberTaskDot, { backgroundColor: statusColor }]} />
      <View style={styles.memberTaskContent}>
        <Text style={styles.memberTaskTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.memberTaskProject}>{item.projectName}</Text>
      </View>
      <View style={[styles.memberTaskStatusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.memberTaskStatusText}>{item.status}</Text>
      </View>
    </View>
  );
}

// ── Search Result Item ────────────────────────────────────────────────────────

interface SearchItemProps {
  item: SearchResultItem;
}

function SearchResultRow({ item }: SearchItemProps) {
  const isCompleted = item.status === 'completed';
  const statusColor = isCompleted ? Colors.priorityLow : Colors.priorityMedium;
  return (
    <View style={styles.searchItem}>
      <View style={[styles.searchItemDot, { backgroundColor: statusColor }]} />
      <View style={styles.searchItemContent}>
        <Text style={styles.searchItemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.searchItemProject}>{item.projectName}</Text>
      </View>
      <View style={[styles.searchItemStatus, { backgroundColor: statusColor }]}>
        <Text style={styles.searchItemStatusText}>{item.status}</Text>
      </View>
    </View>
  );
}

// ── Results Section ───────────────────────────────────────────────────────────

interface ResultsSectionProps {
  data: StructuredData;
}

function ResultsSection({ data }: ResultsSectionProps) {
  const renderProjectCard = useCallback(
    ({ item }: ListRenderItemInfo<ProjectInfo>) => <ProjectCard item={item} />,
    [],
  );

  const renderSearchItem = useCallback(
    ({ item }: ListRenderItemInfo<SearchResultItem>) => <SearchResultRow item={item} />,
    [],
  );

  const renderMemberProjectCard = useCallback(
    ({ item }: ListRenderItemInfo<MemberProjectItem>) => <MemberProjectCard item={item} />,
    [],
  );

  const projectKeyExtractor = useCallback((item: ProjectInfo) => item.projectName, []);
  const searchKeyExtractor = useCallback((item: SearchResultItem) => item.id, []);
  const memberProjectKeyExtractor = useCallback((item: MemberProjectItem) => item.projectName, []);

  const renderMemberTaskRow = useCallback(
    ({ item }: ListRenderItemInfo<MemberTaskItem>) => <MemberTaskRow item={item} />,
    [],
  );
  const memberTaskKeyExtractor = useCallback((item: MemberTaskItem) => item.id, []);

  if (data.type === 'task_stats') {
    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsSectionTitle}>{VOICE_STRINGS.LABEL_TASK_STATS}</Text>
        <View style={styles.statsRow}>
          <StatCard
            label={VOICE_STRINGS.LABEL_TOTAL}
            value={data.payload.total}
            bgColor={Colors.primary}
          />
          <StatCard
            label={VOICE_STRINGS.LABEL_PENDING}
            value={data.payload.pending}
            bgColor={Colors.priorityMedium}
          />
          <StatCard
            label={VOICE_STRINGS.LABEL_COMPLETED}
            value={data.payload.completed}
            bgColor={Colors.priorityLow}
          />
        </View>
      </View>
    );
  }

  if (data.type === 'project_info') {
    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsSectionTitle}>{VOICE_STRINGS.LABEL_PROJECTS}</Text>
        <FlatList
          data={data.payload}
          keyExtractor={projectKeyExtractor}
          renderItem={renderProjectCard}
          scrollEnabled={false}
        />
      </View>
    );
  }

  if (data.type === 'search_results') {
    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsSectionTitle}>
          {VOICE_STRINGS.LABEL_SEARCH_RESULTS} ({data.payload.length})
        </Text>
        {data.payload.length === 0 ? (
          <Text style={styles.noResultsText}>{VOICE_STRINGS.LABEL_NO_RESULTS}</Text>
        ) : (
          <FlatList
            data={data.payload}
            keyExtractor={searchKeyExtractor}
            renderItem={renderSearchItem}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  }

  if (data.type === 'member_tasks') {
    const { memberName, status, tasks } = data.payload;
    const label = status === 'all'
      ? VOICE_STRINGS.LABEL_ALL_TASKS
      : `${status.charAt(0).toUpperCase() + status.slice(1)} ${VOICE_STRINGS.LABEL_TASKS}`;
    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsSectionTitle}>
          {label} {VOICE_STRINGS.LABEL_FOR} {memberName}
        </Text>
        {tasks.length === 0 ? (
          <Text style={styles.noResultsText}>{VOICE_STRINGS.LABEL_NO_MEMBER_TASKS}</Text>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={memberTaskKeyExtractor}
            renderItem={renderMemberTaskRow}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  }

  if (data.type === 'member_projects') {
    const { memberName, projects } = data.payload;
    return (
      <View style={styles.resultsSection}>
        <Text style={styles.resultsSectionTitle}>
          {VOICE_STRINGS.LABEL_MEMBER_PROJECTS}: {memberName}
        </Text>
        {projects.length === 0 ? (
          <Text style={styles.noResultsText}>{VOICE_STRINGS.LABEL_NO_PROJECTS}</Text>
        ) : (
          <FlatList
            data={projects}
            keyExtractor={memberProjectKeyExtractor}
            renderItem={renderMemberProjectCard}
            scrollEnabled={false}
          />
        )}
      </View>
    );
  }

  return null;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function VoiceAssistantScreen({ navigation: _navigation }: Props) {
  const userId = useAppSelector(state => state.user.userId) ?? '';
  const role = useAppSelector(state => state.user.role);
  const isAdmin = role === 'admin';

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [textInput, setTextInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [structuredData, setStructuredData] = useState<StructuredData | null>(null);

  // Refs to avoid stale closures inside Voice callbacks
  const transcriptRef = useRef('');
  const isProcessingRef = useRef(false);
  const isListeningRef = useRef(false);
  const aiResponseRef = useRef('');
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Pulse animation ───────────────────────────────────────────────────────

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  const startPulse = useCallback(() => {
    pulseLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.35,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoopRef.current.start();
  }, [pulseAnim]);

  const stopPulse = useCallback(() => {
    pulseLoopRef.current?.stop();
    pulseAnim.setValue(1);
  }, [pulseAnim]);

  // ── TTS speaking state ────────────────────────────────────────────────────

  useEffect(() => {
    const onStart = () => setIsSpeaking(true);
    const onFinish = () => setIsSpeaking(false);
    const onCancel = () => setIsSpeaking(false);

    Tts.addEventListener('tts-start', onStart);
    Tts.addEventListener('tts-finish', onFinish);
    Tts.addEventListener('tts-cancel', onCancel);

    return () => {
      Tts.removeEventListener('tts-start', onStart);
      Tts.removeEventListener('tts-finish', onFinish);
      Tts.removeEventListener('tts-cancel', onCancel);
    };
  }, []);

  const onStopSpeaking = useCallback(() => {
    try { Tts.stop(); } catch { /* safe */ }
    setIsSpeaking(false);
  }, []);

  // ── Silence timer (auto-submit after SILENCE_TIMEOUT_MS with no new words) ──

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Ref wrappers so Voice callbacks access the latest versions
  const stopPulseRef = useRef(stopPulse);
  useEffect(() => { stopPulseRef.current = stopPulse; });

  const clearSilenceTimerRef = useRef(clearSilenceTimer);
  useEffect(() => { clearSilenceTimerRef.current = clearSilenceTimer; });

  // ── Reset all state ──────────────────────────────────────────────────────

  const onReset = useCallback(async () => {
    clearSilenceTimer();
    if (isListeningRef.current) {
      await Voice.stop().catch(() => {});
      isListeningRef.current = false;
      setIsListening(false);
      stopPulse();
    }
    try { Tts.stop(); } catch { /* TTS not active — safe to ignore */ }
    setIsSpeaking(false);
    setTranscript('');
    setAiResponse('');
    setTextInput('');
    setStructuredData(null);
    transcriptRef.current = '';
    aiResponseRef.current = '';
  }, [clearSilenceTimer, stopPulse]);

  // ── Submit query to Gemini ────────────────────────────────────────────────

  const submitQuery = useCallback(
    async (query: string) => {
      if (!query.trim() || isProcessingRef.current) { return; }

      try { Tts.stop(); } catch { /* TTS not active — safe to ignore */ }
      // Clear previous results right before fetching new ones
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

        const onData = (data: StructuredData) => {
          setStructuredData(data);
        };

        await processVoiceQuery(query.trim(), userId, isAdmin, onToken, onData);

        if (aiResponseRef.current.trim()) {
          Tts.speak(aiResponseRef.current);
        }
      } catch {
        setAiResponse(VOICE_STRINGS.ERROR_API);
        Alert.alert('Error', VOICE_STRINGS.ERROR_API);
      } finally {
        isProcessingRef.current = false;
        setIsProcessing(false);
      }
    },
    [userId, isAdmin],
  );

  // Ref so Voice callbacks always use the latest submitQuery
  const submitQueryRef = useRef(submitQuery);
  useEffect(() => { submitQueryRef.current = submitQuery; });

  // ── Voice recognition setup (once) ─────────────────────────────────────────

  useEffect(() => {
    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      const text = e.value?.[0] ?? '';
      transcriptRef.current = text;
      setTranscript(text);

      // Reset the silence timer every time new words arrive
      clearSilenceTimerRef.current();
      silenceTimerRef.current = setTimeout(async () => {
        if (!isListeningRef.current) { return; }
        // Silence detected — auto stop & submit
        await Voice.stop().catch(() => {});
        isListeningRef.current = false;
        setIsListening(false);
        stopPulseRef.current();
        const finalText = transcriptRef.current.trim();
        if (finalText) {
          transcriptRef.current = '';
          submitQueryRef.current(finalText);
        }
      }, SILENCE_TIMEOUT_MS);
    };

    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      const text = e.value?.[0] ?? '';
      transcriptRef.current = text;
      setTranscript(text);
    };

    Voice.onSpeechEnd = () => {
      clearSilenceTimerRef.current();
      isListeningRef.current = false;
      setIsListening(false);
      stopPulseRef.current();
      const finalText = transcriptRef.current.trim();
      if (finalText) {
        transcriptRef.current = '';
        submitQueryRef.current(finalText);
      }
    };

    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      clearSilenceTimerRef.current();
      isListeningRef.current = false;
      setIsListening(false);
      stopPulseRef.current();
      console.warn('Voice error:', e.error?.message);
    };

    return () => {
      clearSilenceTimerRef.current();
      Voice.destroy().then(Voice.removeAllListeners).catch(() => {});
      try { Tts.stop(); } catch { /* safe */ }
    };
  }, []);

  // ── Mic toggle ─────────────────────────────────────────────────────────────

  const onToggleMic = useCallback(async () => {
    if (isListeningRef.current) {
      clearSilenceTimer();
      await Voice.stop().catch(() => {});
      isListeningRef.current = false;
      setIsListening(false);
      stopPulse();
    } else {
      try {
        // Only clear the transcript — keep previous AI response/data visible
        // until the new query finishes (submitQuery clears them when it starts)
        setTranscript('');
        transcriptRef.current = '';
        await Voice.start('en-US');
        isListeningRef.current = true;
        setIsListening(true);
        startPulse();
      } catch {
        Alert.alert('Voice Unavailable', VOICE_STRINGS.ERROR_VOICE);
      }
    }
  }, [clearSilenceTimer, stopPulse, startPulse]);

  // ── Text input send ─────────────────────────────────────────────────────────

  const onSendText = useCallback(() => {
    const query = textInput.trim();
    if (!query) { return; }
    setTranscript(query);
    setTextInput('');
    submitQuery(query);
  }, [textInput, submitQuery]);

  const onChangeTextInput = useCallback((value: string) => {
    setTextInput(value);
  }, []);

  // ── Example chip press ──────────────────────────────────────────────────────

  const onExamplePress = useCallback(
    (question: string) => {
      setTranscript(question);
      submitQuery(question);
    },
    [submitQuery],
  );

  // ── FlatList helpers ────────────────────────────────────────────────────────

  const renderExample = useCallback(
    ({ item }: ListRenderItemInfo<string>) => (
      <ExampleChip item={item} onPress={onExamplePress} />
    ),
    [onExamplePress],
  );

  const exampleKeyExtractor = useCallback((item: string) => item, []);

  // ── Derived state ───────────────────────────────────────────────────────────

  const micHint = isListening
    ? VOICE_STRINGS.HINT_LISTENING
    : isProcessing
    ? VOICE_STRINGS.HINT_PROCESSING
    : VOICE_STRINGS.HINT_TAP_TO_SPEAK;

  const hasContent = !!(aiResponse || transcript || structuredData);
  const showExamples = !aiResponse && !isProcessing && !transcript && !structuredData;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={styles.outerContainer}>
      <Header title={VOICE_STRINGS.HEADER_TITLE} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── AI Response card ── */}
          <View style={styles.responseCard}>
            <View style={styles.responseHeader}>
              <Text style={styles.responseLabel}>{VOICE_STRINGS.LABEL_AI_RESPONSE}</Text>
              <View style={styles.responseHeaderActions}>
                {isSpeaking && (
                  <TouchableOpacity style={styles.stopSpeakingBtn} onPress={onStopSpeaking}>
                    <Text style={styles.stopSpeakingIcon}>⏹</Text>
                    <Text style={styles.stopSpeakingText}>{VOICE_STRINGS.BTN_STOP_SPEAKING}</Text>
                  </TouchableOpacity>
                )}
                {hasContent && (
                  <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
                    <Text style={styles.resetBtnText}>↺ {VOICE_STRINGS.BTN_RESET}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {isProcessing && !aiResponse ? (
              <View style={styles.processingRow}>
                <ActivityIndicator size="small" color={Colors.primary} />
                <Text style={styles.processingText}>{VOICE_STRINGS.HINT_PROCESSING}</Text>
              </View>
            ) : aiResponse ? (
              <Text style={styles.responseText}>{aiResponse}</Text>
            ) : (
              <Text style={styles.responsePlaceholder}>
                {VOICE_STRINGS.PLACEHOLDER_RESPONSE}
              </Text>
            )}
          </View>

          {/* ── Structured data results ── */}
          {structuredData && <ResultsSection data={structuredData} />}

          {/* ── Transcript ── */}
          {transcript.length > 0 && (
            <View style={styles.transcriptCard}>
              <Text style={styles.transcriptLabel}>{VOICE_STRINGS.LABEL_YOU_SAID}</Text>
              <Text style={styles.transcriptText}>{transcript}</Text>
            </View>
          )}

          {/* ── Text input ── */}
          <View style={styles.inputRow}>
            <TextInput
              placeholder={VOICE_STRINGS.PLACEHOLDER_TEXT}
              value={textInput}
              onChangeText={onChangeTextInput}
              style={styles.textInput}
              onSubmitEditing={onSendText}
              returnKeyType="send"
              placeholderTextColor={Colors.iconGray}
              editable={!isProcessing}
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={onSendText}
              disabled={isProcessing || !textInput.trim()}
            >
              <Text style={styles.sendBtnText}>{VOICE_STRINGS.BTN_SEND}</Text>
            </TouchableOpacity>
          </View>

          {/* ── Mic button ── */}
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
              <Text style={styles.micIcon}>{isListening ? '⏹' : '🎙️'}</Text>
            </TouchableOpacity>
            <Text style={styles.micHint}>{micHint}</Text>
          </View>

          {/* ── Example questions (shown when idle) ── */}
          {showExamples && (
            <View style={styles.examplesSection}>
              <Text style={styles.examplesLabel}>Try asking:</Text>
              <FlatList
                data={VOICE_STRINGS.EXAMPLE_QUESTIONS}
                keyExtractor={exampleKeyExtractor}
                renderItem={renderExample}
                scrollEnabled={false}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
