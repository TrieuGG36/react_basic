import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { putUpdateUser } from "../services/userService";
import { toast } from 'react-toastify';


const ModalEditUser = (props) => {

    const { show, handleClose, dataUserEdit, handleEditUserFromModal } = props;
    const [name, setName] = useState("");
    const [job, setJob] = useState("");

    const handleEditUser = async () =>{
        let res = await putUpdateUser(name, job);
        if(res && res.updatedAt){
            // success
            handleEditUserFromModal({
                first_name: name,
                id: dataUserEdit.id
            })
            handleClose();
            toast.success("Update User thành công !")
        }else{
            toast.error("Update User không thành công !")
        }
        console.log(res)
    }

    useEffect(() => {
        if(show){
            setName(dataUserEdit.first_name)
        }
    }, [dataUserEdit])

    return (
        <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> Update a User</Modal.Title>
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
            <Button variant="primary" onClick={() => handleEditUser()}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        
        </>

    )
}

export default ModalEditUser;