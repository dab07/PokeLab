export interface Pokemon {
    id: number;
    name: string;
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: PokemonType[];
    stats: PokemonStat[];
    height: number;
    weight: number;
    base_experience: number;
    abilities: PokemonAbility[];
    species: {
        url: string;
    };
}

export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
}

export interface PokemonAbility {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
}

export interface PokemonListItem {
    name: string;
    url: string;
}

export interface PokemonSpecies {
    evolution_chain: {
        url: string;
    };
    flavor_text_entries: Array<{
        flavor_text: string;
        language: {
            name: string;
        };
    }>;
}

export interface TypeRelations {
    damage_relations: {
        double_damage_from: Array<{ name: string }>;
        half_damage_from: Array<{ name: string }>;
        no_damage_from: Array<{ name: string }>;
    };
}
