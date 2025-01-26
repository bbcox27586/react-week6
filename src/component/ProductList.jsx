import { useEffect, useState, useRef} from "react";
import axios from "axios";
import Pageindation from "./Pageindation";

function ProductList ( {openModal, opendelModal , getData,  pageinFo, products}) {
    const handlePageChange = (page) => {
      getData(page)
    }
    

    return(<div>
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
        <Pageindation handlePageChange={handlePageChange} pageinFo={pageinFo}/>
      </div>)
}

export default ProductList