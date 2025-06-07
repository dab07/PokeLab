import { Pokemon, PokemonListItem, PokemonSpecies, TypeRelations } from '../types/pokemon';

class PokemonService {
    private baseUrl = 'https://pokeapi.co/api/v2';
    private cache = new Map<string, any>();

    async getAllPokemon(): Promise<PokemonListItem[]> {
        const cacheKey = 'all-pokemon';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseUrl}/pokemon?limit=1200`);
            const data = await response.json();

            this.cache.set(cacheKey, data.results);
            return data.results;
        } catch (error) {
            console.error('Failed to fetch Pokemon list:', error);
            throw error;
        }
    }

    async getPokemon(nameOrId: string | number): Promise<Pokemon> {
        const cacheKey = `pokemon-${nameOrId}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseUrl}/pokemon/${nameOrId}`);
            const pokemon = await response.json();

            this.cache.set(cacheKey, pokemon);
            return pokemon;
        } catch (error) {
            console.error(`Failed to fetch Pokemon ${nameOrId}:`, error);
            throw error;
        }
    }

    async getPokemonSpecies(id: number): Promise<PokemonSpecies> {
        const cacheKey = `species-${id}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseUrl}/pokemon-species/${id}`);
            const species = await response.json();

            this.cache.set(cacheKey, species);
            return species;
        } catch (error) {
            console.error(`Failed to fetch Pokemon species ${id}:`, error);
            throw error;
        }
    }

    async getTypeWeaknesses(typeName: string): Promise<string[]> {
        const cacheKey = `type-${typeName}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const response = await fetch(`${this.baseUrl}/type/${typeName}`);
            const typeData: TypeRelations = await response.json();

            const weaknesses = typeData.damage_relations.double_damage_from.map(type => type.name);
            this.cache.set(cacheKey, weaknesses);
            return weaknesses;
        } catch (error) {
            console.error(`Failed to fetch type data for ${typeName}:`, error);
            return [];
        }
    }

    extractIdFromUrl(url: string): number {
        const matches = url.match(/\/(\d+)\/$/);
        return matches ? parseInt(matches[1]) : 0;
    }
}

export const pokemonService = new PokemonService();
