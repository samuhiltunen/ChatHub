import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function Message(props) {
    const [showModal, setShowModal] = useState(false);
    const [modalMedia, setModalMedia] = useState('');
    const [isModalVideo, setIsModalVideo] = useState(false);
    const username = localStorage.getItem('username');

    return (
        <div className='message-container' id={props.sender === username ? 'SentByMeTrue':''}>
            <p>{props.text}</p>
            <p>Sent by: {props.sender}</p>
            {props.fileId && props.fileId.map((path, index) => {
                const isImage = path.match(/\.(jpeg|jpg|gif|png)$/i) != null;
                const isVideo = path.match(/\.(mp4|webm|ogg)$/i) != null;
                if (isImage) {
                    return <img key={index} src={`https://${path}`} alt="Uploaded file" style={{maxWidth: '100%', maxHeight: '200px'}} onClick={() => {setShowModal(true); setModalMedia(`https://${path}`); setIsModalVideo(false);}} />
                } else if (isVideo) {
                    return <video key={index} src={`https://${path}`} controls style={{maxWidth: '100%', maxHeight: '200px'}} onClick={() => {setShowModal(true); setModalMedia(`https://${path}`); setIsModalVideo(true);}} />
                } else {
                    return <a key={index} href={`https://${path}`} download>Download file</a>
                }
            })}
            <p>{props.time}</p>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Media Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isModalVideo ? 
                        <video src={modalMedia} controls style={{width: '100%'}} /> :
                        <img src={modalMedia} alt="Uploaded file" style={{width: '100%'}} />
                    }
                </Modal.Body>
            </Modal>
        </div>
    );
}