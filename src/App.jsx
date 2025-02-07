import { useEffect, useState, useRef} from "react";
import { useForm } from 'react-hook-form';
import axios from "axios";
import * as bootstrap from "bootstrap";

import "./assets/style.css";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "react-test"; 

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

function App() {

  const data = {
    "username": "g199703075@gmail.com",
    "password": "tp654jobbcox"
  }

  const [getProduct , setGetProduct] = useState([]);
  const [getCardList , setGetCardList] = useState([]);
  const [getModalNum , setGetModalNum] = useState(0);
  const [showImage , setShowImage] = useState([]);
  const [showMainImage , setShowMainImage] = useState('');
  const [addCardList , setaddCardList] = useState({
    "data": {
      "product_id": "",
      "qty": 0
    }
  });
  const [delCardList , setDelCardList] = useState("");
  
  const modalRef = useRef(null)
  const myModal = useRef(null)
  //資料初始化
  useEffect(()=>{
    getProductList()
    getCartListFn()
    myModal.current = new bootstrap.Modal(modalRef.current);
  },[])
  //取得產品列表
  const getProductList = async() => {
    try{
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`)
      setGetProduct(response.data.products)
    }catch(errors){
      console.log(errors);
      
    }
  }
   //取得購物車列表
  const getCartListFn = async() => {
    try{
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`)
      setGetCardList(response.data.data)
    }catch(errors){
      console.log(errors);
      
    }
  }  
  //產品詳細  副圖(問chatGpt)
  useEffect(() => {
    if (getProduct.length > 0) {
      const selectedItem = getProduct.find((_, i) => i === Number(getModalNum));
      if (selectedItem) {
        setShowImage([selectedItem.imageUrl, ...selectedItem.imagesUrl]);
      }
    }
    console.log(3);
    
  }, [getModalNum, getProduct]);
  //react-hook-form
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues:{
      email : 'g199703075@gmail.com',
      name : '姓名',
      tel : '電話',
      address : '地址',
      message : '留言'
    },
    mode : "onTouched"
  })
  //查看更多
  const moreDetail = (e) => {
    setGetModalNum(e.target.value)
    setShowMainImage("")
    console.log(getProduct);
    myModal.current.show()
    
  }
  //提交表單
  const onSubmit = (data) => {
    console.log(data);
  }
  
  //加入購物車
  const addProductCart = (e) => {
    const productId = e.target.dataset.id;
    setaddCardList({
      "data": {
        "product_id":productId,
        "qty": 1
      }
    })
  }
  
  useEffect(()=>{
    if( addCardList.data["product_id"] ===  "" ) return;
    (async()=>{
      try{
        const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`,addCardList)
        console.log(response.data);
        setaddCardList({
          "data": {
            "product_id":"",
            "qty": 0
          }
        })
        getCartListFn()
      }catch(errors){
        console.log(errors);
        
      }
    })()
  },[addCardList])

  //切換主圖
  const changeMainImage = (e) => {
    setShowMainImage(e.target.src)
  }
  //關閉Modal
  const closeModal = () => {
    myModal.current.hide()
  }
  //刪除全部購物車
  const delAllCart = async() => {
    try{
      const response = await axios.delete(`${API_BASE}/api/${API_PATH}/carts`)
      getCartListFn()
    }catch(errors){
      console.log(errors);
      
    }
  }
  //刪除單筆購物車
  const delSignleCart = (e) => {
    const cartId = e.target.dataset.id;
    setDelCardList(cartId)
  }
  useEffect(()=>{
    if(delCardList==="") return;
    (async() => {
      try{
        const response = await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${delCardList}`)
        console.log(response.data);
        
        getCartListFn()
        setDelCardList("")
      }catch(errors){
        console.log(errors);
        
      }
    })()
  },[delCardList])

  return (
    <div id="app">
      <div className="container">
        <div className="mt-4">
          
          {/* 產品列表 */}
          <table className="table align-middle">
            <thead>
              <tr>
                <th>圖片</th>
                <th>商品名稱</th>
                <th>價格</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {getProduct.map((item,index)=><tr key={index}>
                <td style={{ width: '200px' }}>
                  <div style={{ height: '100px',  width: '200px', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <img src={item.imageUrl} alt="" style={{ height: '100px', width: '150px', objectFit:'cover' , backgroundSize: 'cover', backgroundPosition: 'center' }}/>
                  </div>
                </td>
                <td>{item.title}</td>
                <td>
                  <del className="h6">原價{item.origin_price}</del>
                  <div className="h5" style={{ color:"red" }}>特價{item.price}</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button type="button" className="btn btn-outline-secondary" value={index}  onClick={(e)=>{moreDetail(e)}}>
                      <i className="fas fa-spinner fa-pulse"></i>
                      查看更多
                    </button>
                    <button type="button" className="btn btn-outline-danger" data-id={item.id} num={item.num} onClick={(e)=>{addProductCart(e)}}>
                      <i className="fas fa-spinner fa-pulse"></i>
                      加到購物車
                    </button>
                  </div>
                </td>
              </tr>)}
              
            </tbody>
          </table>
          <div className="text-end">
            <button className="btn btn-outline-danger" type="button" onClick={(e)=>delAllCart(e)}>清空購物車</button>
          </div>
          <table className="table align-middle">
            <thead>
              <tr>
                <th>行程圖</th>
                <th>品名</th>
                <th style={{ width: '150px' }}>數量/單位</th>
                <th>單價</th>
                <th>刪除購物車</th>
              </tr>
            </thead>
            
            {getCardList.carts?.map((item , index)=>
              <tbody key={index}>
              <tr >
                <td  style={{ width: '150px' }}><img src={item.product.imageUrl} alt="" /></td>
                <td>{item.product.title}</td>
                <td style={{ width: '150px' }}>{item.qty}</td>
                <td>{item.product.price}</td>
                <td><button className="btn btn-outline-danger btn-sm" data-id={item.id}  onClick={(e)=>delSignleCart(e)}>x</button></td>
              </tr>
            </tbody>
            )}
            <tfoot>
            <tr>
                <td colSpan="4" className="text-end">總計</td>
                <td className="text-center">{getCardList["final_total"]}</td>
              </tr>
              <tr>
                <td colSpan="4" className="text-end text-success">折扣價</td>
                <td className="text-center text-success"></td>
              </tr>

            </tfoot>

          </table>
        </div>

        {/* 產品詳細資訊*/ }
        <div className="modal fade"  ref={modalRef} tabIndex="-1" >
        <div className="modal-dialog modal-xl">
            {getProduct.map((item, index) =>
              index === Number(getModalNum) ? (
                <div className="modal-content" key={index}>
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel" style={{ fontWeight: "900" }}>
                      行程:{item.title}
                    </h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                  </div>

                  <div className="modal-body text-start">
                    <div className="card mb-3" style={{ maxWidth: "1000px" }}>
                      <div className="row g-0 ">
                        {/* 這裡是左側的圖片區域 */}
                        <div className="col-md-5" style={{ flex: "none"}}>
                          <img
                            src={showMainImage === "" ? item.imageUrl : showMainImage}
                            style={{ width: "500px", maxWidth: "100%", height: "300px", objectFit: "cover" }}
                            alt="..."
                          />
                          <div style={{ display: "flex" }}>
                            {showImage.map((picture, index) =>
                              picture !== "" ? (
                                <div key={index} id={index} style={{ margin: "5px" }}>
                                  <button style={{ border: "none", padding: "0px" }} onClick={(e) => { changeMainImage(e); }}>
                                    <img src={picture} style={{ height: "75px", width: "100px", objectFit: "cover" }} alt="..." />
                                  </button>
                                </div>
                              ) : ""
                            )}
                          </div>
                        </div>

                        {/* 這裡是右側的文字區域，讓它水平方向排列 */}
                        <div className="col-md-7" style={{ display: "flex", flexDirection: "column", backgroundColor : "#eee"}}>
                          <div className="text-area" style={{ margin: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px", flex: "1", backgroundColor : "#fff" }}>
                            <div className="card-body">
                              <h3 className="card-text">行程介紹:</h3>
                              {item.content}
                            </div>
                            <div className="card-body" style={{display: "flex"}}>
                              <p className="card-text text-center" style={{marginRight: "10px"}}><small>原價{item.origin_price}</small></p>
                              <h3 className="card-text text-center" style={{ color: "red" }}>
                                特價{item.price}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : ""
            )}
          </div>

        </div>

        {/*驗證表單*/ }
        <div className="my-5 row justify-content-center">
          <form className="col-md-6" id="form" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input id="email" name="email" type="email" className={`form-control ${errors.email && "is-invalid"}`}  placeholder="請輸入 Email" {...register('email' , {required: "請輸入 Email 地址", pattern : {
                value : /^\S+@\S+$/i,
                message : 'Email格式不正確'
              }})} />
              {errors.email && <div className="invalid-feedback text-start">{errors.email?.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">收件人姓名</label>
              <input id="name" name="姓名" type="text" className={`form-control ${errors.name && "is-invalid"}`} placeholder="請輸入姓名" {...register('name' , 
              {required : '請輸入姓名', pattern : {
                value : /^.{2,}$/ ,
                message : "至少2個字"
              }})} />
              {errors.name && <div className="invalid-feedback text-start">{errors.name?.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="tel" className="form-label">收件人電話</label>
              <input id="tel" name="電話" type="text" className={`form-control ${errors.tel && "is-invalid"}`} placeholder="請輸入電話" {...register('tel' , {required : '請輸入電話',
                minLength: {
                  value : 10,
                  message : "電話號碼格式錯誤"
                }, maxLength: {
                  value : 10,
                  message : "電話號碼格式錯誤"
                }
              }) } />
              {errors.tel && <div className="invalid-feedback text-start">{errors.tel?.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="address" className="form-label">收件人地址</label>
              <input id="address" name="地址" type="text" className={`form-control ${errors.address && "is-invalid"}`} placeholder="請輸入地址" {...register('address' , {required : '請輸入地址',
                pattern : {
                  value :  /^[\u4e00-\u9fa5a-zA-Z0-9\s,.#-]{5,}$/,
                  message : "地址應以門牌號碼開頭，並至少5個字"
                }
              })} />
              {errors.address && <div className="invalid-feedback text-start">{errors.address?.message}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">留言</label>
              <textarea id="message" className={`form-control ${errors.message && "is-invalid"}`} cols="30" rows="10" {...register('message' , {required : "請輸入留言" , pattern : {
                value : /^.{10,}$/ ,
                message : "至少10個字"
            }})}></textarea>
              {errors.message && <div className="invalid-feedback text-start">{errors.message?.message}</div>}
            </div>
            <div className="text-end">
              <button type="submit" className="btn btn-danger">送出訂單</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default App;