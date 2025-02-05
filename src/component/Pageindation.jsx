import { useEffect, useState, useRef} from "react";
import axios from "axios";

function Pageindation({pageinFo,handlePageChange}) {
    

    return(<div className="d-flex justify-content-center">
        <nav>
            <ul className="pagination">
            <li className={`page-item ${!pageinFo.has_pre && "disabled"}`}>
                <a  className="page-link" href="#" onClick={()=>(handlePageChange(pageinFo.current_page-1))}>
                上一頁
                </a>
            </li>

            {Array.from({ length:pageinFo.total_pages}).map((_,index)=><li className={`page-item ${pageinFo.current_page===index+1 && "active" }`} key={index+1}>
                <a className="page-link" href="#" onClick={()=>(handlePageChange(index+1))}>
                {index+1}
                </a>
            </li>)}
            


            <li className={`page-item ${!pageinFo.has_next && "disabled"}`}>
                <a className="page-link" href="#" onClick={()=>(handlePageChange(pageinFo.current_page+1))}>
                下一頁
                </a>
            </li>
            </ul>
        </nav>
    </div>)
        
       
}

export default Pageindation