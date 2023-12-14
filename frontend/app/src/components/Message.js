import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

export default function Message(props) {
    const [showModal, setShowModal] = useState(false);
    const [modalMedia, setModalMedia] = useState('');
    const [isModalVideo, setIsModalVideo] = useState(false);
    const username = localStorage.getItem('username');
    let formattedTime = new Date(props.time).toLocaleString();

    return (
        <div className={'whole-message-container'} id={props.sender === username ? 'SentByMeTrue' : ''}>
            <div className='message-container' id={props.sender === username ? 'SentByMeTrue' : ''}>
                <p style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap', maxWidth: '100%' }}>{props.text}</p>

                {props.files && props.files.map((file, index) => {
                    const path = file.path;
                    const isImage = path.match(/\.(jpeg|jpg|gif|png)$/i) != null;
                    const isVideo = path.match(/\.(mp4|webm|ogg)$/i) != null;
                    if (isImage) {
                        return <img key={index} src={`https://${path}`} alt="Uploaded file" style={{ maxWidth: '100%', maxHeight: '200px' }} onClick={() => { setShowModal(true); setModalMedia(`https://${path}`); setIsModalVideo(false); }} />
                    } else if (isVideo) {
                        return <video key={index} src={`https://${path}`} controls style={{ maxWidth: '100%', maxHeight: '200px' }} onClick={() => { setShowModal(true); setModalMedia(`https://${path}`); setIsModalVideo(true); }} />
                    } else {
                        return (
                            <div>
                                <p>Name: {file.name}</p>
                                <p>Size: {file.size}</p>
                                <a key={index} href={`https://${path}`} download>Download</a>
                            </div>
                        )
                    }
                })}

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Media Preview</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {isModalVideo ?
                            <video src={modalMedia} controls style={{ width: '100%' }} /> :
                            <img src={modalMedia} alt="Uploaded file" style={{ width: '100%' }} />
                        }
                    </Modal.Body>
                </Modal>
            </div>
            <div className={'sender-info-container'} id={props.sender === username ? 'SentByMeTrueForMessage' : ''}  >
                <p>{props.sender}  </p>
                <p>{formattedTime}</p>
            </div>
        </div>
    );
}