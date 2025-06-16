import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReactNode } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  handleClick?: () => void;
  buttonText?: string;
  image?: string;
  buttonIcon?: string;
  children?: ReactNode;
}

const MeetingModal = ({
  isOpen,
  onClose,
  title,
  className,
  handleClick,
  buttonText,
  image,
  buttonIcon,
  children,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="flex w-full max-w-[520px] flex-col bg-black-200 border-none"
      >
        <DialogTitle hidden></DialogTitle>
        {image && (
          <div className="flex justify-center">
            <Image src={image} alt="image" width={72} height={72} />
          </div>
        )}
        <h2
          className={cn(
            "text-3xl font-bold leading-[42px] mb-4 tracking-normal",
            className
          )}
        >
          {title}
        </h2>
        {children}
        <Button
          onClick={handleClick}
          className="bg-primary no-focus rounded-[4px] py-[9px] px-5 w-full max-w-[472px"
        >
          {buttonIcon && (
            <Image src={buttonIcon} alt="button Icon" width={17} height={17} />
          )}
          &nbsp;
          {buttonText}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
