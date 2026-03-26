import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

export default function TaskItem({ item, onDelete, onResolve, resolveRef,closeRef }: { 
  item: any, 
  onDelete: (id: string) => void, 
  onResolve: (item: any) => void,
  resolveRef?: React.MutableRefObject<(() => void) | null>,
  closeRef?: React.MutableRefObject<(() => void) | null>,
}) {
  const translateX = useRef(new Animated.Value(0)).current;
  const swipeableRef = useRef<Swipeable>(null); 
  const height = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleDelete = () => {
    // Step 1: slide left
    Animated.timing(translateX, {
      toValue: -500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Step 2: collapse height
      Animated.timing(height, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        // Step 3: remove from list
        onDelete(item.id);
      });
    });
  };

   const runResolveAnimation = () => {
    Animated.timing(translateX, {
      toValue: -500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(height, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  };
  
    useEffect(() => {
    if (resolveRef) resolveRef.current = runResolveAnimation;
    if (closeRef) closeRef.current = () => swipeableRef.current?.close(); // 👈
  }, []);

  const handleResolved = () => {
    // Just open the modal — no animation here
    onResolve(item); // parent uses this to open modal + store selectedTask
  };

  const renderRightActions = () => (
    <View style={{ flexDirection: 'row',paddingRight: 10 }}>
      <TouchableOpacity style={styles.deleteBox} onPress={handleDelete}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
   { item.status === 'pending' && <TouchableOpacity style={styles.resolveBox} onPress={handleResolved}>
      <Text style={styles.resolveText}>Mark Resolved</Text>
    </TouchableOpacity>}
    </View>
  );

  return (
    <Animated.View style={{ height, opacity }}>
      <Swipeable ref={swipeableRef} renderRightActions={renderRightActions}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ translateX }] },
          ]}
        >
          <Text style={styles.title}>{item.title}</Text>
        </Animated.View>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
    card: {
     backgroundColor: "#fff",
      justifyContent: 'center',
      // alignItems: 'center',
      borderRadius: 6,
      // marginBottom: 8,
      marginLeft: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
  
    title: {
      fontSize: 16,
      fontWeight: '500',
    },
  
    deleteBox: {
      backgroundColor: '#ff4d4f',
      justifyContent: 'center',
      alignItems: 'center',
      width: 80,
      borderRadius: 6,
      // marginBottom: 8,
      marginLeft: 5,
    },
    deleteText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    resolveBox: {
      backgroundColor: '#4caf50',
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      borderRadius: 6,
      // marginBottom: 8,
      marginLeft: 5,
    },  
    resolveText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
  });