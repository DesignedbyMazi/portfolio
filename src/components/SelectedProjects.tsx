import carloftyImg from '../assets/images/carlofty-case-study.png';
import './SelectedProjects.css';

function ArrowUpRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
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

interface CaseStudy {
  id: number;
  title: string;
  description: string;
  image: string;
  link?: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: 'Designing Trust into a Broken Payment Experience For Cross-border Car Sourcing.',
    description:
      "Global car auctions shouldn't require a middleman. Carlofty was designed to give Nigerian buyers direct, transparent access to Copart, Manheim, and IAAI — from a single platform they could actually trust.",
    image: carloftyImg,
    link: '#',
  },
];

function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <div className="case-card">
      {/* Screenshot */}
      <div className="case-card__image">
        <img src={study.image} alt={study.title} className="case-card__img" />
      </div>
      {/* Body */}
      <div className="case-card__body">
        <h3 className="case-card__title">{study.title}</h3>
        <p className="case-card__desc">{study.description}</p>
        {study.link && (
          <a href={study.link} className="case-card__link">
            <span>Read Case Study</span>
            <ArrowUpRightIcon className="case-card__link-arrow" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function SelectedProjects() {
  return (
    <div className="selected-projects">
      <div className="selected-projects__header">
        <div className="selected-projects__title-group">
          <h2 className="selected-projects__heading">Selected Case Studies</h2>
          <p className="selected-projects__subheading">A record of my thoughtful process</p>
        </div>
        <a href="#" className="selected-projects__view-all">
          <span>View all</span>
          <ArrowUpRightIcon className="selected-projects__arrow" />
        </a>
      </div>

      <div className="selected-projects__list">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.id} study={study} />
        ))}
      </div>
    </div>
  );
}
