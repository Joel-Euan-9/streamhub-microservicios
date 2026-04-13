interface SectionTitleProps {
  title: string;
  action?: React.ReactNode;
}

export default function SectionTitle({ title, action }: SectionTitleProps) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <h2 className="border-l-4 border-[#3a86ff] pl-4 text-[1.45rem] font-bold text-white drop-shadow-[0_0_10px_rgba(58,134,255,0.4)] md:text-[1.8rem]">
        {title}
      </h2>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}