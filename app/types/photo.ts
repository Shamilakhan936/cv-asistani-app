export type Gender = 'male' | 'female';

export type MaleClothing = 
  | 'classic-suit'
  | 'smart-casual-suit'
  | 'formal-shirt'
  | 'smart-casual-shirt'
  | 'sweater-shirt'
  | 'casual-sweater';

export type FemaleClothing = 
  | 'classic-suit'
  | 'smart-casual-blazer'
  | 'classic-dress'
  | 'smart-casual-dress'
  | 'classic-blouse'
  | 'smart-casual-blouse'
  | 'smart-casual-sweater';

export type Clothing = MaleClothing | FemaleClothing;

export type SuitColor = 
  | 'black'
  | 'charcoal'
  | 'navy'
  | 'medium-blue'
  | 'smoke'
  | 'light-beige'
  | 'brown'
  | 'olive';

export type ShirtColor = 
  | 'white'
  | 'light-blue'
  | 'sand'
  | 'light-gray'
  | 'ivory'
  | 'lavender'
  | 'dusty-pink'
  | 'mint';

export type TieColor = 
  | 'black'
  | 'navy'
  | 'burgundy'
  | 'dark-green'
  | 'steel-blue'
  | 'charcoal';

export type SweaterColor = 
  | 'smoke'
  | 'dark-green'
  | 'camel'
  | 'burgundy'
  | 'ash-gray'
  | 'dark-blue'
  | 'cinnamon';

export type Pose = 
  | 'professional'
  | 'casual'
  | 'editorial';

export type Background = 
  // Studio Backgrounds
  | 'studio-white'
  | 'studio-light-gray'
  | 'studio-dark-gray'
  | 'studio-navy'
  | 'studio-brown'
  | 'studio-beige'
  // Professional Environments
  | 'office-modern'
  | 'office-executive'
  | 'meeting-room'
  | 'library'
  | 'garden-pro';

export interface Colors {
  main?: SuitColor;
  shirt?: ShirtColor;
  tie?: TieColor;
  sweater?: SweaterColor;
}

export interface PhotoFeatures {
  gender: Gender;
  clothing: Clothing;
  colors: Colors;
  pose: Pose;
  background: Background;
}

export interface ClothingOption {
  id: Clothing;
  name: string;
  requiresMainColor: boolean;
  requiresShirtColor: boolean;
  requiresTieColor: boolean;
  requiresSweaterColor: boolean;
} 