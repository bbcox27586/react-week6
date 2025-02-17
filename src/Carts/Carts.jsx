import { useEffect, useState, useRef} from "react";
import { useForm } from 'react-hook-form';
import axios from "axios";
import * as bootstrap from "bootstrap";

function Carts() {

    const {VITE_API_URL} = import.meta.env
    const {VITE_API_PATH} = import.meta.env

      const [getCardList , setGetCardList] = useState({});
      const [delCardList , setDelCardList] = useState("");
      const [updateCartItem , setUpdateCartItem] = useState(null)
      const [addCardList , setaddCardList] = useState({
        "data": {
          "product_id": "",
          "qty": 0
        }
      });


        useEffect(()=>{
          getCartListFn()
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
                getCartListFn()
              }catch(errors){
                console.log(errors);
                
              }
            })()
          },[addCardList])

          const getCartListFn = async() => {
            try{
              const response = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/cart`)
              setGetCardList(response.data.data)
            }catch(errors){
              console.log(errors);
              
            }
          }     

      const delAllCart = async() => {
        try{
          const response = await axios.delete(`${VITE_API_URL}/api/${VITE_API_PATH}/carts`)
          getCartListFn()
        }catch(errors){
          console.log(errors);
          
        }
      }

      useEffect(()=>{
        if(delCardList==="") return;
        (async() => {
          try{
            const response = await axios.delete(`${VITE_API_URL}/api/${VITE_API_PATH}/cart/${delCardList}`)
            getCartListFn()
            setDelCardList("")
          }catch(errors){
            console.log(errors);
            
          }
        })()
      },[delCardList])

      const delSignleCart = (e) => {
        const cartId = e.target.dataset.id;
        setDelCardList(cartId)
      }

      const cutProductNum = (item) => {
        if (item.qty > 1) { 
          setUpdateCartItem({
            id: item.id,
            data: {
              product_id: item.product.id,
              qty: item.qty - 1
            }
        });
        }
      };

      


      const addProudctNum = (item) => {
        setUpdateCartItem({
          id: item.id,
          data: {
            product_id: item.product.id,
            qty: item.qty + 1
          }
        });
      }

      useEffect(() => {
        if (!updateCartItem) return; 
        (async () => {
          try {
            const response = await axios.put(
              `${VITE_API_URL}/api/${VITE_API_PATH}/cart/${updateCartItem.id}`,
              { data: updateCartItem.data }
            );
            getCartListFn();
          } catch (errors) {
            console.log(errors);
          }
        })();
      }, [updateCartItem]);
      
    return(
        <>
            <h1>購物車</h1>

            <div className="text-center">
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
                    <td style={{ width: '150px' }}><button type="button" className="btn  btn-outline-primary btn-sm" onClick={()=>addProudctNum(item)}>+</button>
                    <p style={{display:'inline',fontSize: '24px', margin:'2px'}}>{item.qty}</p>
                    <button className={`btn btn-outline-primary btn-sm ${item.qty ===1 && "disabled" }`} data-num={item.qtt} onClick={()=>cutProductNum(item)} > - </button></td>
                    <td>{item.product.price}</td>
                    <td><button type="button" className="btn btn-outline-danger btn-sm" data-id={item.id}  onClick={(e)=>delSignleCart(e)}>x</button></td>
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
        </>
        
    )
}
export default Carts