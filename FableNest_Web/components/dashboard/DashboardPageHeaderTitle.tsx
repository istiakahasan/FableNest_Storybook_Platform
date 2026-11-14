interface Props {
  title: string;
  sub_title?: string;
}

const DashboardPageHeaderTitle = ({ sub_title, title }: Props) => {
  return (
    <div className="text-left">
      <h2 className="text-2xl lg:text-3xl font-medium text-[#000407 ]">
        {title}
      </h2>
      <p className="text-[#61758A] text-base lg:text-lg">{sub_title}</p>
    </div>
  );
};

export default DashboardPageHeaderTitle;
