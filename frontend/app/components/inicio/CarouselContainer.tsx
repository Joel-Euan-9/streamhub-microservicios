'use client'
import { useRef } from 'react'
import SectionTitle from '../ui/SectionTitle'

interface Props {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function CarouselContainer({ title, children, action }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section>
      <SectionTitle 
        title={title} 
        action={
          <div className="flex items-center gap-4">
            {action}
            <div className="hidden md:flex gap-2">
              <button onClick={() => handleScroll('left')} className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#3a86ff] flex items-center justify-center transition border border-white/10">
                &lt;
              </button>
              <button onClick={() => handleScroll('right')} className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#3a86ff] flex items-center justify-center transition border border-white/10">
                &gt;
              </button>
            </div>
          </div>
        }
      />
      <div 
        ref={scrollRef} 
        className="flex gap-5 overflow-x-auto pb-5 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {children}
      </div>
    </section>
  );
}