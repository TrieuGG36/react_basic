
import { Modal, Button } from 'react-bootstrap';
import { deleteUser } from '../services/userService';
import {toast} from 'react-toastify';

const ModalConfrim = (props) => {

    const {show, handleClose, dataUserDelete, handleDeleteUserFromModal} = props;
   
    const confirmDelete = async () => {
      let res = await deleteUser(dataUserDelete.id);
      if(res && +res.statusCode === 204){
        toast.success("Xóa User thành công !");
        handleClose();
        handleDeleteUserFromModal(dataUserDelete);
      }else{
        toast.error("Xóa User thất bại")
      }
      console.log(res)
    }
    
    return (
        <>
        <Modal show={show} onHide={handleClose} backdrop="static"
        keyboard={false} >
          <Modal.Header closeButton>
            <Modal.Title> Delete User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <h5>Hoạt động này không thể trở lại !</h5>
              

              Hãy xác nhận rằng bạn muốn xóa User này không ?
              <br/>
              <b>Email: {dataUserDelete.email} ? </b>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => confirmDelete()}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        
        </>

    )
}

export default ModalConfrim;