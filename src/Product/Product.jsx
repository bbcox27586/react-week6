import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

const {VITE_API_URL} = import.meta.env
const {VITE_API_PATH} = import.meta.env

function Product() {
    const [showMainImage , setShowMainImage] = useState('');
    const [product , setProduct ] = useState({})
    const [addCardList , setaddCardList] = useState({
        "data": {
          "product_id": "",
          "qty": 0
        }
      });
    const  params = useParams()
    const { id } = params
      

    useEffect(()=>{
        (async()=>{
            try{
                const response = await axios.get(`${VITE_API_URL}/api/${VITE_API_PATH}/product/${id}`)
                setProduct(response.data.product)
            }catch(error){

            }
        })()
    },[id])

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

    const changeMainImage = (e) => {
        setShowMainImage(e.target.src)
      }

    const addProductCart = (e) => {
    const productId = e.target.dataset.id;
    setaddCardList({
        "data": {
        "product_id":productId,
        "qty": 1
        }
    })
    }
    

    return(<>
        <div >
                  <div  >
                    <h1 style={{ fontWeight: "900" }}>
                      行程:{product.title}
                    </h1>
                  </div>

                  <div style={{display:'flex', justifyContent:'center', height:"100vh" , alignItems:'center'}}>
                    <div className="card mb-3" style={{ maxWidth: "1000px" }}>
                      <div className="row g-0 ">
                        {/* 這裡是左側的圖片區域 */}
                        <div className="col-md-5" style={{ flex: "none"}}>
                          <img
                            src={showMainImage === "" ? product.imageUrl : showMainImage}
                            style={{ width: "500px", maxWidth: "100%", height: "300px", objectFit: "cover" }}
                            alt="..."
                          />
                          <div style={{ display: "flex" }}>
                            {product.imagesUrl?.map((picture, index) =>
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
                              {product.content}
                            </div>
                            <div className="card-body" style={{display: "flex"}}>
                              <p className="card-text text-center" style={{marginRight: "10px"}}><small>原價{product.origin_price}</small></p>
                              <h3 className="card-text text-center" style={{ color: "red" }}>
                                特價{product.price}
                              </h3>
                            </div>
                              <button type="button" className="btn btn-outline-danger" data-id={product.id} onClick={(e)=>{addProductCart(e)}}>
                                <i className="fas fa-spinner fa-pulse"></i>
                                加到購物車
                              </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
          </div>
    </>)
}

export default Product