export type Facade = 'Limestone' | 'Charcoal' | 'Warm White';
export type Accent = 'Natural Oak' | 'Dark Walnut' | 'Black Metal';
export type Roof = 'Slate' | 'Graphite' | 'Terracotta';
export type Configuration = { facade: Facade; accent: Accent; roof: Roof; lighting: 'Day' | 'Dusk' };
export type SceneMotion = { progress: number; act: number; reveal: number };
export const facadeColors: Record<Facade, string> = { Limestone: '#c4bda7', Charcoal: '#4a4c47', 'Warm White': '#e9e4d4' };
export const accentColors: Record<Accent, string> = { 'Natural Oak': '#aa784a', 'Dark Walnut': '#513829', 'Black Metal': '#292e2b' };
export const roofColors: Record<Roof, string> = { Slate: '#737770', Graphite: '#343b3c', Terracotta: '#a3654c' };
