import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { postCreateUser } from '../services/userService';
import { toast } from 'react-toastify';


const ModalAddNew = (props) => {

    const {show, handleClose, handleUpdateTable} = props;
    const [name, setName] = useState("");
    const [job, setJob] = useState("");

    const handleSaveUser = async () => {
        let res = await postCreateUser(name,job);

        if(res && res.id){
            // success
            handleClose();
            setName('');
            setJob('');
            toast.success("Tạo User thành công !")
            handleUpdateTable({first_name: name, id: res.id});
        } else{
            // error
            toast.error("Tạo User không thành công ....")
        }
    }
    return (
        <>
        <Modal show={show} onHide={handleClose} backdrop="static"
        keyboard={false} >
          <Modal.Header closeButton>
            <Modal.Title> Add New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='body-add-new'>
            <div className="form-group">
            <label for="exampleInputEmail1">Name</label>
            <input type="text" className="form-control" value={name} onChange={(event) => setName(event.target.value)}/>
          </div>
          <div className="form-group">
            <label>Job</label>
            <input type="text" className="form-control" value={job} onChange={(event) => setJob(event.target.value)}/>
          </div>
          
        </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => handleSaveUser()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        
        </>

    )
}

export default ModalAddNew;