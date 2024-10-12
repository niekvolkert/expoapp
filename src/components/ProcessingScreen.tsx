import * as React from "react";
import { StyleSheet } from "react-nativescript";
import { RouteProp } from "@react-navigation/core";
import { FrameNavigationProp } from "react-nativescript-navigation";
import { MainStackParamList } from "../NavigationParamList";
import { VStack, Text, Image, Button, Progress } from "@gluestack-ui/themed";
import axios from 'axios';

type ProcessingScreenProps = {
    route: RouteProp<MainStackParamList, "Processing">,
    navigation: FrameNavigationProp<MainStackParamList, "Processing">,
};

export function ProcessingScreen({ route, navigation }: ProcessingScreenProps) {
    const { imageUri } = route.params;
    const [processedImageUri, setProcessedImageUri] = React.useState<string | null>(null);
    const [progress, setProgress] = React.useState(0);
    const [stage, setStage] = React.useState("Uploading");

    React.useEffect(() => {
        processImage();
    }, []);

    const processImage = async () => {
        try {
            // Upload to Cloudinary
            setStage("Uploading to Cloudinary");
            const cloudinaryResponse = await uploadToCloudinary(imageUri);
            setProgress(33);

            // Background removal
            setStage("Removing Background");
            const backgroundRemovedUrl = await removeBackground(cloudinaryResponse.secure_url);
            setProcessedImageUri(backgroundRemovedUrl);
            setProgress(66);

            setStage("Ready for 3D Conversion");
            setProgress(100);
        } catch (error) {
            console.error("Error processing image:", error);
            alert("An error occurred while processing the image.");
        }
    };

    const uploadToCloudinary = async (uri: string) => {
        const formData = new FormData();
        formData.append('file', {
            uri,
            type: 'image/png',
            name: 'upload.png',
        });
        formData.append('upload_preset', 'ml_default');

        const response = await axios.post(
            'https://api.cloudinary.com/v1_1/imageto3d/image/upload',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );

        return response.data;
    };

    const removeBackground = async (imageUrl: string) => {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/imageto3d/image/upload`,
            {
                file: imageUrl,
                upload_preset: 'ml_default',
                background_removal: 'cloudinary_ai',
            },
            {
                auth: {
                    username: '218225142197592',
                    password: 'W3dwYth19ADuDRXtBd8ESh84Zcs',
                },
            }
        );

        return response.data.secure_url;
    };

    const convert3D = async () => {
        if (!processedImageUri) return;

        setStage("Converting to 3D");
        setProgress(0);

        try {
            const response = await axios.post(
                'https://api.meshy.ai/v2/convert-image-to-3d',
                {
                    image_url: processedImageUri,
                    output_format: 'glb',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer msy_KOCXtag9TUfV0PY2TAyqrPWA2ehLYjWiLmKz',
                    },
                }
            );

            // In a real app, you'd handle the response and potentially download or display the 3D model
            console.log("3D Conversion Response:", response.data);
            alert("3D model created successfully! Check the console for details.");
            setProgress(100);
            setStage("3D Conversion Complete");
        } catch (error) {
            console.error("Error converting to 3D:", error);
            alert("An error occurred while converting to 3D.");
        }
    };

    return (
        <VStack style={styles.container} space={4}>
            <Text style={styles.title}>{stage}</Text>
            <Progress value={progress} max={100} />
            {processedImageUri && (
                <Image source={{ uri: processedImageUri }} style={styles.image} />
            )}
            {stage === "Ready for 3D Conversion" && (
                <Button onPress={convert3D}>
                    <Text>Convert to 3D</Text>
                </Button>
            )}
        </VStack>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "contain",
    },
});