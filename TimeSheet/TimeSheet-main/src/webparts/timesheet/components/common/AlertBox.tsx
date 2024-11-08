import { Modal } from 'office-ui-fabric-react';
import * as React from 'react'
import { useState } from 'react';

type alertProps = {
    setModal: React.SetStateAction<any>;
    message: any;
    showModal: any;
    alertType: any
}

const AlertBox = ({ showModal, message, setModal, alertType }: alertProps) => {
    const [show, setShow] = useState<any>(showModal);

    const closeModal = () => {
        setShow(false);
        setModal("")
    }
    return (
        <Modal
            className='modal-size'
            isOpen={show}
            onDismiss={() => setShow(false)}
            isBlocking={true}
            containerClassName="alert-modal-box">
            <form className='create-modal'>
                <div className="m-3">
                    {alertType === 'success' ?
                        <p className='modal-title-custom'>Success</p> :
                        alertType === 'warning' &&
                        <p className='modal-title-custom'>Confirmation</p>
                    }
                </div>
                <hr className='HRline'></hr>
                <div className='m-3'>
                {alertType === 'success' ?
                    <div className='modal-content-custom'>
                        <p>{message}</p>
                    </div>
                    :
                    <div className='modal-content-custom' style={{ color: "red" }}>
                        <p>{message}</p>
                    </div>
                }
                </div>
                <hr className='HRline'></hr>
                <footer className="d-flex justify-content-end align-items-center m-3">
                    <button onClick={() => closeModal()}
                        className="btn btn-primary">Ok</button>
                </footer>
            </form>
        </Modal>
    )
}

export default AlertBox