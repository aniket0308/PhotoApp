import React, { useEffect, useState } from 'react';
import { FlatList, Linking, Platform } from 'react-native';
import { Box, Text, Image, VStack, HStack, Pressable, Spinner, Button, Icon, ChevronLeftIcon } from '@gluestack-ui/themed';
import { fetchMetadata } from '@utils/Functions/function';
import { useNavigation } from '@react-navigation/native';
import { strings } from '@utils/Strings/strings';

type PhotoItem = {
    id: string;
    fileUri: string;
    createdAt: { seconds: number; nanoseconds: number } | null;
    location: { latitude: number; longitude: number } | null;
    fileName: string;
};

export const GalleryScreen = () => {
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const navigation = useNavigation();

    const loadPhotos = async () => {
        const photos = await fetchMetadata();
        setPhotos(photos);
        setLoading(false);
    };

    useEffect(() => {
        loadPhotos();
    }, []);

    const openMaps = (lat: number, lng: number) => {
        const url =
            Platform.OS === 'ios'
                ? `maps:0,0?q=${lat},${lng}`
                : `geo:0,0?q=${lat},${lng}`;

        Linking.openURL(url).catch(() => {
            alert('Could not open map application.');
        });
    };

    const renderItem = ({ item }: { item: PhotoItem }) => {
        const date = item.createdAt
            ? new Date(item.createdAt.seconds * 1000)
            : null;
        const formattedDate = date ? date.toLocaleString() : 'Unknown Date';

        return (
            <Pressable onPress={() => {
                if (item.location) {
                    openMaps(item.location.latitude, item.location.longitude);
                } else {
                    alert('No location available for this photo.');
                }
            }}>
                <Box
                    bg="$backgroundLight"
                    borderRadius="md"
                    overflow="hidden"
                    mb="$4"
                    flexDirection="row"
                    alignItems="center"
                    px="$4"
                    py="$3"
                >
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=600&q=80' }}
                        alt={item.fileName}
                        resizeMode="cover"
                        height={100}
                        width={100}
                        borderRadius={8}
                    />
                    <VStack ml="$4" flex={1}>
                        <Text fontWeight="bold" fontSize="$lg" mb="$1" numberOfLines={1}>
                            {item.fileName}
                        </Text>
                        <Text color="$gray600" fontSize="$sm" mb="$1">
                            {formattedDate}
                        </Text>
                        {item.location && (
                            <HStack space="sm" alignItems="center">
                                <Text color="$primary600" fontSize="$sm" fontWeight="600">
                                    Lat: {item.location.latitude.toFixed(4)}
                                </Text>
                                <Text color="$primary600" fontSize="$sm" fontWeight="600">
                                    Lng: {item.location.longitude.toFixed(4)}
                                </Text>
                            </HStack>
                        )}
                        <Text color="$blue600" fontWeight="600" fontSize="$sm" mt="$2">
                            {strings.gelleryScreen.tapToOpen}
                        </Text>
                    </VStack>
                </Box>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundLight">
                <Spinner size="large" color="$primary600" />
                <Text mt="$4" fontSize="$md" color="$gray700">
                    {strings.gelleryScreen.loadingPhotos}
                </Text>
            </Box>
        );
    }

    if (photos.length === 0) {
        return (
            <Box flex={1} justifyContent="center" alignItems="center" bg="$backgroundLight" px="$4">
                <Text fontSize="$lg" color="$gray500" textAlign="center">
                    {strings.gelleryScreen.noPhotosUploaded}
                </Text>
            </Box>
        );
    }

    return (
        <Box flex={1} bg="$backgroundLight" px="$4" py="$6">
            {/* Go Back Button aligned to left */}
            <Box mb="$4" alignItems="flex-start">
                <Button
                    variant="link"
                    onPress={() => navigation.goBack()}
                    action="secondary"
                    size="sm"
                >
                    <Icon as={ChevronLeftIcon} mr="$1" />
                    <Text>{strings.gelleryScreen.goBack}</Text>
                </Button>
            </Box>
            <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </Box>
    );
};
