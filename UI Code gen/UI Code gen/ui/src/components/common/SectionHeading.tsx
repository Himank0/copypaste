import './SectionHeading.css';

export interface SectionHeadingProps {
  /** Small uppercase label above the title, e.g. "SECTION 1: HOME WORKSPACE". */
  eyebrow: string;
  title: string;
}

/**
 * Eyebrow + title heading pattern used to introduce major page sections.
 *
 * @example
 * <SectionHeading eyebrow="Section 1: Home Workspace" title="Dealer Management & Task Overview" />
 */
export function SectionHeading({ eyebrow, title }: SectionHeadingProps) {
  return (
    <div className="cmd-section-heading">
      <span className="cmd-section-heading__eyebrow">{eyebrow}</span>
      <h2 className="cmd-section-heading__title">{title}</h2>
    </div>
  );
}

export default SectionHeading;
