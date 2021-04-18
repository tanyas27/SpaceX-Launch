import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import './Modal.css';

const modal = props => {
    return (
        <>
            <Backdrop show={props.show} clicked={props.modalClosed} />
            <div className="Modal">
            {props.children}
            </div>
        </>
    );
};


export default modal;