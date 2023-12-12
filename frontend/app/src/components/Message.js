import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function Message(props) {
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const username = localStorage.getItem('username');
    console.log(props.fileId);

    return (
        <div className='message-container' id={props.sender === username ? 'SentByMeTrue':''}>
            <p>{props.text}</p>
            {props.fileId && props.fileId.map((path, index) => {
                const isImage = path.match(/\.(jpeg|jpg|gif|png)$/i) != null;
                return isImage ? 
                    <img key={index} src={`https://${path}`} alt="Uploaded file" style={{maxWidth: '100%', maxHeight: '200px'}} onClick={() => {setShowModal(true); setModalImage(`https://${path}`);}} /> :
                    <a key={index} href={`https://${path}`} download>Download file</a>
            })}
            <p>{props.time}</p>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={modalImage} alt="Uploaded file" style={{width: '100%'}} />
                </Modal.Body>
            </Modal>
        </div>
    );
}