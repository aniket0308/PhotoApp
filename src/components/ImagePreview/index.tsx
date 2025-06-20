import React from 'react';
import { Image, Text, Box } from '@gluestack-ui/themed';
import { Asset } from 'react-native-image-picker';
import { ImageStyle } from 'react-native';

interface ImagePreviewProps {
    image: Asset;
    onRemove: () => void;
    width?: number;
    height?: number;
    imageStyle?: ImageStyle;
    latitude?: number;
    longitude?: number;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
    image,
    onRemove,
    width = 300,
    height = 300,
    imageStyle,
    latitude,
    longitude,
}) => {
    return (
        <Box mt="$5" alignItems="center" position="relative">
            {/* Image Display */}
            <Image
                source={{ uri: image.uri }}
                style={[
                    {
                        width,
                        height,
                        borderRadius: 12,
                        resizeMode: 'cover',
                    },
                    imageStyle, // override or extend styles from props
                ]}
            />

            {/* Remove Button */}
            <Box
                position="absolute"
                top={10}
                right={10}
                backgroundColor="rgba(0,0,0,0.6)"
                borderRadius={20}
                px="$2"
                py="$1"
            >
                <Text
                    color="$white"
                    fontWeight="bold"
                    onPress={onRemove}
                >
                    ✕
                </Text>
            </Box>

            {/* File Name */}
            <Text
                mt="$2"
                width={width}
                numberOfLines={2}
                ellipsizeMode="tail"
                textAlign="center"
                color="$black"
            >
                {image.fileName}
            </Text>
            {/* Latitude and Longitude */}
            {(latitude !== undefined && longitude !== undefined) && (
                <Box mt="$1" width={width} alignItems="center">
                    <Text color="$black" fontSize={14}>
                        Latitude: {latitude.toFixed(6)}
                    </Text>
                    <Text color="$black" fontSize={14}>
                        Longitude: {longitude.toFixed(6)}
                    </Text>
                </Box>
            )}
        </Box>
    );
};

export default ImagePreview;
