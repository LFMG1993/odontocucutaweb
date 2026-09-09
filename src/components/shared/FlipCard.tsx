import { useState } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface FlipCardProps {
    imageUrl: string;
    title: string;
    date?: string;
    slug: string;
    description: string;
    flipDirection?: 'horizontal' | 'vertical';
    isFeatured?: boolean;
}

const FlipCard = ({
                      imageUrl,
                      date,
                      slug,
                      title,
                      description,
                      flipDirection = 'horizontal',
                  }: FlipCardProps) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleMouseEnter = () => setIsFlipped(true);
    const handleMouseLeave = () => setIsFlipped(false);

    const isVertical = flipDirection === 'vertical';
    const rotate = isVertical ? 'rotateX(180deg)' : 'rotateY(180deg)';

    return (
        <div
            className="group w-72 h-112 cursor-pointer"
            style={{ perspective: '1200px' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => !isFlipped && setIsFlipped(true)}
        >
            <div
                className={clsx(
                    'relative w-full h-full transform-3d transition-transform duration-900',
                    'shadow-sm',
                    isFlipped
                        ? 'border border-primary shadow-xl shadow-primary/10'
                        : 'border border-border group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10',
                )}
                style={{ transform: isFlipped ? rotate : isVertical ? 'rotateX(0deg)' : 'rotateY(0deg)' }}
            >
                {/* Cara Frontal */}
                <div className="absolute top-0 left-0 w-full h-full backface-hidden rounded-2xl bg-white p-6 flex flex-col justify-between z-10">
                    {date && (
                        <div className="self-end bg-primary/10 text-primary px-3 py-0.5 rounded-lg text-xs font-medium">
                            {date}
                        </div>
                    )}

                    <div className="grow flex justify-center items-center bg-surface rounded-xl overflow-hidden">
                        <img
                            src={imageUrl}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h1 className="mt-4 text-center font-heading text-xl font-semibold text-text">
                        {title}
                    </h1>
                </div>

                {/* Cara Trasera */}
                <div
                    className="absolute top-0 left-0 w-full h-full backface-hidden rounded-2xl bg-surface p-6 text-text flex flex-col"
                    style={{ transform: rotate }}
                >
                    <div className="grow flex flex-col justify-center">
                        <h2 className="font-heading text-xl font-semibold mb-3 text-primary">{title}</h2>
                        <p className="text-sm leading-relaxed text-text-muted text-justify">{description}</p>
                    </div>
                    <div className="mt-6 text-center">
                        <Link
                            to={`/servicios/${slug}`}
                            className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-colors duration-300 hover:bg-primary-hover"
                        >
                            Ver detalles <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlipCard;
