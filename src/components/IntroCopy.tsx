import './IntroCopy.css';

export default function IntroCopy() {
  return (
    <div className="intro">
      <p className="intro__para" data-animate>
        I design digital products that are clear, purposeful, and built to convert. With over three years
        of experience across <strong>SaaS</strong>, <strong>B2C</strong>, and <strong>B2B</strong> in{' '}
        <strong>Payments</strong>, <strong>Edtech</strong>, <strong>Healthtech</strong>,{' '}
        <strong>Ecommerce</strong>, <strong>Fitness</strong>, and <strong>Automotive</strong>
      </p>
      <p className="intro__para" data-animate>
        My work sits at the intersection of user research, visual design, and design systems — focused
        on reducing drop-off, earning trust, and making handoff effortless.
      </p>
      <p className="intro__para" data-animate>
        Currently leading design at{' '}
        <a href="https://www.carlofty.com" target="_blank" rel="noreferrer" className="intro__link">
          Carlofty
        </a>{' '}
        — shaping how dealers and admins experience the full sourcing flow, from discovery to transaction.
      </p>
    </div>
  );
}
