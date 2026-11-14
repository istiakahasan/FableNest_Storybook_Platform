interface Props {
  value: number | string;
  title: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
const TopSummaryCard = ({ value, title, icon: Icon }: Props) => {
  return (
    <div className="bg-white hover:shadow-md transition-all duration-200 rounded-xl px-4 py-5 c-drop-shadow w-full">
      {/* Left Side (Value and Title) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-medium text-[#000407]">{value}</h2>

          {Icon && (
            <div className="w-12 h-12 flex items-center justify-center bg-[#F7F7F7] text-[#00244A] rounded-xl">
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>

        <p className="text-lg font-medium text-[#61758A]">{title}</p>
      </div>
    </div>
  );
};

export default TopSummaryCard;
