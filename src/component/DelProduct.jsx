import { useState ,useRef } from "react";
import axios from "axios";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "react-test"; 

function DelProduct ({delProductModalRef,  getData , templateData, delmodalRef, setModalType}){
  
    const delData = async(e) => {
        const id = e.target.id
        try{
          const response = await axios.delete(`${API_BASE}/api/${API_PATH}/admin/product/${id}`)
          alert("刪除產品成功")
          console.log(response)
          getData()
          closedelModal()
        }catch(error){
          alert("刪除產品失敗")
          console.log(error);
          
        }
        
      };

      const closedelModal = () => {
        delmodalRef.current.hide();
        console.log("a")
        setModalType("")
      };

    return(<div
        className="modal fade"
        id="delProductModal"
        tabIndex="-1"
        ref={delProductModalRef}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">刪除產品</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              你是否要刪除 
              <span className="text-danger fw-bold">{templateData.title}</span>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={()=>closedelModal()}
              >
                取消
              </button>
              <button type="button" className="btn btn-danger" id={templateData.id} onClick={(e)=>delData(e)}>
                刪除
              </button>
            </div>
          </div>
        </div>
      </div>)
}

export default DelProduct