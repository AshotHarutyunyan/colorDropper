import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PreviewColor } from '../PreviewColor/PreviewColor';
import { rgbToHex } from '../../helpers/rgbToHex';
import { PickerIcon } from '../../assets/icons/PickerIcon';
import image from '../../assets/images/1920x1080-4598441-beach-water-pier-tropical-sky-sea-clouds-island-palm-trees.jpg'

import './ColorDropper.css';

export const ColorDropper: React.FC = () => {
    const [pickedColor, setPickedColor] = useState<string>('#FFFFFF');
    const [previewColor, setPreviewColor] = useState<string>('#FFFFFF');
    const [isDropping, setIsDropping] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const dropperIconRef = useRef<SVGSVGElement | undefined>(undefined); 

    const handleMouseMove = useCallback((event: any) => {
        if (isDropping) {
            const canvas = canvasRef.current;
            const context = canvas!.getContext('2d');
            const rect = canvas!.getBoundingClientRect();
            const x =  event.clientX - rect.left;
            const y =  event.clientY - rect.top;
            const imageData = context!.getImageData(x, y, 1, 1).data;
            const hexColor = rgbToHex(imageData[0], imageData[1], imageData[2]);
            dropperIconRef.current!.style.left = `${window.scrollX + event.clientX}px`;
            dropperIconRef.current!.style.top = `${window.scrollY + event.clientY}px`;
            setPreviewColor(hexColor);
        }
    }, [isDropping]);

    const handleClick = (event: any) => {
        if (isDropping) {
            const canvas = canvasRef.current;
            const context = canvas!.getContext('2d');
            const rect = canvas!.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const imageData = context!.getImageData(x, y, 1, 1).data;
            const hexColor = rgbToHex(imageData[0], imageData[1], imageData[2]);
            setPickedColor(hexColor);
            setIsDropping(false);
            dropperIconRef.current!.style.display = 'none';
            canvas!.style.cursor = 'default';
        }
    };

    const enableColorDropper = () => {
        setIsDropping(true);
        dropperIconRef.current!.style.display = 'block';
        canvasRef.current!.style.cursor = 'none';
    };


    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext('2d');
            const img = new Image();
            img.src = image;
        
            img.onload = () => {
              context?.drawImage(img, 0, 0);
            };

            // // Initialize the canvas with some colors you can open this and close image render to 
            // // check the functionality with color pallet
            // for (let i = 0; i < canvas.width; i += 100) {
            //     for (let j = 0; j < canvas.height; j += 100) {
            //         context!.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            //         context!.fillRect(i, j, 100, 100);
            //     }
            // }
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const rect = dropperIconRef.current?.getBoundingClientRect();
            if(rect && rect.top < 0) {
                handleMouseMove({
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.height / 2,
                });
            } 
            if(rect && rect.left < 0) {
                handleMouseMove({
                    clientX: rect.width / 2,
                    clientY: rect.top + rect.height / 2,
                });
            }
            if(rect && rect.top + rect.height > window.innerHeight){
                handleMouseMove({
                    clientX: rect.left + rect.width / 2,
                    clientY: window.innerHeight - rect.height / 2,
                });
            }
            if(rect && rect.left + rect.width > window.innerWidth){
                handleMouseMove({
                    clientX: window.innerWidth - rect.width / 2,
                    clientY: rect.top + rect.height / 2,
                });
            }
        };

        if(isDropping){
            window.addEventListener('scroll', handleScroll)
        }

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [isDropping, handleMouseMove])

    return (
        <>
            <div className="header">
                <PickerIcon className='pickerIcon' onClick={enableColorDropper} />
                <h1 className='title'>
                    Picked Color: <span id="picked-color">{pickedColor}</span>
                </h1>
            </div>
            <canvas
                id="canvas"
                ref={canvasRef}
                width={4000}
                height={4000}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            ></canvas>
            <PreviewColor
                fill={previewColor}
                refer={dropperIconRef}
            />
        </>
    );
};

ColorDropper.displayName = 'ColorDropper';