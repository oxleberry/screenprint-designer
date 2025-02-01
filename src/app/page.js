'use client'
import checkChromeBrowser from '../js/utilities/checkChromeBrowser'
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
			ariaLabel: 'flower design',
		},
		{
			id: 2,
			name: 'sugar-skull',
			url: '/images/sugar-skull.png',
			ariaLabel: 'sugar skull design',
		},
		{
			id: 3,
			name: 'flaming-bunny',
			url: '/images/flaming-bunny.png',
			ariaLabel: 'flaming bunny design',
		}
	]

	const initialFilterData = [
		{
			id: 1,
			name: 'None',
			value: 'normal',
			isActive: true
		},
		{
			id: 2,
			name: 'Lighten',
			value: 'lighten',
			isActive: false
		},
		{
			id: 3,
			name: 'Darken',
			value: 'darken',
			isActive: false
		},
		{
			id: 4,
			name: 'Multiply',
			value: 'multiply',
			isActive: false
		},
		{
			id: 5,
			name: 'Screen',
			value: 'screen',
			isActive: false
		},
		{
			id: 6,
			name: 'Overlay',
			value: 'overlay',
			isActive: false
		},
		{
			id: 7,
			name: 'Hard Light',
			value: 'hard-light',
			isActive: false
		},
		{
			id: 8,
			name: 'Luminosity',
			value: 'luminosity',
			isActive: false
		},
		{
			id: 9,
			name: 'Color Burn',
			value: 'color-burn',
			isActive: false
		}
	]

	// States =================
	const [garmentStyle, setGarmentStyle] = useState('adult-tee');
	const [garmentColor, setGarmentColor] = useState('#1d1d1d');
	const [startCursorPos, setStartCursorPos] = useState({ x: null, y: null});
	const [curDragElem, setCurDragElem] = useState(null);
	const [designIdx, setDesignIdx] = useState(-1);
	const [designZIndex, setDesignZIndex] = useState(-1);
	const [filterButtons, setFilterButtons] = useState(initialFilterData);
	const [isChromeBrowser, setIsChromeBrowser] = useState(false);
	const [canvasSize, setCanvasSize] = useState({});
	const [defaultDesignSpecs, setDefaultDesignSpecs] = useState({});
	const [designs, setDesigns] = useState([]);
	/* =========================
		designs = [{
			id: number
			path: string
			posX: number
			posY: number
			width: number
			rotate: number
			borderRadius: number
			filter: string
			dragClass: string, ex: 'draggable', 'no-drag'
			zIndex: number
		}]
	========================= */

	// Variables =================
	const borderWidth = 8;

	// Elements
	const dragContainerRef = useRef(null);
	let designRefs = useRef([null]);
	const shareFileRef = useRef(null);

	// Functions =================
	function garmentStyleHandler(event) {
		let value = event.target.value;
		setGarmentStyle(value);
	}

	function garmentColorHandler(event) {
		let value = event.target.value;
		setGarmentColor(value);
	}

	function getDefaultSpecs(viewportSize) {
		// scales designs consistently based on viewport size
		const posXScale = .305;
		const posYScale = .25;
		const widthScale = .33;
		const posX = viewportSize * posXScale;
		const posY = viewportSize * posYScale;
		const width = viewportSize * widthScale;
		const defaultSpecs = { posX: posX, posY: posY, width: width };
		return defaultSpecs;
	}

	function setDefaultDesignSizeAndPosition() {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;
		const designLayoutWidthLarge = 600;
		const designLayoutWidthMedium = 400;
		const designLayoutWidthSmall = 300;
		let tempDefaultDesignSpecs;
		let tempCanvasSize;
		if (viewportWidth >= 1200 && viewportHeight >= 900) {
			tempDefaultDesignSpecs = getDefaultSpecs(designLayoutWidthLarge);
			tempCanvasSize = { width: 584, height: 682 } // set canvas size to match design layout
		} else if (viewportWidth >= 680 && viewportHeight >= 700) {
			tempDefaultDesignSpecs = getDefaultSpecs(designLayoutWidthMedium);
			tempCanvasSize = { width: 384, height: 466 } // set canvas size to match design layout
		} else {
			tempDefaultDesignSpecs = getDefaultSpecs(designLayoutWidthSmall);
			tempCanvasSize = { width: 284, height: 345 } // set canvas size to match design layout
		}
		setDefaultDesignSpecs(tempDefaultDesignSpecs);
		setCanvasSize(tempCanvasSize);
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
					posX: defaultDesignSpecs.posX,
					posY: defaultDesignSpecs.posY,
					width: defaultDesignSpecs.width,
					rotate: 0,
					borderRadius: 0,
					filter: 'normal',
					dragClass: 'draggable',
					zIndex: nextZIndex
				}
			]
		);
		// clear target element
		setCurDragElem(null);
		// reset filter buttons to default filter
		setFilterButtons(filterButtons.map(filter => {
			if (filter.value == 'normal') {
				return { ...filter, isActive: true };
			} else {
				return { ...filter, isActive: false };
			}
		}));
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

	function roundedCornersClickHandler(event) {
		let currentDesign = getCurrentDesign();
		let increment = 20;
		let updateBorderRadius;
		// update rounded corners value of current design
		if (event.target.id == "decrease") {
			setDesigns(designs.map(design => {
				if (design.id == currentDesign.id) {
					// if border radius is at zero, no need to decrease further
					if (design.borderRadius == 0) {
						return design;
					} else {
						updateBorderRadius = design.borderRadius - increment;
						return { ...design, borderRadius: updateBorderRadius };
					}
				} else {
					return design;
				}
			}));
		} else if (event.target.id == "increase") {
			setDesigns(designs.map(design => {
				if (design.id == currentDesign.id) {
					// cap the border radius to half the image width, , no need to increase further
					if (design.borderRadius > design.width / 2) {
						return design;
					} else {
						updateBorderRadius = design.borderRadius + increment;
						return { ...design, borderRadius: updateBorderRadius };
					}
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
		// remove all filters status
		setFilterButtons(filterButtons.map(filter => {
			return { ...filter, isActive: false };
		}));
	}

	function filterClickHandler(event) {
		let currentDesign = getCurrentDesign();
		// update filter style of current design
		setDesigns(designs.map(design => {
			if (design.id == currentDesign.id) {
				return { ...design, filter: event.target.id };
			} else {
				return design;
			}
		}));
		// update current filter button to be active
		setFilterButtons(filterButtons.map(filter => {
			if (filter.value == event.target.value) {
				return { ...filter, isActive: true };
			} else {
				return { ...filter, isActive: false };
			}
		}));
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
		let designFilter;
		let nextZIndex = designZIndex + 1;
		setDesignZIndex(nextZIndex);
		// set current design to top z-index
		// set all other designs to not be draggable
		const designsByZindexOrder = designs.map((design) => {
			if (design.id == event.target.id) { // find unique item
				return { ...design, zIndex: nextZIndex }; // update current design
			} else {
				return { ...design, dragClass: 'no-drag' }; // update all other items
			}
		});
		// reorder by z-index, for drawing the correct order on to the canvas
		designsByZindexOrder.sort((a,b) => a.zIndex - b.zIndex);
		setDesigns(designsByZindexOrder);
		// set filter buttons to filter type of current design
		setFilterButtons(filterButtons.map(filter => {
			if (filter.value == designFilter) {
				return { ...filter, isActive: true };
			} else {
				return { ...filter, isActive: false };
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

	function touchMoveHandler(event) {
		if (event.target == null) return;
		event.preventDefault();
		let currentDesign = designs.find(design => design.id == event.target.id);
		if (currentDesign == undefined) return;
		// calculate new position
		const touchLocation = event.targetTouches[0];
		curDragElem.style.left = (touchLocation.clientX - 100) + 'px';
		curDragElem.style.top = (touchLocation.clientY - 150) + 'px';
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

	// =======================================
	// Share Card functions
	// =======================================
	function createCanvas() {
		const canvas = document.createElement('canvas');
		canvas.width = canvasSize.width;
		canvas.height = canvasSize.height;
		const context = canvas.getContext('2d');
		context.save(); // Save the current state
		context.fillStyle = garmentColor;
		context.fillRect(0, 0, canvasSize.width, canvasSize.height);
		context.restore(); // Restore to the state saved by the most recent call to save()
		shareFileRef.current.prepend(canvas); // display canvas for testing
		return canvas;
	}

	function drawGarmentToCanvas(canvas) {
		const tee = document.querySelector(".tee-image");
		const teeWidth = tee.getBoundingClientRect().width;
		const teeHeight = tee.getBoundingClientRect().height;
		const context = canvas.getContext('2d');
		context.drawImage(tee, 0, 0, teeWidth, teeHeight);
	}

	function drawDesignsToCanvas(canvas) {
		designRefs.current.map(((designElement, idx) => {
			const image = designElement.firstElementChild;
			const imageWidth = designElement.getBoundingClientRect().width;
			const imageHeight = designElement.getBoundingClientRect().height;
			const design = designs[idx];
			const context = canvas.getContext('2d');
			context.save();
			rotateDesign(context, design, imageWidth, imageHeight);
			applyFilter(context, design);
			drawRoundedCorners(context, design, imageWidth, imageHeight);
			context.drawImage(image, design.posX, design.posY, imageWidth, imageHeight);
			context.restore();
		}))
	}

	function rotateDesign(context, design, imageWidth, imageHeight) {
		const centerX = (imageWidth / 2) + design.posX;
		const centerY = (imageHeight / 2) + design.posY;
		context.translate(centerX, centerY);
		context.rotate((design.rotate * Math.PI) / 180);
		context.translate(-centerX, -centerY);
	}

	function applyFilter(context, design) {
		// context.globalCompositeOperation = 'overlay'; // not an exact match
		// context.filter = "grayscale(1)"; // NOTE: does not work on Safari
		context.globalCompositeOperation = design.filter;
	}

	function drawRoundedCorners(context, design, imageWidth, imageHeight) {
		const left = design.posX;
		const top = design.posY;
		const width = imageWidth + left;
		const height = imageHeight + top;
		let cornerRadius = design.borderRadius;
		// cap the rounded corner to half the image width or height (whichever is smaller)
		if (cornerRadius > imageWidth / 2 || cornerRadius > imageHeight / 2) {
			let maxBorderRadius = Math.min(imageWidth / 2, imageHeight / 2);
			cornerRadius = maxBorderRadius;
		}
		context.beginPath();
		context.moveTo(cornerRadius, top);
		context.arcTo(width, top, width, height, cornerRadius);
		context.arcTo(width, height, left, height, cornerRadius);
		context.arcTo(left, height, left, top, cornerRadius);
		context.arcTo(left, top, width, top, cornerRadius);
		context.closePath();
		context.clip();
	}

	function shareFile(canvas) {
		// canvasToPng
		const dataUrl = canvas.toDataURL();
		fetch(dataUrl)
			.then(res => res.blob())
			.then(blob => {
				const fileName = `oxleberry-screenprint-design-${new Date().getTime()}.png`
				const file = new File([blob], fileName, {
					type: blob.type,
					lastModified: new Date().getTime()
				});
				// shareFile
				const files = [file];
				const data = { files };
				if (navigator.canShare && navigator.canShare({ files })) {
					return navigator.share(data);
				} else {
					console.warn('Sharing failed.');
				}
			})
			.catch(() => {
				console.warn('Canvas to Png failed.');
			})
	}

	function shareCardClickHandler() {
		const canvas = createCanvas();
		if (designRefs.current[0] !== null) {
			drawDesignsToCanvas(canvas);
		};
		drawGarmentToCanvas(canvas);
		shareFile(canvas);
	}


	// Initial Page Load =================
	useEffect(() => {
		const isChrome = checkChromeBrowser();
		setIsChromeBrowser(isChrome);
		setDefaultDesignSizeAndPosition();
	}, []);

	// ============================
	// Event Listeners
	// ============================
	useEffect(() => {
		window.addEventListener('resize', setDefaultDesignSizeAndPosition);
		// clean up function, remove event listener
		return () => {
			window.removeEventListener('resize', setDefaultDesignSizeAndPosition);
		}
	}, []);


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
						onTouchMove={event => touchMoveHandler(event, false)}
						onTouchEnd={event => dragDropHandler(event, false)}
						style={{background: garmentColor, borderWidth: `${borderWidth}px`}}
					>
						<h2 className="hidden">Design layout workspace</h2>
						<img className="tee-image" src={`/images/${garmentStyle}.png`} alt="screenprint designer workspace" crossOrigin="anonymous"/>
						{designs.map((design, idx) =>
							<div
								className={`design-image-wrapper ${design.dragClass}`}
								key={idx}
								id={design.id}
								draggable
								ref={(el) => (designRefs.current[idx] = el)}
								style={{left: design.posX, top: design.posY, width: design.width, mixBlendMode: design.filter, zIndex: design.zIndex}}
								>
								<img
									src={design.path}
									alt=""
									id={design.id}
									className={`design-image design-${idx} ${design.dragClass}`}
									draggable
									onDragStart={event => dragStartHandler(event, false)}
									onTouchStart={event => dragStartHandler(event, false)}
									style={{
										transform: `rotate(${design.rotate}deg)`,
										width: design.width,
										borderRadius: `${design.borderRadius}px`
									}}
									crossOrigin='anonymous'
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
											onClick={galleryClickHandler}
											aria-label={image.ariaLabel}>
											<img
												className={`gallery-image gallery-image-${image.id}`}
												src={image.url}/>
										</button>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="option-section sub-section-container art-manipulation-section">
						{/* Option - Size */}
						<div className="sub-divider">
							<div className="option-sub-section option-size">
								<label className="option-label">Art size:</label>
								<div className="row">
									<button
										id="minus"
										className="option-button"
										onClick={sizeClickHandler}
										aria-label="decrease art size">
										<span className="minus-icon">-</span>
									</button>
									<button
										id="plus"
										className="option-button"
										onClick={sizeClickHandler}
										aria-label="increase art size">
										<span className="plus-icon">+</span>
									</button>
								</div>
							</div>
						</div>
						{/* Option - Rotate */}
						<div className="sub-divider">
							<div className="option-sub-section option-rotate">
								<label className="option-label">Rotate art:</label>
								<div className="row">
									<button
										id="rotate-left"
										className="option-button"
										onClick={rotateClickHandler}
										aria-label="rotate art left">
										<svg className="rotate-icon rotate-left-icon" viewBox="0 0 500 500">
											<path d="M 197,190 C 206,199 198,217 185,217 L 69,217 C 59,217 52,210 52,200 L 52,84 C 52,70 70.5,63.5 79,72 L 113.5,106.5 A 198,198 0 1 1 98,377 C 95,374 95,368.5 98,365.5 L133.5,330 C136.5,327 142.5,327 145.5,330 A 132,132 0 1 0 160.5,153.5 Z"></path>
										</svg>
									</button>
									<button
										id="rotate-right"
										className="option-button"
										onClick={rotateClickHandler}
										aria-label="rotate art right">
										<svg className="rotate-icon rotate-right-icon" viewBox="0 0 500 500">
											<path d="M 197,190 C 206,199 198,217 185,217 L 69,217 C 59,217 52,210 52,200 L 52,84 C 52,70 70.5,63.5 79,72 L 113.5,106.5 A 198,198 0 1 1 98,377 C 95,374 95,368.5 98,365.5 L133.5,330 C136.5,327 142.5,327 145.5,330 A 132,132 0 1 0 160.5,153.5 Z"></path>
										</svg>
									</button>
								</div>
							</div>
						</div>
						{/* Option - Rounded Corners */}
						<div className="sub-divider">
							<div className="option-sub-section option-border-radius">
								<label className="option-label">Rounded Corners:</label>
								<div className="row">
									<button
										id="decrease"
										className="option-button"
										onClick={roundedCornersClickHandler}
										aria-label="decrease rounded corners"
									><span className="minus-icon">-</span></button>
									<button
										id="increase"
										className="option-button"
										onClick={roundedCornersClickHandler}
										aria-label="increase rounded corners"
									><span className="plus-icon">+</span></button>
								</div>
							</div>
						</div>
						{/* Option - Delete */}
						<div className="sub-divider">
							<div className="option-sub-section option-delete">
								<label className="option-label">Delete:</label>
								<button
									id="delete"
									className="option-button"
									onClick={deleteClickHandler}
									aria-label="delete art">
									<svg className="delete-icon" viewBox="0 0 32 32">
										<path d="M25 4h-18c-1.657 0-3 1.343-3 3v1h24v-1c0-1.657-1.343-3-3-3zM19.76 2l0.441 3.156h-8.402l0.441-3.156h7.52zM20 0h-8c-0.825 0-1.593 0.668-1.708 1.486l-0.585 4.185c-0.114 0.817 0.467 1.486 1.292 1.486h10c0.825 0 1.407-0.668 1.292-1.486l-0.585-4.185c-0.114-0.817-0.883-1.486-1.708-1.486v0zM25.5 10h-19c-1.1 0-1.918 0.896-1.819 1.992l1.638 18.016c0.1 1.095 1.081 1.992 2.181 1.992h15c1.1 0 2.081-0.896 2.181-1.992l1.638-18.016c0.1-1.095-0.719-1.992-1.819-1.992zM12 28h-3l-1-14h4v14zM18 28h-4v-14h4v14zM23 28h-3v-14h4l-1 14z" fill="#000000"></path>
									</svg>
								</button>
							</div>
						</div>
					</div>

					{/* Option - Filters */}
					<div className="option-section option-filters">
						<label className="option-label">Filters:</label>
						<div className="option-filter-list">
							{filterButtons.map((filter, idx) =>
								<button
									key={idx}
									id={filter.value}
									className={`option-button-filter${filter.isActive ? ' active' : ''}`}
									value={filter.value}
									onClick={filterClickHandler}>
										{filter.name}
								</button>
							)}
						</div>
					</div>

					{/* Share Card Button */}
					{/* Do not show on Chrome where share navigator is not supported */}
					{isChromeBrowser
					?
						""
					:
						<div className="option-section option-share">
							<button
								type="button"
								className="share-button"
								onClick={shareCardClickHandler}
							>Share Design
							</button>
						</div>
					}
				</section>

				{/* For testing purposes to display Share Card canvas */}
				<section
					id="canvas-container"
					className="canvas-container"
					ref={shareFileRef}
				></section>

			</main>
		</div>
	);
}
