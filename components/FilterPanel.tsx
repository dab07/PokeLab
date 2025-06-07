import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { typeColors } from '../constant/Colors';

interface FilterPanelProps {
    sortBy: string;
    setSortBy: (sort: string) => void;
    sortOrder: string;
    setSortOrder: (order: string) => void;
    selectedTypes: string[];
    setSelectedTypes: (types: string[]) => void;
    isVisible: boolean;
}

const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export default function FilterPanel({
                                        sortBy,
                                        setSortBy,
                                        sortOrder,
                                        setSortOrder,
                                        selectedTypes,
                                        setSelectedTypes,
                                        isVisible
                                    }: FilterPanelProps) {
    const toggleType = (type: string) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    if (!isVisible) return null;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Sort Controls */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sort By</Text>
                    <View style={styles.sortContainer}>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Sort Field</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={sortBy}
                                    onValueChange={setSortBy}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="ID" value="id" />
                                    <Picker.Item label="Name" value="name" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.pickerContainer}>
                            <Text style={styles.pickerLabel}>Order</Text>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={sortOrder}
                                    onValueChange={setSortOrder}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Ascending" value="asc" />
                                    <Picker.Item label="Descending" value="desc" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Type Filters */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Filter by Type</Text>
                    <View style={styles.typesContainer}>
                        {pokemonTypes.map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => toggleType(type)}
                                style={[
                                    styles.typeButton,
                                    selectedTypes.includes(type) && {
                                        backgroundColor: typeColors[type] || '#A8A878'
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        selectedTypes.includes(type) && styles.typeButtonTextSelected
                                    ]}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {selectedTypes.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSelectedTypes([])}
                            style={styles.clearButton}
                        >
                            <Text style={styles.clearButtonText}>Clear all filters</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 20,
        maxHeight: 300,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 16,
    },
    sortContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    pickerContainer: {
        flex: 1,
    },
    pickerLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
    },
    picker: {
        height: 50,
    },
    typesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    typeButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    typeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        textTransform: 'capitalize',
    },
    typeButtonTextSelected: {
        color: 'white',
    },
    clearButton: {
        marginTop: 16,
        alignSelf: 'flex-start',
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#3B82F6',
    },
});
