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

  useEffect(()=>{
    getProductList()
  },[])


  const getProductList = async() => {
    try{
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`)
      setGetProduct(response.data.products)
    }catch(errors){
      console.log(errors);
      
    }
  }

  const getCartList = async() => {
    try{
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/products`)
      setGetProduct(response.data.products)
    }catch(errors){
      console.log(errors);
      
    }
  }

  console.log(getProduct);
  

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

  console.log(watch());
  console.log(errors.email);

  const moreDetail = () => {
    console.log(1);
    
  }
  

  const onSubmit = (data) => {
    console.log(data);
    
  }
  

  return (
    <div id="app">
      <div className="container">
        <div className="mt-4">
          {/* 產品Modal */}
          
          {/* 產品Modal */}
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
              {getProduct.map((item)=><tr key={item.id}>
                <td style={{ width: '200px' }}>
                  <div style={{ height: '100px', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <img src={item.imageUrl} alt="" style={{ height: '100px', backgroundSize: 'cover', backgroundPosition: 'center' }}/>
                  </div>
                </td>
                <td>{item.title}</td>
                <td>
                  <del className="h6">原價{item.origin_price}</del>
                  <div className="h5">特價{item.price}</div>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button type="button" className="btn btn-outline-secondary" onClick={moreDetail}>
                      <i className="fas fa-spinner fa-pulse"></i>
                      查看更多
                    </button>
                    <button type="button" className="btn btn-outline-danger">
                      <i className="fas fa-spinner fa-pulse"></i>
                      加到購物車
                    </button>
                  </div>
                </td>
              </tr>)}
              
            </tbody>
          </table>
          <div className="text-end">
            <button className="btn btn-outline-danger" type="button">清空購物車</button>
          </div>
          <table className="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style={{ width: '150px' }}>數量/單位</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              {/* Cart rows here */}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">總計</td>
                <td className="text-end"></td>
              </tr>
              <tr>
                <td colSpan="3" className="text-end text-success">折扣價</td>
                <td className="text-end text-success"></td>
              </tr>
            </tfoot>
          </table>
        </div>
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