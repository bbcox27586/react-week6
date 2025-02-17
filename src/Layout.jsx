import {  Outlet , NavLink  } from 'react-router-dom'
import * as bootstrap from "bootstrap";

function Layout () {
    return(<div>
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container">
                <ul className="navbar-nav flex-row gap-5 fs-5">
                    <li className="nav-item">
                        <NavLink className="nav-item nav-link" to ="">首頁</NavLink>
                    </li>
                    
                    <li className="nav-item">
                        <NavLink className="nav-item nav-link" to ="products">產品頁</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-item nav-link" to ="Carts">購物車</NavLink>
                    </li>
                </ul>
            </div>
        </nav>
        <Outlet />
    </div>)
}
export default Layout