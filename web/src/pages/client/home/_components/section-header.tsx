import { type ReactNode } from "react";

const SectionHeader = ({
  //   children,
  className,
  title,
}: {
  //   children: ReactNode;
  className?: string;
  title: string;
}) => {
  return (
    <header className="w-full pt-8 pb-6">
      <h2 className="text-lg md:text-xl font-bold">{title}</h2>
    </header>
  );
};

export default SectionHeader;
