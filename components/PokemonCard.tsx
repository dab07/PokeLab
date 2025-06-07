import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Pokemon } from '../types/pokemon';
import { typeColors } from '../constant/Colors';

interface PokemonCardProps {
    pokemon: Pokemon;
    onPress: () => void;
    onCompare?: () => void;
    isCompareMode?: boolean;
    isSelected?: boolean;
}

export default function PokemonCard({
                                        pokemon,
                                        onPress,
                                        onCompare,
                                        isCompareMode = false,
                                        isSelected = false
                                    }: PokemonCardProps) {
    const handlePress = () => {
        if (isCompareMode && onCompare) {
            onCompare();
        } else {
            onPress();
        }
    };

    return (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.idContainer}>
                <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
            </View>

            <Image
                source={{
                    uri: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
                }}
                style={styles.image}
                resizeMode="contain"
            />

            <Text style={styles.name}>{pokemon.name}</Text>

            <View style={styles.typesContainer}>
                {pokemon.types.map((type) => (
                    <View
                        key={type.type.name}
                        style={[
                            styles.typeChip,
                            { backgroundColor: typeColors[type.type.name] || '#A8A878' }
                        ]}
                    >
                        <Text style={styles.typeText}>{type.type.name}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Height</Text>
                    <Text style={styles.statValue}>{pokemon.height / 10}m</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Weight</Text>
                    <Text style={styles.statValue}>{pokemon.weight / 10}kg</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        alignItems: 'center',
    },
    selectedCard: {
        borderWidth: 3,
        borderColor: '#3B82F6',
        shadowOpacity: 0.2,
    },
    idContainer: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    id: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
    },
    image: {
        width: 80,
        height: 80,
        marginTop: 16,
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        textTransform: 'capitalize',
        marginBottom: 8,
        textAlign: 'center',
    },
    typesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 12,
    },
    typeChip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        marginHorizontal: 2,
        marginVertical: 2,
    },
    typeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    statValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
    },
});
