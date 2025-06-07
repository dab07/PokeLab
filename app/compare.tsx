import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pokemon } from '../types/pokemon';
import { pokemonService } from '../service/PokemonService';
import { typeColors } from '../constant/Colors';
import LoadingSpinner from '../components/LoadingSpinner';

const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    speed: 'Speed'
};

export default function CompareScreen() {
    const { pokemon1, pokemon2 } = useLocalSearchParams<{ pokemon1: string; pokemon2?: string }>();
    const [firstPokemon, setFirstPokemon] = useState<Pokemon | null>(null);
    const [secondPokemon, setSecondPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPokemonData();
    }, [pokemon1, pokemon2]);

    const loadPokemonData = async () => {
        try {
            setLoading(true);

            if (pokemon1) {
                const first = await pokemonService.getPokemon(parseInt(pokemon1));
                setFirstPokemon(first);
            }

            if (pokemon2) {
                const second = await pokemonService.getPokemon(parseInt(pokemon2));
                setSecondPokemon(second);
            }
        } catch (error) {
            console.error('Failed to load Pokemon data:', error);
            Alert.alert('Error', 'Failed to load Pokemon data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const selectSecondPokemon = () => {
        router.push({
            pathname: '/',
            params: {
                selectForCompare: pokemon1,
                compareMode: 'true'
            }
        });
    };

    const renderPokemonCard = (pokemon: Pokemon | null, isFirst: boolean) => {
        if (!pokemon) {
            return (
                <View style={styles.emptyCard}>
                    <View style={styles.emptyImageContainer}>
                        <Text style={styles.emptyImageText}>?</Text>
                    </View>
                    <Text style={styles.emptyCardTitle}>Select a Pokemon to compare</Text>
                    <TouchableOpacity style={styles.selectButton} onPress={selectSecondPokemon}>
                        <Text style={styles.selectButtonText}>Choose Pokemon</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <View style={styles.pokemonCard}>
                <Image
                    source={{
                        uri: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
                    }}
                    style={styles.pokemonImage}
                    resizeMode="contain"
                />

                <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, '0')}</Text>
                <Text style={styles.pokemonName}>{pokemon.name}</Text>

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

                <View style={styles.basicInfo}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Height</Text>
                        <Text style={styles.infoValue}>{pokemon.height / 10}m</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Weight</Text>
                        <Text style={styles.infoValue}>{pokemon.weight / 10}kg</Text>
                    </View>
                </View>

                <View style={styles.statsSection}>
                    <Text style={styles.statsTitle}>Base Stats</Text>
                    {pokemon.stats.map((stat) => (
                        <View key={stat.stat.name} style={styles.statRow}>
                            <Text style={styles.statName}>
                                {statNames[stat.stat.name] || stat.stat.name}
                            </Text>
                            <Text style={styles.statValue}>{stat.base_stat}</Text>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>
                            {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderComparison = () => {
        if (!firstPokemon || !secondPokemon) return null;

        return (
            <View style={styles.comparisonSection}>
                <Text style={styles.comparisonTitle}>Stat Comparison</Text>
                <View style={styles.comparisonContainer}>
                    {firstPokemon.stats.map((stat, index) => {
                        const stat1 = stat.base_stat;
                        const stat2 = secondPokemon.stats[index].base_stat;
                        const max = Math.max(stat1, stat2);

                        return (
                            <View key={stat.stat.name} style={styles.comparisonRow}>
                                <Text style={styles.comparisonStatName}>
                                    {statNames[stat.stat.name] || stat.stat.name}
                                </Text>
                                <View style={styles.comparisonValues}>
                                    <Text style={[
                                        styles.comparisonValue,
                                        stat1 > stat2 && styles.winningValue,
                                        stat1 < stat2 && styles.losingValue
                                    ]}>
                                        {stat1}
                                    </Text>
                                    <Text style={[
                                        styles.comparisonValue,
                                        stat2 > stat1 && styles.winningValue,
                                        stat2 < stat1 && styles.losingValue
                                    ]}>
                                        {stat2}
                                    </Text>
                                </View>
                                <View style={styles.comparisonBars}>
                                    <View style={styles.comparisonBarContainer}>
                                        <View
                                            style={[
                                                styles.comparisonBar,
                                                styles.firstPokemonBar,
                                                { width: `${(stat1 / max) * 100}%` }
                                            ]}
                                        />
                                    </View>
                                    <View style={styles.comparisonBarContainer}>
                                        <View
                                            style={[
                                                styles.comparisonBar,
                                                styles.secondPokemonBar,
                                                { width: `${(stat2 / max) * 100}%` }
                                            ]}
                                        />
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                        <Text style={styles.backText}>Back</Text>
                    </TouchableOpacity>
                </View>
                <LoadingSpinner message="Loading Pokemon..." />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Compare Pokemon</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.cardsContainer}>
                    {renderPokemonCard(firstPokemon, true)}

                    <View style={styles.vsContainer}>
                        <Ionicons name="git-compare" size={32} color="#6B7280" />
                    </View>

                    {renderPokemonCard(secondPokemon, false)}
                </View>

                {renderComparison()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#374151',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    headerSpacer: {
        width: 60,
    },
    scrollView: {
        flex: 1,
    },
    cardsContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 16,
    },
    pokemonCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    emptyCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    emptyImageContainer: {
        width: 100,
        height: 100,
        backgroundColor: '#F3F4F6',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyImageText: {
        fontSize: 32,
        color: '#9CA3AF',
    },
    emptyCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
    },
    selectButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    selectButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    pokemonImage: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    pokemonId: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    pokemonName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        textTransform: 'capitalize',
        marginBottom: 12,
    },
    typesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4,
        marginBottom: 16,
    },
    typeChip: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    typeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    basicInfo: {
        width: '100%',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    statsSection: {
        width: '100%',
    },
    statsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    statName: {
        fontSize: 14,
        color: '#6B7280',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    vsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    comparisonSection: {
        backgroundColor: 'white',
        margin: 16,
        marginTop: 0,
        borderRadius: 16,
        padding: 20,
    },
    comparisonTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 20,
    },
    comparisonContainer: {
        gap: 12,
    },
    comparisonRow: {
        gap: 8,
    },
    comparisonStatName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        textAlign: 'center',
    },
    comparisonValues: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    comparisonValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    winningValue: {
        color: '#10B981',
        fontWeight: 'bold',
    },
    losingValue: {
        color: '#EF4444',
    },
    comparisonBars: {
        flexDirection: 'row',
        gap: 8,
    },
    comparisonBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    comparisonBar: {
        height: '100%',
        borderRadius: 4,
    },
    firstPokemonBar: {
        backgroundColor: '#3B82F6',
    },
    secondPokemonBar: {
        backgroundColor: '#EF4444',
    },
});
