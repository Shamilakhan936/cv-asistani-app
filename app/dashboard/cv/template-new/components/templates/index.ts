// Template index file
// This file exports all available resume templates

import { FC } from 'react';
import { ResumeData } from '../../types/datatypes';
import DefaultTemplate from "./DefaultTemplate"
import Template3 from "./Template-3"
import ModernTemplate from "./ModernTemplate"
import MinimalTemplate from "./MinimalTemplate"
import ClassicTemplate from "./ClassicTemplate"
import ProfessionalTemplate from "./ProfessionalTemplate"
import { DefaultThumbnail, ModernThumbnail, MinimalThumbnail } from './thumbnails';
import ProfessionalThumbnail from './thumbnails/ProfessionalThumbnail';
import SingleColumnTemplate from './SingleColumn';
import SoftwareTemplate from './SoftwareTemplate';
import AccountTemplate from './AccountTemplate';
import ProductManagerTemplate from './ProductManager';

// Template registry - add new templates here
export const TEMPLATES = [
  {
    id: "default",
    name: "Default Template",
    component: DefaultTemplate,
    thumbnailComponent: DefaultThumbnail,
  },
  {
    id: "modern",
    name: "Modern Template",
    component: ModernTemplate,
    thumbnailComponent: ModernThumbnail,
  },
  {
    id: "template3",
    name: "Template 3",
    component: Template3,
    thumbnailComponent: MinimalThumbnail,
  },
  {
    id: "minimal",
    name: "Minimal Template",
    component: MinimalTemplate,
    thumbnailComponent: MinimalThumbnail,
  },
  {
    id: "professional",
    name: "Professional Template",
    component: ProfessionalTemplate,
    thumbnailComponent: ProfessionalThumbnail,
  },
  {
    id: "classic",
    name: "Classic Template",
    component: ClassicTemplate,
    thumbnailComponent: ProfessionalThumbnail,
  },
  {
    id: "singleColumn",
    name: "Single Column Template",
    component: SingleColumnTemplate,
    thumbnailComponent: ProfessionalThumbnail,
  },
  
  {
    id: "software",
    name: "software Template",
    component: SoftwareTemplate,
    thumbnailComponent: ProfessionalThumbnail,
  },

  {
    id: "account",
    name: "account Template",
    component: AccountTemplate,
    thumbnailComponent: MinimalThumbnail,
  },
  {
    id: "product",
    name: "Product Manager Template",
    component: ProductManagerTemplate,
    thumbnailComponent: MinimalThumbnail,
  },
]

export type TemplateId = "default" | "modern" | "template3" | "minimal" | "professional" | "classic"

// Helper function to get template by ID
export function getTemplateById(id: TemplateId) {
  const template = TEMPLATES.find((template) => template.id === id)
  if (!template) {
    throw new Error(`Template with id ${id} not found`)
  }
  return template
}

export { DefaultTemplate, ModernTemplate, MinimalTemplate, ProfessionalTemplate, ClassicTemplate }
