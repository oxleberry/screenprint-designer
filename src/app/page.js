'use client'
import { useEffect, useState, useRef } from 'react'

import '../styles/globals.scss';


export default function ScreenprintDesigner() {
	// States =================
	const [backgroundColor, setBackgroundColor] = useState('#000000');

	// Functions =================
	function backgroundColorHandler(event) {
		let value = event.target.value;
		setBackgroundColor(value);
	}


	return (
		<div className="full-backboard screenprint-designer-page">
			<h1>Screenprint Designer</h1>
			<main className="screenprint-designer-page">
				<section className="share-content-section">
					<div className="share-content-container" style={{background: `${backgroundColor}`}}>
						<h2 className="hidden">Share Content</h2>
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
				</section>

			</main>
		</div>
	);
}
