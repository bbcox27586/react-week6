import { useEffect, useState, useRef} from "react";
import { useForm } from 'react-hook-form';
import axios from "axios";
import * as bootstrap from "bootstrap";
import { Outlet, NavLink , useParams , useNavigate} from "react-router-dom"


function Products() {

  const {VITE_API_URL} = import.meta.env
  const {VITE_API_PATH} = import.meta.env
  const navigate = useNavigate();
  const [getProduct , setGetProduct] = useState([]);
  const [addCardList , setaddCardList] = useState({
    "data": {
      "product_id": "",
      "qty": 0
    }
  });

  const modalRef = useRef(null)
  const myModal = useRef(null)

  const getProductList = async() => {
    try{
      const response = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/products`)
      setGetProduct(response.data.products)
    }catch(errors){
      console.log(errors);
      
    }
  }

  useEffect(()=>{
    getProductList()
  },[])


  useEffect(()=>{
    if( addCardList.data["product_id"] ===  "" ) return;
    (async()=>{
      try{
        const response = await axios.post(`${VITE_API_URL}/api/${VITE_API_PATH}/cart`,addCardList)
        setaddCardList({
          "data": {
            "product_id":"",
            "qty": 0
          }
        })
      }catch(errors){
        console.log(errors);
        
      }
    })()
  },[addCardList])

  const addProductCart = (e) => {
    const productId = e.target.dataset.id;
    setaddCardList({
      "data": {
        "product_id":productId,
        "qty": 1
      }
    })
  }

  function handleLink(e, item) {
    e.preventDefault()
    //做其他事情，像是確認購物車
    setTimeout(() => {
        navigate(`/product/${item.id}`)
    }, 100);
}
      

  return (
    <>
        <h1>產品頁</h1>
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
                    <button type="button" className="btn btn-outline-secondary" value={index}  onClick={(e)=>handleLink(e , item)}>
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

        </div> 
    </>
    
  );
}

export default Products