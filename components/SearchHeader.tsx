import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchHeaderProps {
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onFilterPress: () => void;
    showFilters: boolean;
}

export default function SearchHeader({
                                         searchTerm,
                                         onSearchChange,
                                         onFilterPress,
                                         showFilters
                                     }: SearchHeaderProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Ionicons name="flash" size={32} color="#F59E0B" />
                    <Text style={styles.title}>
                        Poke<Text style={styles.titleAccent}>Lab</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Pokemon by name or ID..."
                        value={searchTerm}
                        onChangeText={onSearchChange}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.filterButton, showFilters && styles.filterButtonActive]}
                    onPress={onFilterPress}
                >
                    <Ionicons
                        name="options"
                        size={20}
                        color={showFilters ? 'white' : '#374151'}
                    />
                    <Text style={[styles.filterText, showFilters && styles.filterTextActive]}>
                        Filters
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginLeft: 8,
    },
    titleAccent: {
        color: '#3B82F6',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 44,
        fontSize: 16,
        color: '#1F2937',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: 'white',
    },
    filterButtonActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    filterText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    filterTextActive: {
        color: 'white',
    },
});
