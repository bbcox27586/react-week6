import { useEffect, useState, useRef} from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "./assets/style.css";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "react-test"; 

function App() {

  const defaultValue = {
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: false,
    imagesUrl: [""],
  }
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([])
  const [templateData, setTemplateData] = useState(defaultValue)
  const modalRef = useRef(null)
  const delmodalRef = useRef(null)
  const productModalRef = useRef(null);
  const delProductModalRef = useRef(null);
  const [modalType,setModalType] = useState("");

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common.Authorization = token;
    modalRef.current = new bootstrap.Modal(productModalRef.current, {
      keyboard: false,
    });
    delmodalRef.current = new bootstrap.Modal(delProductModalRef.current, {
      keyboard: false,
    });
    checkAdmin();
  }, []);

  const openModal = (type , products) => {
    setModalType(type);
    switch (type) {
      case "edit" : 
      setTemplateData(products)
      break;
      case "create" :
      setTemplateData(defaultValue)
      break;
    }
    console.log(templateData.imagesUrl?.length)
    modalRef.current.show();
  };

  const handleModalInputChange = (e) =>{
    const {value , id , type , checked } = e.target
    setTemplateData((preData)=>({...preData,  [id]: type === "checkbox" ? checked : value}))
  }

  const closeModal = () => {
    modalRef.current.hide();
    console.log(templateData)
    setModalType("")
  };

  const opendelModal = (products) => {
    setTemplateData(products)
    delmodalRef.current.show();
  };

  const closedelModal = () => {
    delmodalRef.current.hide();
    console.log("a")
    setModalType("")
  };

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleAddImage = () =>{
    const newInages = [...templateData.imagesUrl ,'']
      setTemplateData({
        ...templateData,
        imagesUrl : newInages
      });
      
  }
    
  const getData = async() =>{
    try{
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`)
      setProducts(response.data.products)
    }catch(error){
      console.log(error)
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = token;
      setisAuth(true);
      getData()
    } catch (error) {
      alert("登入失敗: " + error.response.data.message);
    }
  };

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
      alert('新增產品失敗')
    }
  }

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
    }
    
  };

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
      alert('編輯產品失敗')
    }
  }

  const handleUpdataProduct = async() =>{

    try{
      if(modalType === 'edit'){
        await handleEditData();
        getData()
        closeModal()
      }else{
        await createProduct();
        getData()
        closeModal()
      }
      
    }catch(error){
      alert('新增產品失敗')
      
    }
  }


  
  
  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary" onClick={()=>openModal('create')}>建立新的產品</button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
              {products&&products.length>0 ? (
                  products.map((item)=>{
                    return(<tr key={item.id}> 
                      <td>{item.category}</td>
                      <td>{item.title}</td>
                      <td className="text-end">{item.origin_price}</td>
                      <td className="text-end">{item.price}</td>
                      <td>
                        {console.log(item)
                        }
                        {item.is_enabled===1 ? (<span className="text-success">啟用</span>)
                          :(<span>未啟用</span>) }
                      </td>
                      <td>
                        <div className="btn-group">
                          <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>openModal('edit',item)}>
                            編輯
                          </button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={()=>opendelModal(item)}>
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})
              ):(<tr>
                <td colSpan="5">尚無產品資料</td>
                </tr>)} 
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                    />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                  >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
      {/*刪除產品modal*/ }
      <div
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
      </div>

      <div
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
      </div>
    </>
  );
}

export default App;