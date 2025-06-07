import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pokemon, PokemonSpecies } from '../../types/pokemon';
import { pokemonService } from '../../service/PokemonService';
import { typeColors } from '../../constant/Colors';
import LoadingSpinner from '../../components/LoadingSpinner';
import {calculateTypeEffectiveness} from "@/service/calculateTypeEffectiveness";

const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Attack',
    'special-defense': 'Sp. Defense',
    speed: 'Speed'
};

export default function PokemonDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [species, setSpecies] = useState<PokemonSpecies | null>(null);
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(true);

        const pokemonTypes = pokemon?.types.map(t => t.type.name);
        const effectiveness = calculateTypeEffectiveness(pokemonTypes);
    useEffect(() => {
        if (id) {
            loadPokemonData();
        }
    }, [id]);

    const loadPokemonData = async () => {
        try {
            setLoading(true);
            const pokemonData = await pokemonService.getPokemon(parseInt(id!));
            setPokemon(pokemonData);

            // Load species data for description
            const speciesData = await pokemonService.getPokemonSpecies(pokemonData.id);
            setSpecies(speciesData);

            // Get English description
            const englishEntry = speciesData.flavor_text_entries.find(
                entry => entry.language.name === 'en'
            );
            if (englishEntry) {
                setDescription(englishEntry.flavor_text.replace(/\f/g, ' '));
            }
        } catch (error) {
            console.error('Failed to load Pokemon data:', error);
            Alert.alert('Error', 'Failed to load Pokemon data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompare = () => {
        if (pokemon) {
            router.push({
                pathname: '/compare',
                params: {
                    pokemon1: pokemon.id,
                },
            });
        }
    };

    const handlePrevious = () => {
        if (pokemon && pokemon.id > 1) {
            router.replace(`/pokemon/${pokemon.id - 1}`);
        }
    };

    const handleNext = () => {
        if (pokemon && pokemon.id < 1200) {
            router.replace(`/pokemon/${pokemon.id + 1}`);
        }
    };

    if (loading || !pokemon) {
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

    const maxStat = Math.max(...pokemon.stats.map(stat => stat.base_stat));

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#374151" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <View style={styles.navigationButtons}>
                    <TouchableOpacity
                        onPress={handlePrevious}
                        disabled={pokemon.id <= 1}
                        style={[styles.navButton, pokemon.id <= 1 && styles.navButtonDisabled]}
                    >
                        <Ionicons name="chevron-back" size={20} color={pokemon.id <= 1 ? '#9CA3AF' : '#374151'} />
                        <Text style={[styles.navButtonText, pokemon.id <= 1 && styles.navButtonTextDisabled]}>
                            Previous
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={pokemon.id >= 1200}
                        style={[styles.navButton, pokemon.id >= 1200 && styles.navButtonDisabled]}
                    >
                        <Text style={[styles.navButtonText, pokemon.id >= 1200 && styles.navButtonTextDisabled]}>
                            Next
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={pokemon.id >= 1200 ? '#9CA3AF' : '#374151'} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Image
                        source={{
                            uri: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
                        }}
                        style={styles.heroImage}
                        resizeMode="contain"
                    />

                    <View style={styles.heroContent}>
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

                        <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
                            <Ionicons name="git-compare" size={20} color="white" />
                            <Text style={styles.compareButtonText}>Compare</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Details */}
                <View style={styles.detailsContainer}>
                    {/* Description */}
                    {description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.description}>{description}</Text>
                        </View>
                    )}

                    <View style={styles.twoColumnContainer}>
                        {/* Basic Info */}
                        <View style={styles.column}>
                            <Text style={styles.sectionTitle}>Basic Information</Text>
                            <View style={styles.infoContainer}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Height:</Text>
                                    <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Weight:</Text>
                                    <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Base Experience:</Text>
                                    <Text style={styles.infoValue}>{pokemon.base_experience}</Text>
                                </View>
                            </View>

                            {/* Abilities */}
                            <Text style={styles.subsectionTitle}>Abilities</Text>
                            <View style={styles.abilitiesContainer}>
                                {pokemon.abilities.map((ability, index) => (
                                    <View key={index} style={styles.abilityRow}>
                                        <Text style={styles.abilityName}>
                                            {ability.ability.name.replace('-', ' ')}
                                        </Text>
                                        {ability.is_hidden && (
                                            <View style={styles.hiddenBadge}>
                                                <Text style={styles.hiddenBadgeText}>Hidden</Text>
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Stats */}
                        <View style={styles.column}>
                            <Text style={styles.sectionTitle}>Base Stats</Text>
                            <View style={styles.statsContainer}>
                                {pokemon.stats.map((stat) => (
                                    <View key={stat.stat.name} style={styles.statRow}>
                                        <View style={styles.statHeader}>
                                            <Text style={styles.statName}>
                                                {statNames[stat.stat.name] || stat.stat.name}
                                            </Text>
                                            <Text style={styles.statValue}>{stat.base_stat}</Text>
                                        </View>
                                        <View style={styles.statBarContainer}>
                                            <View
                                                style={[
                                                    styles.statBar,
                                                    { width: `${(stat.base_stat / maxStat) * 100}%` }
                                                ]}
                                            />
                                        </View>
                                    </View>
                                ))}
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Total:</Text>
                                    <Text style={styles.totalValue}>
                                        {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.effectivenessSection}>
                    <Text style={styles.effectivenessTitle}>Type Effectiveness</Text>

                    {effectiveness.weakTo.length > 0 && (
                        <View style={styles.effectivenessRow}>
                            <Text style={styles.effectivenessLabel}>Weak to:</Text>
                            <View style={styles.typeChipsContainer}>
                                {effectiveness.weakTo.map(type => (
                                    <View
                                        key={type}
                                        style={[
                                            styles.effectivenessChip,
                                            styles.weaknessChip,
                                            { backgroundColor: typeColors[type] || '#A8A878' }
                                        ]}
                                    >
                                        <Text style={styles.effectivenessChipText}>{type}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {effectiveness.resistantTo.length > 0 && (
                        <View style={styles.effectivenessRow}>
                            <Text style={styles.effectivenessLabel}>Resistant to:</Text>
                            <View style={styles.typeChipsContainer}>
                                {effectiveness.resistantTo.map(type => (
                                    <View
                                        key={type}
                                        style={[
                                            styles.effectivenessChip,
                                            styles.resistanceChip,
                                            { backgroundColor: typeColors[type] || '#A8A878' }
                                        ]}
                                    >
                                        <Text style={styles.effectivenessChipText}>{type}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {effectiveness.immuneTo.length > 0 && (
                        <View style={styles.effectivenessRow}>
                            <Text style={styles.effectivenessLabel}>Immune to:</Text>
                            <View style={styles.typeChipsContainer}>
                                {effectiveness.immuneTo.map(type => (
                                    <View
                                        key={type}
                                        style={[
                                            styles.effectivenessChip,
                                            styles.immunityChip,
                                            { backgroundColor: typeColors[type] || '#A8A878' }
                                        ]}
                                    >
                                        <Text style={styles.effectivenessChipText}>{type}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </View>
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
    navigationButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: 14,
        color: '#374151',
        marginHorizontal: 4,
    },
    navButtonTextDisabled: {
        color: '#9CA3AF',
    },
    scrollView: {
        flex: 1,
    },
    heroSection: {
        backgroundColor: 'white',
        alignItems: 'center',
        paddingVertical: 32,
        marginBottom: 16,
    },
    heroImage: {
        width: 200,
        height: 200,
        marginBottom: 24,
    },
    heroContent: {
        alignItems: 'center',
    },
    pokemonId: {
        fontSize: 18,
        color: '#6B7280',
        marginBottom: 8,
    },
    pokemonName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1F2937',
        textTransform: 'capitalize',
        marginBottom: 16,
    },
    typesContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 24,
    },
    typeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    typeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    compareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        gap: 8,
    },
    compareButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    detailsContainer: {
        backgroundColor: 'white',
        borderRadius: 16,
        margin: 16,
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#374151',
        lineHeight: 24,
    },
    twoColumnContainer: {
        flexDirection: 'row',
        gap: 24,
    },
    column: {
        flex: 1,
    },
    infoContainer: {
        marginBottom: 24,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 16,
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    subsectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    abilitiesContainer: {
        gap: 8,
    },
    abilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    abilityName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1F2937',
        textTransform: 'capitalize',
    },
    hiddenBadge: {
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    hiddenBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    statsContainer: {
        gap: 16,
    },
    statRow: {
        gap: 8,
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statName: {
        fontSize: 16,
        color: '#374151',
        fontWeight: '500',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    statBarContainer: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
    },
    statBar: {
        height: '100%',
        backgroundColor: '#3B82F6',
        borderRadius: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    effectivenessSection: {
        width: '100%',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    effectivenessTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 12,
    },
    effectivenessRow: {
        marginBottom: 8,
    },
    effectivenessLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    typeChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    effectivenessChip: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        opacity: 0.9,
    },
    weaknessChip: {
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    resistanceChip: {
        borderWidth: 1,
        borderColor: '#10B981',
    },
    immunityChip: {
        borderWidth: 1,
        borderColor: '#6B7280',
    },
    effectivenessChipText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
});
