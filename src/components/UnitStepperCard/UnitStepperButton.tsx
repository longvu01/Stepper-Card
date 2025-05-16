import Tooltip from "../Tooltip";

interface IUnitStepperButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  content: string;
  tooltipContent?: string;
  className?: string;
}
const UnitStepperButton = ({ content, tooltipContent, className, ...props }: IUnitStepperButtonProps) => {
  return (
    <Tooltip>
      <Tooltip.Trigger shouldTrigger={!!tooltipContent}>
        <button
          className={`size-9 flex text-lg items-center justify-center leading-none text-white hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}>
          {content}
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content content={tooltipContent ?? ""} />
    </Tooltip>
  );
};

export default UnitStepperButton;
