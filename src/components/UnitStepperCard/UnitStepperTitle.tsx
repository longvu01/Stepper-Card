interface IUnitStepperTitleProps {
  label: string;
}
const UnitStepperTitle = ({ label }: IUnitStepperTitleProps) => {
  return <span className="text-neutral-400 text-xs min-w-[100px]">{label}</span>;
};

export default UnitStepperTitle;
