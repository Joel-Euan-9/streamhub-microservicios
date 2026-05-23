import Link from "next/link";
import SectionTitle from "../ui/SectionTitle";

interface BentoItem {
  id: string;
  title: string;
  subtitle: string;
  img: string; // Background image (horizontal)
}

interface BentoGridProps {
  title: string;
  items: BentoItem[];
  total: number;
  viewAllLink: string;
}

export default function BentoGrid({ title, items, total, viewAllLink }: BentoGridProps) {
  if (items.length === 0) return null;

  const mainItem = items[0];
  const subItems = items.slice(1, 5); // up to 4 items

  return (
    <section>
      <SectionTitle 
        title={title} 
        action={
          <Link href={viewAllLink} className="text-sm font-semibold text-[#3a86ff] hover:text-[#00f2fe] transition-colors hover:underline flex items-center gap-1">
            Ver todo ({total}) <span>&rarr;</span>
          </Link>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-5">
        
        {/* Main Large Card (Left) */}
        {mainItem && (
          <Link 
            href={`/peliculas/${mainItem.id}`}
            className={`group relative overflow-hidden rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.3)] block ${
              subItems.length === 0 
                ? 'col-span-1 md:col-span-2 lg:col-span-4 aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1]' 
                : 'md:col-span-2 lg:col-span-2 lg:row-span-2 aspect-[16/9] md:aspect-auto'
            }`}
          >
            <img 
              src={mainItem.img} 
              alt={mainItem.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/40 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-1 drop-shadow-lg">{mainItem.title}</h3>
              <p className="text-sm md:text-base font-semibold text-[#00f2fe] drop-shadow-md">{mainItem.subtitle}</p>
            </div>
          </Link>
        )}

        {/* 4 Small Cards (Right) */}
        {subItems.map((item) => (
          <Link 
            key={item.id}
            href={`/peliculas/${item.id}`}
            className="group relative overflow-hidden rounded-2xl col-span-1 aspect-[16/9] shadow-[0_5px_15px_rgba(0,0,0,0.3)] block"
          >
            <img 
              src={item.img} 
              alt={item.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h3 className="text-lg font-bold text-white mb-0.5 truncate drop-shadow-md">{item.title}</h3>
              <p className="text-xs font-medium text-[#00f2fe] drop-shadow-md truncate">{item.subtitle}</p>
            </div>
          </Link>
        ))}

      </div>
    </section>
  );
}
