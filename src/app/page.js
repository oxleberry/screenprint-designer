'use client'
import { useEffect, useState, useRef } from 'react'

import '../styles/globals.scss';


export default function ScreenprintDesigner() {
	const initialGalleryImageData = [
		{
			id: 1,
			name: 'sakura-flower',
			url: '/images/sakura-flower.png',
		},
		{
			id: 2,
			name: 'sugar-skull',
			url: '/images/sugar-skull.png',
		},
		{
			id: 3,
			name: 'flaming-bunny',
			url: '/images/flaming-bunny.png',
		}
	]

	// States =================
	const [garmentStyle, setGarmentStyle] = useState('adult-tee');
	const [backgroundColor, setBackgroundColor] = useState('#000000');
	const [galleryImagePath, setGalleryImagePath] = useState('');

	// Functions =================
	function backgroundColorHandler(event) {
		let value = event.target.value;
		setBackgroundColor(value);
	}

	function galleryClickHandler(event) {
		let imagePath = event.target.src;
		setGalleryImagePath(imagePath);
	}

	return (
		<div className="full-backboard screenprint-designer-page">
			<h1>Screenprint Designer</h1>
			<main className="screenprint-designer-page">

				{/* Design layout container */}
				<section className="design-layout-section">
					<div
						className="design-layout-container"
						style={{background: `${backgroundColor}`}}
					>
						<h2 className="hidden">Design layout workspace</h2>
						<img className="tee-image" src={`/images/${garmentStyle}.png`} alt="screenprint designer workspace"/>
						<div className="image-display" style={{backgroundImage: `url(${galleryImagePath})`}} />
					</div>
				</section>

				{/* Option Section */}
				<section className="options-container">
					<h2 className="hidden">Options</h2>
					{/* Option Pick a Color */}
					<div className="option option-color">
						<label htmlFor="custom-color" className="option-label">Pick a background color:</label>
						<input
							id="custom-color"
							className="custom-color"
							name="custom-color"
							type="color"
							value={backgroundColor}
							onChange={backgroundColorHandler}
						/>
					</div>
					{/* Option Galley Image */}
					<div className="option option-image">
						<label className="option-label">Choose an image:</label>
						<div className="gallery-container">
							{initialGalleryImageData.map((image, idx) =>
								<button
									key={idx}
									type="button"
									className="gallery-image-button button-black"
									onClick={galleryClickHandler}>
									<img
										className={`gallery-image gallery-image-${image.id}`}
										src={image.url}/>
								</button>
							)}
						</div>
					</div>
				</section>

			</main>
		</div>
	);
}
