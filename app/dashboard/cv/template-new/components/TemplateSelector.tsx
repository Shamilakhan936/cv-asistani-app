"use client";

import React from 'react';
import { TEMPLATES, TemplateId } from '../components/templates';

interface TemplateSelectorProps {
  selectedTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplateId,
  onSelectTemplate,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {TEMPLATES.map((template) => {
        const ThumbnailComponent = template.thumbnailComponent;
        return (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.id as TemplateId)}
            className={`relative rounded-lg overflow-hidden transition-all duration-200 ${
              selectedTemplateId === template.id
                ? 'ring-2 ring-blue-500 scale-[1.02]'
                : 'hover:scale-[1.02]'
            }`}
          >
            <ThumbnailComponent />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
              <p className="text-white text-sm font-medium">{template.name}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default TemplateSelector; 