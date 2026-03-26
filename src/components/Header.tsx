import React from 'react';
import { View, Text, StyleSheet, StyleProp, TextStyle, ViewStyle, Pressable, Image } from 'react-native';
import { Colors } from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
export default function Header({
  title,
  leftComponent,
  rightComponent,
  containerStyle,
  titleStyle,
  showBack,
}: {
  title: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  showBack?: boolean;
}) {
    const navigation = useNavigation();
    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
      };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {/* Left */}
      <View style={styles.side}>
        { 
        showBack && (
          <Pressable style={styles.menuIcon} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={20} color={Colors.text} />
          </Pressable>
        ) ||
        leftComponent || 
        <Pressable style={styles.menuIcon} onPress={openDrawer}>
          <Image source={require('../images/menu.png')} style={{width: 20, height: 20}} resizeMode="contain" />
        </Pressable>}
      </View>

      {/* Title */}
      <View style={styles.center}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Right */}
      <View style={styles.side}>
        {rightComponent || <View style={styles.placeholder} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.borderColor,
      backgroundColor: Colors.card,
    },
  
    side: {
      width: 60,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
  
    center: {
      flex: 1,
      alignItems: 'center',
    },
  
    title: {
      color: Colors.text,
      fontSize: 18,
      fontWeight: '600',
    },
  
    placeholder: {
      width: 24,
      height: 24,
    },
    menuIcon: {
      width: 20,
      height: 20,
      marginLeft: 10,
    },
  });