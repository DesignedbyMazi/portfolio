import './SelectedProjects.css';

function ArrowUpRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="selected-projects__arrow"
    >
      <path
        d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Designing Trust into a Broken Payment Experience For Cross-border Car Sourcing',
    description:
      "Global car auctions shouldn't require a middleman. Carlofty was designed to give Nigerian buyers direct, transparent access to Copart, Manheim, and IAAI — from a single platform they could actually trust.",
  },
  {
    id: 2,
    title: 'Designing Trust into a Broken Payment Experience For Cross-border Car Sourcing',
    description:
      "Global car auctions shouldn't require a middleman. Carlofty was designed to give Nigerian buyers direct, transparent access to Copart, Manheim, and IAAI — from a single platform they could actually trust.",
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="project-card">
      <div className="project-card__image">
        {project.image && (
          <img src={project.image} alt={project.title} className="project-card__img" />
        )}
      </div>
      <div className="project-card__body">
        <p className="project-card__title">{project.title}</p>
        <p className="project-card__desc">{project.description}</p>
      </div>
    </div>
  );
}

export default function SelectedProjects() {
  return (
    <div className="selected-projects">
      <div className="selected-projects__header">
        <h2 className="selected-projects__heading">Selected Projects</h2>
        <a href="#" className="selected-projects__view-all">
          <span>View all</span>
          <ArrowUpRightIcon />
        </a>
      </div>
      <div className="selected-projects__grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
