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
	const [designIdx, setDesignIdx] = useState(-1);
	const [designZIndex, setDesignZIndex] = useState(-1);
	const [designs, setDesigns] = useState([]);
	/* =========================
		designs = [{
			id: number
			path: string
			posX: number
			posY: number
			width: number
			rotate: number
			dragClass: string, ex: 'draggable', 'no-drag'
			zIndex: number
		}]
	========================= */

	// Variables =================
	const borderWidth = 8;

	// Elements
	const dragContainerRef = useRef(null);
	let designRefs = useRef([null]);

	// Functions =================
	function garmentStyleHandler(event) {
		let value = event.target.value;
		setGarmentStyle(value);
	}

	function garmentColorHandler(event) {
		let value = event.target.value;
		setGarmentColor(value);
	}

	function setNewDesign(image) {
		let nextId = designIdx + 1;
		let nextZIndex = designZIndex + 1;
		setDesignIdx(nextId);
		setDesignZIndex(nextZIndex);
		// add a new design
		setDesigns(
			[
				...designs,
				{
					id: nextId,
					path: image,
					posX: 175,
					posY: 130,
					width: 220,
					rotate: 0,
					dragClass: 'draggable',
					zIndex: nextZIndex
				}
			]
		);
		// clear target element
		setCurDragElem(null);
	}

	function uploadImageClickHandler(event) {
		let imageFile;
		let reader;
		let uploadImage;
		imageFile = event.target.files[0];
		if(!imageFile.type.match('image.*')) {
			alert("This file is not a unsupported image file");
			return;
		}
		reader = new FileReader();
		reader.addEventListener('load', (function() {
			return function(event) {
				uploadImage = event.target.result;
				setNewDesign(uploadImage);
			};
		})(imageFile), false);
		reader.readAsDataURL(imageFile);
	}

	function galleryClickHandler(event) {
		let galleryImagePath = event.target.firstElementChild.src;
		setNewDesign(galleryImagePath);
	}

	function getDesignPosition(design) {
		let parentDistX = dragContainerRef.current.parentElement.getBoundingClientRect().left;
		let artDistX = design.getBoundingClientRect().left;
		let newPosX = artDistX - parentDistX - borderWidth;
		let parentDistY = dragContainerRef.current.parentElement.getBoundingClientRect().top;
		let artDistY = design.getBoundingClientRect().top;
		let updateY = artDistY - parentDistY - borderWidth;
		return { x: newPosX, y: updateY };
	}

	function getCurrentDesign() {
		if (curDragElem == null) {
			let recentDesignAdded = designRefs.current[designRefs.current.length - 1];
			return recentDesignAdded;
		} else {
			return curDragElem
		}
	}

	function sizeClickHandler(event) {
		let currentDesign = getCurrentDesign();
		let currentPos = getDesignPosition(currentDesign);
		let increment = 30;
		let updateWidth;
		let updatePosX;
		let updatePosY;
		// extracting the digits from the width style
		let widthValue = currentDesign.style.width.replace(/\D/g, '');
		// increment based on button clicked
		if (event.target.id == "plus") {
			updateWidth = +widthValue + increment;
			updatePosX = currentPos.x - increment / 2;
			updatePosY = currentPos.y - increment / 2;
		} else if (event.target.id == "minus") {
			updateWidth = +widthValue - increment;
			updatePosX = currentPos.x + increment / 2;
			updatePosY = currentPos.y + increment / 2;
		}
		// update width of current design &
		// update position of current design (to update size from the center)
		setDesigns(designs.map(design => {
			if (design.id == currentDesign.id) {
				return { ...design, width: updateWidth, posX: updatePosX, posY: updatePosY };
			} else {
				return design; // no changes to these item
			}
		}));
	}

	function rotateClickHandler(event) {
		let currentDesign = getCurrentDesign();
		let increment = 15;
		// update rotate value of current design
		if (event.target.id == "rotate-left") {
			setDesigns(designs.map(design => {
				if (design.id == currentDesign.id) {
					let updateRotate = design.rotate - increment;
					return { ...design, rotate: updateRotate };
				} else {
					return design;
				}
			}));
		} else if (event.target.id == "rotate-right") {
			setDesigns(designs.map(design => {
				if (design.id == currentDesign.id) {
					let updateRotate = design.rotate + increment;
					return { ...design, rotate: updateRotate };
				} else {
					return design;
				}
			}));
		}
	}

	function deleteClickHandler(event) {
		// skip if designs are empty
		if (designRefs.current[0] === null) return;
		let currentDesign = getCurrentDesign();
		let currentDesignId = +currentDesign.id;
		// remove current design
		setDesigns(
			designs.filter(design => design.id !== currentDesignId)
		);
		designRefs.current.pop();
		// set current design to last design added
		let lastDesign = designRefs.current[designRefs.current.length - 1];
		setCurDragElem(lastDesign);
	}

	// =======================================
	// Draggable Image functions
	// =======================================
	function dragStartHandler(event) {
		if (event.target == null) return;
		// track current design & cursor start position
		setCurDragElem(event.target.parentElement);
		setStartCursorPos({
			x: event.clientX,
			y: event.clientY
		});
		let nextZIndex = designZIndex + 1;
		setDesignZIndex(nextZIndex);
		// set current design to top z-index
		// set all other designs to not be draggable
		setDesigns(designs.map(design => {
			if (design.id == event.target.id) { // find unique item
				return { ...design, zIndex: nextZIndex }; // update current design
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
		let currentPos = getDesignPosition(curDragElem);
		// update position of art & reset all items to be draggable
		setDesigns(designs.map(design => {
			if (design.id == event.target.id) { // find unique item
				return { ...design, posX: currentPos.x, posY: currentPos.y, dragClass: 'draggable' }; // update target item
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
								<div
									className={`design-image-wrapper ${design.dragClass}`}
									key={idx}
									id={design.id}
									draggable
									ref={(el) => (designRefs.current[idx] = el)}
									style={{left: design.posX, top: design.posY, width: design.width, zIndex: design.zIndex}}
									>
									<img
										src={design.path}
										alt=""
										id={design.id}
										className={`design-image design-${idx} ${design.dragClass}`}
										draggable
										onDragStart={event => dragStartHandler(event, false)}
										style={{transform: `rotate(${design.rotate}deg)`, width: design.width}}
									/>
								</div>
							)}
					</div>
				</section>

				{/* Options Section */}
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

				<div className="option-section sub-section-container images-section">
						{/* Option - Upload an Image */}
						<div className="sub-divider">
							<div className="option-sub-section option-upload-image">
								<label htmlFor="upload-image" className="option-label">Upload your image:</label>
								<input
									id="upload-image"
									onChange={uploadImageClickHandler}
									type="file"
									name="custom-image"
									accept=".png, .jpg, .jpeg, .gif, .webp"/>
							</div>
						</div>
						{/* Option - Image Gallery */}
						<div className="sub-divider">
							<div className="option-sub-section option-image-gallery">
								<label className="option-label">Choose an image:</label>
								<div className="gallery-container">
									{initialGalleryImageData.map((image, idx) =>
										<button
											key={idx}
											type="button"
											className="gallery-image-button"
											onClick={galleryClickHandler}>
											<img
												className={`gallery-image gallery-image-${image.id}`}
												src={image.url}/>
										</button>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="option-section sub-section-container option-size-rotate-delete">
						{/* Option - Size */}
						<div className="sub-divider">
							<div className="option-sub-section option-size">
								<label className="option-label">Art size:</label>
								<button
									id="minus"
									className="option-button"
									onClick={sizeClickHandler}
								>-</button>
								<button
									id="plus"
									className="option-button"
									onClick={sizeClickHandler}
								>+</button>
							</div>
						</div>
						{/* Option - Rotate */}
						<div className="sub-divider">
							<div className="option-sub-section option-rotate">
								<label className="option-label">Rotate art:</label>
								<button
									id="rotate-left"
									className="option-button"
									onClick={rotateClickHandler} >
									<svg className="rotate-icon rotate-left-icon" viewBox="0 0 500 500">
										<path d="M 197,190 C 206,199 198,217 185,217 L 69,217 C 59,217 52,210 52,200 L 52,84 C 52,70 70.5,63.5 79,72 L 113.5,106.5 A 198,198 0 1 1 98,377 C 95,374 95,368.5 98,365.5 L133.5,330 C136.5,327 142.5,327 145.5,330 A 132,132 0 1 0 160.5,153.5 Z"></path>
									</svg>
								</button>
								<button
									id="rotate-right"
									className="option-button"
									onClick={rotateClickHandler} >
									<svg className="rotate-icon rotate-right-icon" viewBox="0 0 500 500">
										<path d="M 197,190 C 206,199 198,217 185,217 L 69,217 C 59,217 52,210 52,200 L 52,84 C 52,70 70.5,63.5 79,72 L 113.5,106.5 A 198,198 0 1 1 98,377 C 95,374 95,368.5 98,365.5 L133.5,330 C136.5,327 142.5,327 145.5,330 A 132,132 0 1 0 160.5,153.5 Z"></path>
									</svg>
								</button>
							</div>
						</div>
						{/* Option - Delete */}
						<div className="sub-divider">
							<div className="option-sub-section option-delete">
								<label className="option-label">Delete:</label>
								<button
									id="delete"
									className="option-button"
									onClick={deleteClickHandler} >
									<svg className="delete-icon" viewBox="0 0 32 32">
										<path d="M25 4h-18c-1.657 0-3 1.343-3 3v1h24v-1c0-1.657-1.343-3-3-3zM19.76 2l0.441 3.156h-8.402l0.441-3.156h7.52zM20 0h-8c-0.825 0-1.593 0.668-1.708 1.486l-0.585 4.185c-0.114 0.817 0.467 1.486 1.292 1.486h10c0.825 0 1.407-0.668 1.292-1.486l-0.585-4.185c-0.114-0.817-0.883-1.486-1.708-1.486v0zM25.5 10h-19c-1.1 0-1.918 0.896-1.819 1.992l1.638 18.016c0.1 1.095 1.081 1.992 2.181 1.992h15c1.1 0 2.081-0.896 2.181-1.992l1.638-18.016c0.1-1.095-0.719-1.992-1.819-1.992zM12 28h-3l-1-14h4v14zM18 28h-4v-14h4v14zM23 28h-3v-14h4l-1 14z" fill="#000000"></path>
									</svg>
								</button>
							</div>
						</div>
					</div>
				</section>

			</main>
		</div>
	);
}
