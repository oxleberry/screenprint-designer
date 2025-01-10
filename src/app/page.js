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
	const [startCursorPos, setStartCursorPos] = useState({ x: null, y: null});
	const [curDragElem, setCurDragElem] = useState(null);
	const [designs, setDesigns] = useState([]);
	const [designIdx, setDesignIdx] = useState(-1);

	// Variables =================
	const borderWidth = 8;

	// Elements
	const dragContainerRef = useRef(null);
	let designRefs = useRef([]);

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
		let nextId = designIdx + 1;
		setDesignIdx(nextId);
		// add a new design
		setDesigns(
			[
				...designs,
				{
					id: nextId,
					path: imagePath,
					posX: 175,
					posY: 130,
					width: 220,
					dragClass: 'draggable'
				}
			]
		);
		// clear target element
		setCurDragElem(null);
	}

	function sizeClickHandler(event) {
		let currentDesign;
		if (curDragElem == null) {
			// if design has not been dragged, use most recent picked image
			let recentDesignAdded = designRefs.current[designRefs.current.length - 1];
			currentDesign = recentDesignAdded;
		} else {
			currentDesign = curDragElem;
		}
		let increment = 30;
		let updateWidth;
		// increment based on button clicked
		if (event.target.id == "plus") {
			updateWidth = currentDesign.width + increment;
		} else if (event.target.id == "minus") {
			updateWidth = currentDesign.width - increment;
		}
		// update width of current design
		setDesigns(designs.map(design => {
			if (design.id == currentDesign.id) {
				return { ...design, width: updateWidth };
			} else {
				return design;
			}
		}));
	}

	// =======================================
	// Draggable Image functions
	// =======================================
	function dragStartHandler(event) {
		if (event.target == null) return;
		// track current design & cursor start position
		setCurDragElem(event.target);
		setStartCursorPos({
			x: event.clientX,
			y: event.clientY
		});
		// set all other designs to not be draggable
		setDesigns(designs.map(design => {
			if (design.id == event.target.id) { // find unique item
				return design; // no changes to target item
			} else {
				return { ...design, dragClass: 'no-drag' }; // update all other items
			}
		}));
	}

	function dragOverHandler(event) {
		if (event.target == null) return;
		event.preventDefault();
		let currentDesign = designs.find(design => design.id == event.target.id);
		if (currentDesign == undefined) return;
		// calculate new position
		let cursorX = event.clientX;
		let cursorY = event.clientY;
		let distanceX = cursorX - startCursorPos.x;
		let distanceY = cursorY - startCursorPos.y;
		curDragElem.style.left = currentDesign.posX + distanceX + 'px';
		curDragElem.style.top = currentDesign.posY + distanceY + 'px';
	}

	function dragDropHandler(event) {
		if (event.target == null) return;
		event.preventDefault();
		let parentDistX = dragContainerRef.current.getBoundingClientRect().left;
		let artDistX = curDragElem.getBoundingClientRect().left;
		let newPosX = artDistX - parentDistX - borderWidth;
		let parentDistY = dragContainerRef.current.getBoundingClientRect().top;
		let artDistY = curDragElem.getBoundingClientRect().top;
		let newPosY = artDistY - parentDistY - borderWidth;
		// update position of art & reset all items to be draggable
		setDesigns(designs.map(design => {
			if (design.id == event.target.id) { // find unique item
				return { ...design, posX: newPosX, posY: newPosY, dragClass: 'draggable' }; // update target item
			} else {
				return { ...design, dragClass: 'draggable' }; // update all other items
			}
		}));
	}

	return (
		<div className="full-backboard screenprint-designer-page">
			<h1>Screenprint Designer</h1>
			<main className="screenprint-designer-page">

				{/* Design layout container */}
				<section className="design-layout-section">
					<div
						className="design-layout-container"
						ref={dragContainerRef}
						onDragOver={event => dragOverHandler(event, false)}
						onDrop={event => dragDropHandler(event, false)}
						style={{background: garmentColor, borderWidth: `${borderWidth}px`}}
					>
						<h2 className="hidden">Design layout workspace</h2>
						<img className="tee-image" src={`/images/${garmentStyle}.png`} />
						{designs.map((design, idx) =>
							<img
								src={design.path}
								alt=""
								key={idx}
								id={idx}
								className={`design-image design-${idx} ${design.dragClass}`}
								ref={(el) => (designRefs.current[idx] = el)}
								draggable
								onDragStart={event => dragStartHandler(event, false)}
								style={{left: design.posX, top: design.posY, width: design.width}}
							/>
						)}
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

					{/* Option - Size */}
					<div className="option-section option-size">
						<label className="option-label">Art size:</label>
						<button
							id="minus"
							className="size-control"
							onClick={sizeClickHandler}
						>-</button>
						<button
							id="plus"
							className="size-control"
							onClick={sizeClickHandler}
						>+</button>
					</div>
				</section>

			</main>
		</div>
	);
}
