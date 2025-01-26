import { useState ,useRef } from "react";
import axios from "axios";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "react-test"; 


function EditProduct ({getData, closeModal, setTemplateData, productModalRef, modalType, templateData}) {

    const handleModalInputChange = (e) =>{
        const {value , id , type , checked } = e.target
        setTemplateData((preData)=>({...preData,  [id]: type === "checkbox" ? checked : value}))
      }

    const handleAddImage = () =>{
        const newInages = [...templateData.imagesUrl ,'']
            setTemplateData({
            ...templateData,
            imagesUrl : newInages
            });
        
    }
    
    const handleImgaeChange = (e,index) =>{
        const {value} = e.target
    
        const newInages = [...templateData.imagesUrl]
        newInages[index] = value
        setTemplateData({...templateData , imagesUrl:newInages})
      }
    
      const handleRemoveImage = () =>{
        const newInages = [...templateData.imagesUrl]
        newInages.pop();
        setTemplateData({...templateData , imagesUrl:newInages})
      }
      
      const handleUpdataProduct = async() =>{

        try{
          if(modalType === 'edit'){
            await handleEditData();
            getData()
     
          }else{
            await createProduct();
            getData()
     
          }
          
        }catch(error){
          alert('新增產品失敗')
          
        }
      }
      
      const handleUpdateFile = async(e)=>{
        console.dir(e.target);
        try{
          const file = e.target.files[0];
    
          const formData = new FormData();
          formData.append('file-to-upload', file)
          console.dir(formData);
          const response = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload/`, formData)
    
          const uploadImageUrl = response.data.imageUrl
    
          setTemplateData({...templateData , imageUrl : uploadImageUrl})
          console.log(uploadImageUrl);
          
        }catch(error){
    
        }  
      }

      const createProduct = async() =>{
        try{
          const response = await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`,{
            data: {
              ...templateData,
              origin_price:Number(templateData.origin_price),
              price:Number(templateData.price),
              is_enabled:templateData.is_enabled?1:0
            }
          })
          alert('新增產品成功')
        }catch(error){
    
        }
      }
      
      const handleEditData = async() => {
        try{
          const response = await axios.put(`${API_BASE}/api/${API_PATH}/admin/product/${templateData.id}`,{
            data: {
              ...templateData,
              origin_price:Number(templateData.origin_price),
              price:Number(templateData.price),
              is_enabled:templateData.is_enabled?1:0
            }
          })
          alert('編輯產品成功')
        }catch(error){
    
        }
      }

    return(<div
        className="modal fade"
        tabIndex="-1"
        id="productModal"
        aria-labelledby="productModalLabel"
        aria-hidden="true"
        ref={productModalRef}
        >
        <div className="modal-dialog modal-xl">
          <div className="modal-content border-0">
            <div className="modal-header bg-dark text-white">
              <h5 id="productModalLabel" className="modal-title">
                <span>{modalType === 'create' ? '新增產品': '編輯產品' }</span>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-sm-4">
                <div className="mb-5">
                  <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    id="fileInput"
                    onChange={handleUpdateFile}
                  />
                </div>

                  <div className="mb-2">
                    <div className="mb-3">
                      <label htmlFor="imageUrl" className="form-label">
                        輸入圖片網址
                      </label>
                      <input
                        type="text"
                        id="imageUrl"
                        className="form-control"
                        placeholder="請輸入圖片連結"
                        value={templateData.imageUrl}
                        onChange={handleModalInputChange}
                        />
                    </div>
                    <img className="img-fluid" src={templateData.imageUrl} alt={templateData.title} />
                  </div>
                        {/* 副圖 */}
                    <div className="border border-2 border-dashed rounded-3 p-3">
                      {templateData.imagesUrl?.map((image, index) => (
                        <div key={index} className="mb-2">
                          <label
                            htmlFor={`imagesUrl-${index + 1}`}
                            className="form-label"
                          >
                            副圖 {index + 1}
                          </label>
                          <input
                            id={`imagesUrl-${index + 1}`}
                            type="text"
                            placeholder={`圖片網址 ${index + 1}`}
                            value={templateData.imagesUrl[index]}
                            className="form-control mb-2"
                            onChange={(e)=>handleImgaeChange(e , index)}
                          />
                          {image && (
                            <img
                              src={image}
                              alt={`副圖 ${index + 1}`}
                              className="img-fluid mb-2"
                            />
                          )}
                        </div>
                      ))}

                      <div className="btn-group w-100">
                        {templateData.imagesUrl?.length < 5 && templateData.imagesUrl[templateData.imagesUrl?.length-1] !==''&& (<button
                              className="btn btn-outline-primary btn-sm w-100"
                              onClick={handleAddImage}
                            >
                              新增圖片
                            </button>)}
                            
                        

                        {templateData.imagesUrl?.length > 1 && (<button
                          className="btn btn-outline-danger btn-sm w-100"
                          onClick={handleRemoveImage}
                        >
                          取消圖片
                        </button>)}
                          
                      </div>
                      

                    </div>

                </div>
                <div className="col-sm-8">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">標題</label>
                    <input
                      id="title"
                      type="text"
                      className="form-control"
                      placeholder="請輸入標題"
                      value={templateData.title}
                      onChange={handleModalInputChange}
                      />
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">

                      <label htmlFor="category" className="form-label">分類</label>
                      <input
                        id="category"
                        type="text"
                        className="form-control"
                        placeholder="請輸入分類"
                        value={templateData.category}
                        onChange={handleModalInputChange}
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="unit" className="form-label">單位</label>
                      <input
                        id="unit"
                        type="text"
                        className="form-control"
                        placeholder="請輸入單位"
                        value={templateData.unit}
                        onChange={handleModalInputChange}
                        />
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3 col-md-6">
                      <label htmlFor="origin_price" className="form-label">原價</label>
                      <input
                        id="origin_price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入原價"
                        value={templateData.origin_price}
                        onChange={handleModalInputChange}
                        />
                    </div>
                    <div className="mb-3 col-md-6">
                      <label htmlFor="price" className="form-label">售價</label>
                      <input
                        id="price"
                        type="number"
                        min="0"
                        className="form-control"
                        placeholder="請輸入售價"
                        value={templateData.price}
                        onChange={handleModalInputChange}
                        />
                    </div>
                  </div>
                  <hr />

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">產品描述</label>
                    <textarea
                      id="description"
                      className="form-control"
                      placeholder="請輸入產品描述"
                      value={templateData.description}
                      onChange={handleModalInputChange}
                      ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">說明內容</label>
                    <textarea
                      id="content"
                      className="form-control"
                      placeholder="請輸入說明內容"
                      value={templateData.content}
                      onChange={handleModalInputChange}
                      ></textarea>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        id="is_enabled"
                        className="form-check-input"
                        type="checkbox"
                        checked={templateData.is_enabled}
                        onChange={handleModalInputChange}
                        />
                      <label className="form-check-label" htmlFor="is_enabled">
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                onClick={() => closeModal()}
                >
                取消
              </button>
              <button type="button" className="btn btn-primary" id={templateData.id}
              onClick={handleUpdataProduct}
              >確認</button>
            </div>
          </div>
        </div>
      </div>)
}

export default EditProduct