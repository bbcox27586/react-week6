import Layout from "../Layout";
import Products from "../Products/Products";
import Home from "../HomePage/Home";
import Carts from "../Carts/Carts";
import Product from "../Product/Product";


const routes = [
    {
        path:'/',
        element:<Layout />,
        children:[
            {
                path:'', //path第二層以後不加斜線
                element : <Home />
        
            },
            {
                path:'products',
                element:<Products />
            },
            {
                path:'carts',
                element:<Carts />
            },
            {
                path:'product/:id',
                element:<Product />
            }
        ]
    }
]

export default routes