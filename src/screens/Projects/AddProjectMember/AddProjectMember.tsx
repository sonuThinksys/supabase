import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ProjectsStackParamList } from '../../../navigation/types';
import { Routes } from '../../../navigation/Routes';
import Header from '../../../components/Header';
import {
  addProjectMember,
  fetchProfiles,
  fetchProjectMembers,
  MemberRole,
  Profile,
  ProjectMember,
} from '../../../services/taskService';
import { useAppSelector } from '../../../store/hooks';
import { styles } from './AddProjectMember.styles';
import { ADD_MEMBER_STRINGS, ROLE_OPTIONS } from './AddProjectMember.constants';

type Props = {
  navigation: NativeStackNavigationProp<ProjectsStackParamList>;
  route: RouteProp<ProjectsStackParamList, typeof Routes.ADD_PROJECT_MEMBER>;
};

// ── UserPickerModal ───────────────────────────────────────────────────────────

type UserPickerModalProps = {
  visible: boolean;
  profiles: Profile[];
  selectedUserId: string | null;
  onSelect: (profile: Profile) => void;
  onClose: () => void;
};

function UserPickerModal({
  visible,
  profiles,
  selectedUserId,
  onSelect,
  onClose,
}: UserPickerModalProps) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      profiles.filter(p =>
        p.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [profiles, search],
  );

  const onClearSearch = useCallback(() => setSearch(''), []);

  const renderUserRow: ListRenderItem<Profile> = useCallback(
    ({ item }) => {
      const isSelected = item.id === selectedUserId;
      const onPressRow = () => onSelect(item);
      return (
        <TouchableOpacity
          style={[styles.userRow, isSelected && styles.userRowSelected]}
          onPress={onPressRow}
          activeOpacity={0.7}
        >
          <Text style={[styles.userEmail, isSelected && styles.userEmailSelected]}>
            {item.email}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedUserId, onSelect],
  );

  const keyExtractor = useCallback((item: Profile) => item.id, []);

  const renderEmpty = useCallback(
    () => <Text style={styles.emptyText}>{ADD_MEMBER_STRINGS.EMPTY_USERS}</Text>,
    [],
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{ADD_MEMBER_STRINGS.MODAL_TITLE}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>{ADD_MEMBER_STRINGS.MODAL_CLOSE}</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder={ADD_MEMBER_STRINGS.SEARCH_PLACEHOLDER}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
          <FlatList
            data={filtered}
            keyExtractor={keyExtractor}
            renderItem={renderUserRow}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </View>
    </Modal>
  );
}

// ── MemberRow ─────────────────────────────────────────────────────────────────

function MemberRow({ member }: { member: ProjectMember }) {
  const initial = member.profiles.email.charAt(0).toUpperCase();
  return (
    <View style={styles.memberCard}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberAvatarText}>{initial}</Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberEmail}>{member.profiles.email}</Text>
      </View>
      <View style={styles.memberRoleBadge}>
        <Text style={styles.memberRoleText}>{member.role}</Text>
      </View>
    </View>
  );
}

// ── AddProjectMemberScreen ────────────────────────────────────────────────────

export default function AddProjectMemberScreen({ navigation, route }: Props) {
  const { projectId, projectName } = route.params || { projectId: '', projectName: '' };
  const role = useAppSelector(state => state.user.role);
  const isAdmin = role === 'admin';

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedRole, setSelectedRole] = useState<MemberRole>('member');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    const [profilesData, membersData] = await Promise.all([
      fetchProfiles(),
      fetchProjectMembers(projectId),
    ]);
    setProfiles(profilesData);
    setMembers(membersData);
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openPicker = useCallback(() => setPickerVisible(true), []);
  const closePicker = useCallback(() => setPickerVisible(false), []);

  const onSelectUser = useCallback((profile: Profile) => {
    setSelectedUser(profile);
    setPickerVisible(false);
  }, []);

  const onSubmit = useCallback(async () => {
    if (!selectedUser) {
      Alert.alert(ADD_MEMBER_STRINGS.ALERT_NO_USER_TITLE, ADD_MEMBER_STRINGS.ALERT_NO_USER_MSG);
      return;
    }
    setLoading(true);
    try {
      await addProjectMember(projectId, selectedUser.id, selectedRole);
      Alert.alert(
        ADD_MEMBER_STRINGS.ALERT_SUCCESS_TITLE,
        ADD_MEMBER_STRINGS.ALERT_SUCCESS_MSG,
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('unique') || message.includes('duplicate')) {
        Alert.alert(ADD_MEMBER_STRINGS.ALERT_DUPLICATE_TITLE, ADD_MEMBER_STRINGS.ALERT_DUPLICATE_MSG);
      } else {
        Alert.alert(ADD_MEMBER_STRINGS.ALERT_ERROR_TITLE, ADD_MEMBER_STRINGS.ALERT_ERROR_MSG);
      }
    } finally {
      setLoading(false);
    }
  }, [selectedUser, selectedRole, projectId, navigation]);

  const memberKeyExtractor = useCallback((item: ProjectMember) => item.id, []);

  const renderMember: ListRenderItem<ProjectMember> = useCallback(
    ({ item }) => <MemberRow member={item} />,
    [],
  );

  if (!isAdmin) {
    return (
      <>
        <Header title={ADD_MEMBER_STRINGS.HEADER_TITLE} showBack />
        <View style={styles.container}>
          <Text style={styles.emptyText}>Access restricted to admins.</Text>
        </View>
      </>
    );
  }

  return (
    <>
      <Header title={`${projectName} — Members`} showBack />
      <View style={styles.container}>

        {/* User picker */}
        <Text style={styles.sectionLabel}>{ADD_MEMBER_STRINGS.SECTION_SELECT_USER}</Text>
        <TouchableOpacity style={styles.pickerTrigger} onPress={openPicker} activeOpacity={0.7}>
          <Text
            style={[
              styles.pickerTriggerText,
              !selectedUser && styles.pickerTriggerPlaceholder,
            ]}
            numberOfLines={1}
          >
            {selectedUser ? selectedUser.email : ADD_MEMBER_STRINGS.PLACEHOLDER_USER}
          </Text>
          <Text style={styles.pickerChevron}>▼</Text>
        </TouchableOpacity>

        {/* Role selector */}
        <Text style={styles.sectionLabel}>{ADD_MEMBER_STRINGS.SECTION_SELECT_ROLE}</Text>
        <View style={styles.roleRow}>
          {ROLE_OPTIONS.map(option => {
            const isActive = selectedRole === option.value;
            const onPressRole = () => setSelectedRole(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.roleChip, isActive && styles.roleChipActive]}
                onPress={onPressRole}
                activeOpacity={0.8}
              >
                <Text style={[styles.roleChipText, isActive && styles.roleChipTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={onSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          <Text style={styles.submitButtonText}>
            {loading ? ADD_MEMBER_STRINGS.BUTTON_LOADING : ADD_MEMBER_STRINGS.BUTTON_IDLE}
          </Text>
        </TouchableOpacity>

        {/* Current members */}
        {members.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Current Members ({members.length})</Text>
            <FlatList
              data={members}
              keyExtractor={memberKeyExtractor}
              renderItem={renderMember}
              scrollEnabled={false}
            />
          </>
        )}
      </View>

      <UserPickerModal
        visible={pickerVisible}
        profiles={profiles}
        selectedUserId={selectedUser?.id ?? null}
        onSelect={onSelectUser}
        onClose={closePicker}
      />
    </>
  );
}
