import { useState } from 'react';
import '../styles/carousel.scss'
import { AddImage, ArrowLeft, ArrowRight, Delete } from './icons/Icons';
import printVarsHook from './printVarsHook';


const Carousel = ({ images, onDeleteImage }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);

	
	printVarsHook(currentImageIndex, "currentImageIndex")

	const deleteImage = (e) => {
		e.stopPropagation()
		onDeleteImage(currentImageIndex)
		setCurrentImageIndex(0)
	}


	const nextImage = (e) => {
		e.stopPropagation()
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	const prevImage = (e) => {
		e.stopPropagation()
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		);
	};

	return (
		<div className="carousel">
			<div className='button delete' onClick={deleteImage}><Delete/></div>
			{images.length > 1 && <>
			<div className='button prev' onClick={prevImage}><ArrowLeft/></div>
			<div className='button next' onClick={nextImage}><ArrowRight/></div>
			</>
			}
				{images.map((src, index) => (
					<img
						key={index}
						className={`slide ${index === currentImageIndex ? 'active' : ''}`}
						src={src}
						alt={`slide ${index + 1}`}
					/>
				))}
		</div>
	);
};

export default Carousel;