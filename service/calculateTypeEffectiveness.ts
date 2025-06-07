export const typeEffectiveness: Record<string, {
    weakTo: string[];
    resistantTo: string[];
    immuneTo: string[];
}> = {
    normal: {
        weakTo: ['fighting'],
        resistantTo: [],
        immuneTo: []
    },
    fire: {
        weakTo: ['ground', 'rock', 'water'],
        resistantTo: ['bug', 'steel', 'fire', 'grass', 'ice', 'fairy'],
        immuneTo: []
    },
    water: {
        weakTo: ['grass', 'electric'],
        resistantTo: ['steel', 'fire', 'water', 'ice'],
        immuneTo: []
    },
    electric: {
        weakTo: ['ground'],
        resistantTo: ['flying', 'steel', 'electric'],
        immuneTo: []
    },
    grass: {
        weakTo: ['flying', 'poison', 'bug', 'fire', 'ice'],
        resistantTo: ['ground', 'water', 'grass', 'electric'],
        immuneTo: []
    },
    ice: {
        weakTo: ['fighting', 'rock', 'steel', 'fire'],
        resistantTo: ['ice'],
        immuneTo: []
    },
    fighting: {
        weakTo: ['flying', 'psychic', 'fairy'],
        resistantTo: ['rock', 'bug', 'dark'],
        immuneTo: []
    },
    poison: {
        weakTo: ['ground', 'psychic'],
        resistantTo: ['fighting', 'poison', 'bug', 'grass', 'fairy'],
        immuneTo: []
    },
    ground: {
        weakTo: ['water', 'grass', 'ice'],
        resistantTo: ['poison', 'rock'],
        immuneTo: ['electric']
    },
    flying: {
        weakTo: ['rock', 'electric', 'ice'],
        resistantTo: ['fighting', 'bug', 'grass'],
        immuneTo: ['ground']
    },
    psychic: {
        weakTo: ['bug', 'ghost', 'dark'],
        resistantTo: ['fighting', 'psychic'],
        immuneTo: []
    },
    bug: {
        weakTo: ['flying', 'rock', 'fire'],
        resistantTo: ['fighting', 'ground', 'grass'],
        immuneTo: []
    },
    rock: {
        weakTo: ['fighting', 'ground', 'steel', 'water', 'grass'],
        resistantTo: ['normal', 'flying', 'poison', 'fire'],
        immuneTo: []
    },
    ghost: {
        weakTo: ['ghost', 'dark'],
        resistantTo: ['poison', 'bug'],
        immuneTo: ['normal', 'fighting']
    },
    dragon: {
        weakTo: ['ice', 'dragon', 'fairy'],
        resistantTo: ['fire', 'water', 'electric', 'grass'],
        immuneTo: []
    },
    dark: {
        weakTo: ['fighting', 'bug', 'fairy'],
        resistantTo: ['ghost', 'dark'],
        immuneTo: ['psychic']
    },
    steel: {
        weakTo: ['fighting', 'ground', 'fire'],
        resistantTo: ['normal', 'flying', 'rock', 'bug', 'steel', 'grass', 'psychic', 'ice', 'dragon', 'fairy'],
        immuneTo: ['poison']
    },
    fairy: {
        weakTo: ['poison', 'steel'],
        resistantTo: ['fighting', 'bug', 'dark'],
        immuneTo: ['dragon']
    }
};

export const calculateTypeEffectiveness = (pokemonTypes: string[]) => {
    const effectiveness = {
        weakTo: new Set<string>(),
        resistantTo: new Set<string>(),
        immuneTo: new Set<string>(),
    };

    pokemonTypes.forEach(type => {
        const typeData = typeEffectiveness[type];
        if (typeData) {
            typeData.weakTo.forEach(t => effectiveness.weakTo.add(t));
            typeData.resistantTo.forEach(t => effectiveness.resistantTo.add(t));
            typeData.immuneTo.forEach(t => effectiveness.immuneTo.add(t));
        }
    });

    // Remove resistances from weaknesses for dual types
    effectiveness.resistantTo.forEach(type => effectiveness.weakTo.delete(type));
    effectiveness.immuneTo.forEach(type => {
        effectiveness.weakTo.delete(type);
        effectiveness.resistantTo.delete(type);
    });

    return {
        weakTo: Array.from(effectiveness.weakTo),
        resistantTo: Array.from(effectiveness.resistantTo),
        immuneTo: Array.from(effectiveness.immuneTo),
    };
};
