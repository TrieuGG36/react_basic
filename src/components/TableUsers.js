import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { fetchAllUser } from '../services/userService';
import ReactPaginate from 'react-paginate';
import ModalAddNew from './ModalAddNew';
import ModalEditUser from './ModalEditUsers';
import lodash, { debounce } from "lodash";
import ModalConfrim from './ModalConfrim';
import './TableUser.scss';
import { CSVLink, CSVDownload } from "react-csv";
import Papa from "papaparse";
import { toast } from 'react-toastify';

const  TableUsers = (props) =>{

    const [listUsers, setListUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    const [isShowModalAddNew, setIsShowModalAddNew] = useState(false);
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [dataUserEdit, setDataUserEdit] = useState({});
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataUserDelete, setDataUserDelete] = useState({});

    const [sortBy, setSortBy] = useState("asc");
    const [sortField, setSortField] = useState("id");
    const [dataExport, setDataExport] = useState([]);

    const handleClose = () => {
    setIsShowModalAddNew(false);
    setIsShowModalEdit(false);
    setIsShowModalDelete(false);
  }
   
  const handleUpdateTable = (user) => {
    setListUsers([user,...listUsers]);
  }

  const handleEditUserFromModal = (user) =>{
    let cloneListUsers = lodash.cloneDeep(listUsers);
    let index = listUsers.findIndex(item => item.id === user.id);
    cloneListUsers[index].first_name = user.first_name;
    setListUsers(cloneListUsers);
  }

  const handleDeleteUserFromModal = (user) =>{
    let cloneListUsers = lodash.cloneDeep(listUsers);
    cloneListUsers = cloneListUsers.filter(item => item.id !== user.id);
    setListUsers(cloneListUsers);
  }

  const handleSort = (sortBy, sortField) => {
    setSortBy(sortBy);
    setSortField(sortField);
    
    let cloneListUsers = lodash.cloneDeep(listUsers);
    cloneListUsers = lodash.orderBy(cloneListUsers, [sortField], [sortBy]);
    setListUsers(cloneListUsers);
  }

    useEffect(() => {
        // call api

        getUsers(1);
    }, [])

    const getUsers = async (page) => {
        let res = await fetchAllUser(page);
        if(res && res.data) {
            console.log(res)
            setTotalUsers(res.total)
            setListUsers(res.data)
            setTotalPages(res.total_pages);
        }
    }

    const handlePageClick = (event) => {
        getUsers(+event.selected + 1);
    }

    const handleEditUser = (user) => {
        setDataUserEdit(user);
        setIsShowModalEdit(true);
    }

    console.log(listUsers)

    const handleDeleteUser = (user) => {
      setIsShowModalDelete(true);
      setDataUserDelete(user);
      console.log(user)
    }

    const handleSearch = debounce((event) => {
      let keyword = event.target.value;
      console.log("Check run search keyword: ", keyword);
      if(keyword){
        let cloneListUsers = lodash.cloneDeep(listUsers);
        cloneListUsers = cloneListUsers.filter(item => item.email.includes(keyword));
        setListUsers(cloneListUsers);
      }else{
        getUsers(1);  // Api
      }
    }, 1000)


    const getUsersExport = (event, done) => {
        let results = [];
        if(listUsers && listUsers.length > 0){
          results.push(["Id", "Email", "First name", "Last name"]);
          listUsers.map((item, index) => {
            let arr = [];
            arr[0] = item.id;
            arr[1] = item.email;
            arr[2] = item.first_name;
            arr[3] = item.last_name;
            results.push(arr);
          })
          
          setDataExport(results);
          toast.success("Export thành công !");
          done();
        }
    }

    const handleImportCSV = (event) => {
      if(event.target && event.target.files && event.target.files[0]){
        let file = event.target.files[0];
        if(file.type !== "text/csv"){
          toast.error("Upload CSV file...")
          return;
        }
        // Parse local CSV file
        Papa.parse(file, {
          // header: true,
          complete: function(results) {
            let rawCSV = results.data;
            if(rawCSV.length > 0){
                if(rawCSV[0] && rawCSV[0].length === 3){
                    if(rawCSV[0][0] !== "email" || rawCSV[0][1] !== "first_name" || rawCSV[0][2] !== "last_name"){
                      toast.error("Wrong format header data CSV file !");
                    }else{
                        console.log(rawCSV)
                        let result = [];

                        rawCSV.map((item, index) => {
                            if(index > 0 && item.length === 3){
                                let obj = {};
                                obj.email = item[0]
                                obj.first_name = item[1]
                                obj.last_name = item[2]
                                result.push(obj);
                            }
                        })
                        setListUsers(result);
                        console.log("Check Result: ", result);

                    }
                }else{
                  toast.error("Wrong format data CSV file !");
                }
            }else{
              toast.error("Not found data CSV file !");
            }
          toast.success("Import thành công !");
          }
        });
      }

    }

    return (<>
        
        <div className='my-3 add-new'>
            <span><b>List Users:</b> </span>
            <div className="group-btns">
            <label htmlFor="test" className='btn btn-warning'>
                <i className="fa-solid fa-file-import"></i> Import
            </label>
            <input
             id="test" type='file' hidden 
              onChange={(event) => handleImportCSV(event)}
             />
                <CSVLink data={dataExport}
                filename={"users.csv"}
                className="btn btn-primary"
                asyncOnClick={true}
                onClick={getUsersExport}
                ><i className="fa-solid fa-file-arrow-down"></i> Export</CSVLink>
            </div>
            <button className='btn btn-success' 
            onClick={()=>setIsShowModalAddNew(true)}
            >
            <i className="fa-solid fa-circle-plus"></i>  Add User</button>
        </div>
        <div className='col-4 my-3'>
          <input className='form-control' placeholder='Search User by Email...'
             onChange={(event) => handleSearch(event)}
          />
        </div>

        <Table striped bordered hover>
      <thead>
        <tr>
          <th>
            <div className='sort-header'>
              <span>ID</span>
              <span>
                <i onClick={() => handleSort("desc", "id")} className="fa-sharp fa-solid fa-arrow-down"></i>
                <i onClick={() => handleSort("asc", "id")} className="fa-sharp fa-solid fa-arrow-up"></i>
              </span>
            </div>
          </th>
          <th >Email</th>
          <th>
              <div className='sort-header'>
                <span>First_Name</span>
                <span>
                <i onClick={() => handleSort("desc", "first_name")} className="fa-sharp fa-solid fa-arrow-down"></i>
                <i onClick={() => handleSort("asc", "first_name")} className="fa-sharp fa-solid fa-arrow-up"></i>
              </span>
              </div>
          </th>
          <th>Last Name</th>
          <th >Actions</th>
        </tr>
      </thead>
      <tbody>
        {listUsers && listUsers.length > 0 && 
            listUsers.map((item, index) => {
                return (
                    <tr key={`users-${index}`}>
                    <td>{item.id}</td>
                    <td>{item.email}</td>
                    <td>{item.first_name}</td>
                    <td>{item.last_name}</td>
                    <td>
                        <button onClick={() => handleEditUser(item)} className='btn btn-warning mx-3'>Edit</button>
                        <button className='btn btn-danger' onClick={() => handleDeleteUser(item)}>Delete</button>
                    </td>
                  </tr>
                )
            })
        }
      </tbody>
        </Table>

    <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="< previous"
        pageClassName='page-item'
        pageLinkClassName='page-link'
        previousClassName='page-item'
        previousLinkClassName='page-link'
        nextClassName='page-item'
        nextLinkClassName='page-link'
        breakClassName='page-item'
        breakLinkClassName='page-link'
        containerClassName='pagination'
        activeClassName='active'
      />

      <ModalAddNew
          show = {isShowModalAddNew}
          handleClose = {handleClose}
          handleUpdateTable = {handleUpdateTable}
        />
        
        <ModalEditUser 
            show = {isShowModalEdit}
            handleClose = {handleClose}
            dataUserEdit = {dataUserEdit}
            handleEditUserFromModal = {handleEditUserFromModal}
        />

        <ModalConfrim
          show = {isShowModalDelete}
          handleClose = {handleClose}
          dataUserDelete = {dataUserDelete}
          handleDeleteUserFromModal = {handleDeleteUserFromModal}
        />

    </>)

}

export default TableUsers;