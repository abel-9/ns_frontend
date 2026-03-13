import { cn } from "#/lib/utils";
import { ArrowRight as AR, ArrowLeft as AL } from "lucide-react";

interface CarousalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CarousalItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CarousalImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}
interface CarousalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface CarousalComponent extends React.FC<CarousalProps> {
  Item: React.FC<CarousalItemProps>;
  Image: React.FC<CarousalImageProps>;
  Content: React.FC<CarousalContentProps>;
  ArrowRight: React.FC;
  ArrowLeft: React.FC;
}

const Carousal: CarousalComponent = ({ children, className }) => {
  return (
    <div className="relative">
      <div
        id="carousel"
        className={cn(
          "flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar overflow-y-hidden scrollbar-hidden",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};

const Item: React.FC<CarousalItemProps> = ({ children, className }) => {
  return (
    <div className={cn("w-full shrink-0 snap-start relative", className)}>
      {children}
    </div>
  );
};

const Image = ({ src, alt, className }: CarousalImageProps) => {
  return (
    <div className={cn("absolute top-0 left-0 w-full h-full z-0", className)}>
      <img src={src} alt={alt} className="object-cover w-full h-full" />
    </div>
  );
};

const Content: React.FC<CarousalContentProps> = ({ children, className }) => {
  return <div className={cn("relative z-10", className)}>{children}</div>;
};

const ArrowRight: React.FC = () => {
  return (
    <div className="cursor-pointer absolute border border-white bg-white/10 rounded-full p-3 flex items-center justify-center right-0 top-1/2 -translate-y-1/2 z-10">
      <AR className="text-white" />
    </div>
  );
};

const ArrowLeft: React.FC = () => {
  return (
    <div className="cursor-pointer absolute border border-white bg-white/10 rounded-full p-3 flex items-center justify-center left-0 top-1/2 -translate-y-1/2 z-10">
      <AL className="text-white" />
    </div>
  );
};

Carousal.Item = Item;
Carousal.Image = Image;
Carousal.Content = Content;
Carousal.ArrowRight = ArrowRight;
Carousal.ArrowLeft = ArrowLeft;

export default Carousal;
