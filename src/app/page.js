'use client'
import { useEffect, useState, useRef } from 'react'

import '../styles/globals.scss';


export default function ScreenprintDesigner() {
	const initialGarmentStyleData = [
		{
			id: 1,
			name: 'Adult',
			value: 'adult-tee',
			isActive: true
		},
		{
			id: 2,
			name: 'Womens',
			value: 'womens-tee',
			isActive: false
		},
		{
			id: 3,
			name: 'Onesie',
			value: 'onesie',
			isActive: false
		}
	]

	const initialGarmentColorData = [
		{
			id: 1,
			name: 'black',
			value: '#1d1d1d',
			isActive: true
		},
		{
			id: 2,
			name: 'red',
			value: '#d41b02',
			isActive: false
		},
		{
			id: 3,
			name: 'gold',
			value: '#ffaa00',
			isActive: false
		},
		{
			id: 4,
			name: 'olive',
			value: '#5f6e1f',
			isActive: false
		},
		{
			id: 5,
			name: 'navy',
			value: '#022c59',
			isActive: false
		},
		{
			id: 6,
			name: 'pink',
			value: '#ffade2',
			isActive: false
		},
		{
			id: 7,
			name: 'charcoal',
			value: '#4d4b49',
			isActive: false
		},
		{
			id: 8,
			name: 'tan',
			value: '#cbb699',
			isActive: false
		},
		{
			id: 9,
			name: 'grey',
			value: '#bfbebb',
			isActive: false
		},
		{
			id: 10,
			name: 'white',
			value: '#fff',
			isActive: false
		}
	]

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
	const [garmentColor, setGarmentColor] = useState('#1d1d1d');
	const [galleryImagePath, setGalleryImagePath] = useState('');

	// Functions =================
	function garmentStyleHandler(event) {
		let value = event.target.value;
		setGarmentStyle(value);
	}

	function garmentColorHandler(event) {
		let value = event.target.value;
		setGarmentColor(value);
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
						style={{background: garmentColor}}
					>
						<h2 className="hidden">Design layout workspace</h2>
						<img className="tee-image" src={`/images/${garmentStyle}.png`} alt="screenprint designer workspace"/>
						<div className="image-display" style={{backgroundImage: `url(${galleryImagePath})`}} />
					</div>
				</section>

				{/* Option Section */}
				<section className="options-container">
					<h2 className="hidden">Options</h2>
					{/* Option - Garment style */}
					<div className="option-section option-garment-style">
						<legend className="option-label">Garment style:</legend>
						{initialGarmentStyleData.map((garment, idx) =>
							<div key={idx} className="option-garment">
								<input
									id={garment.value}
									className="custom-garment"
									name="custom-garment"
									type="radio"
									value={garment.value}
									defaultChecked={garment.isActive}
									onChange={garmentStyleHandler}
								/>
								<label htmlFor={garment.value} className="option-label">{garment.name}</label>
							</div>
						)}
					</div>

					{/* Option - Garment Color */}
					<div className="option-section option-garment-color">
						<legend className="option-label">Garment color:</legend>
						{initialGarmentColorData.map((color, idx) =>
							<div key={idx} className="option-color">
								<input
									id={`color-${color.name}`}
									className={`color-${color.name}`}
									name="color-selector"
									type="radio"
									value={color.value}
									defaultChecked={color.isActive}
									onChange={garmentColorHandler}
									style={{background: color.value}}
								/>
								<label htmlFor={`color-${color.name}`} className="option-label">{color.name}</label>
							</div>
						)}
						<div className="option-color">
							<input
								id="color-custom"
								className="color-custom"
								name="color-custom"
								type="color"
								defaultValue="#9daec1"
								onChange={garmentColorHandler}
							/>
							<label htmlFor="custom-color" className="option-label">Custom</label>
						</div>
					</div>

					{/* Option Galley Image */}
					<div className="option-section option-image">
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
