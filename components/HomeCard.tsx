import { cn } from "@/lib/utils";
import Image from "next/image";
interface HomeCardProps {
  img: string;
  title: string;
  description: string;
  bgColor: string;
  handleClick: () => void;
}

const HomeCard = ({
  img,
  title,
  description,
  bgColor,
  handleClick,
}: HomeCardProps) => {
  return (
    <div
      className={cn(
        "px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] cursor-pointer rounded-[14px] bg-orange",
        bgColor
      )}
      onClick={handleClick}
    >
      <div className="flex justify-between h-full flex-col">
        <div className="rounded-[10px] p-[10px] bg-white-300 w-fit">
          <Image width={30} height={30} src={img} alt={title} />
        </div>
        <div>
          <h3 className="text-2xl font-bold mb=[5px]">{title}</h3>
          <p className="text-lg">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
