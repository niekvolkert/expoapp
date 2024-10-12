import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, VStack, Text } from "@gluestack-ui/themed";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Processing: { imageUri: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const pngUri = await convertToPNG(result.assets[0].uri);
      setImage(pngUri);
      navigation.navigate('Processing', { imageUri: pngUri });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const pngUri = await convertToPNG(result.assets[0].uri);
      setImage(pngUri);
      navigation.navigate('Processing', { imageUri: pngUri });
    }
  };

  const convertToPNG = async (uri: string): Promise<string> => {
    const pngUri = `${FileSystem.cacheDirectory}image.png`;
    await FileSystem.copyAsync({
      from: uri,
      to: pngUri,
    });
    return pngUri;
  };

  return (
    <View style={styles.container}>
      <VStack space={4}>
        <Text style={styles.title}>Furniture 3D</Text>
        <Button onPress={takePhoto}>
          <Text>Take a Photo</Text>
        </Button>
        <Button onPress={pickImage}>
          <Text>Pick an Image</Text>
        </Button>
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});