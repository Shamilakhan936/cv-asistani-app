// Template index file
// This file exports all available resume templates

import { FC } from 'react';
import { ResumeData } from '../../types/datatypes';
import DefaultTemplate from './DefaultTemplate';
import Template3 from './Template-3';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import { DefaultThumbnail, ModernThumbnail, MinimalThumbnail } from './thumbnails';
import ProfessionalThumbnail from './thumbnails/ProfessionalThumbnail';

// Template registry - add new templates here
export const TEMPLATES = [
  {
    id: 'default',
    name: 'Default Template',
    component: DefaultTemplate,
    thumbnailComponent: DefaultThumbnail,
  },
  {
    id: 'modern',
    name: 'Modern Template',
    component: ModernTemplate,
    thumbnailComponent: ModernThumbnail,
  },
  {
    id: 'template3',
    name: 'Template 3',
    component: Template3,
    thumbnailComponent: MinimalThumbnail,
  },
  {
    id: 'minimal',
    name: 'Minimal Template',
    component: MinimalTemplate,
    thumbnailComponent: MinimalThumbnail,
  },
  {
    id: 'professional',
    name: 'Professional Template',
    component: ProfessionalTemplate,
    thumbnailComponent: ProfessionalThumbnail,
  }
];

export type TemplateId = 'default' | 'modern' | 'template3' | 'minimal' | 'professional';

// Helper function to get template by ID
export function getTemplateById(id: TemplateId) {
  const template = TEMPLATES.find(template => template.id === id);
  if (!template) {
    throw new Error(`Template with id ${id} not found`);
  }
  return template;
}

export { DefaultTemplate, ModernTemplate, MinimalTemplate, ProfessionalTemplate }; 