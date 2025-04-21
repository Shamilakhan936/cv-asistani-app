import { Project } from '../types/datatypes';

interface ColorConfig {
  title: string;
  description: string;
}

interface TextSizeConfig {
  title: string;
  description: string;
}

interface ProjectsProps {
  data: Project[];
  color: ColorConfig;
  textSize: TextSizeConfig;
}

export default function Projects({ data, color, textSize }: ProjectsProps) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <div className="space-y-4">
        {data.map((project) => (
          <div key={project.id} className="mb-2">
            <h3 className={`font-medium ${color.title} ${textSize.title}`}>
              {project.title}
            </h3>
            <p className={`${color.description} ${textSize.description}`}>
              {project.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
