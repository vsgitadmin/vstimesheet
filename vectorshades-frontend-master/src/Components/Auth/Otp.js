import React, { useEffect, useRef } from 'react';

const Otp = ({onChange}) => {
    const box1 = useRef();
    const box2 = useRef();
    const box3 = useRef();
    const box4 = useRef();

    const focusNextBox = (currentBox, nextBox) => {
        if (currentBox.current.value.length === 1) {
            nextBox.current.focus();
        }
    };

    const focusPreviousBox = (currentBox, previousBox) => {
        if (currentBox.current.value.length === 0) {
            previousBox.current.focus();
        }
    };

    const handleInput = (currentBox, nextBox, previousBox) => {
        return (event) => {
            if (event.target.value.length === 1) {
                focusNextBox(currentBox, nextBox);
            } else if (event.target.value.length === 0) {
                focusPreviousBox(currentBox, previousBox);
            }
        };
    };

    const handleKeyDown = (currentBox, previousBox) => {
        return (event) => {
            if (event.key === 'Backspace' && previousBox.current.value.length === 0) {
                focusPreviousBox(currentBox, previousBox);
            }
        };
    };

    useEffect(() => {
        box1.current.addEventListener('input', handleInput(box1, box2, box1));
        box2.current.addEventListener('input', handleInput(box2, box3, box1));
        box3.current.addEventListener('input', handleInput(box3, box4, box2));
        box4.current.addEventListener('input', handleInput(box4, box4, box3));

        box2.current.addEventListener('keydown', handleKeyDown(box2, box1));
        box3.current.addEventListener('keydown', handleKeyDown(box3, box2));
        box4.current.addEventListener('keydown', handleKeyDown(box4, box3));

        return () => {
            box1.current?.removeEventListener('input', handleInput(box1, box2, box1));
            box2.current?.removeEventListener('input', handleInput(box2, box3, box1));
            box3.current?.removeEventListener('input', handleInput(box3, box4, box2));
            box4.current?.removeEventListener('input', handleInput(box4, box4, box3));

            box2.current?.removeEventListener('keydown', handleKeyDown(box2, box1));
            box3.current?.removeEventListener('keydown', handleKeyDown(box3, box2));
            box4.current?.removeEventListener('keydown', handleKeyDown(box4, box3));
        };
    }, []);

    const handleChange = () =>{
        onChange(box1.current.value+box2.current.value+box3.current.value+box4.current.value)
    }

    return (
        <div className='pin_container'>
            <div>
                <label>Enter Otp</label>
                <p>Enter your 4 digit otp, sented to your email</p>
            </div>
            <div>
                <input onChange={handleChange} ref={box1} type="number" maxLength="1" />
                <input onChange={handleChange} ref={box2} type="number" maxLength="1" />
                <input onChange={handleChange} ref={box3} type="number" maxLength="1" />
                <input onChange={handleChange} ref={box4} type="number" maxLength="1" />
            </div>
        </div>
    );
};

export default Otp;
