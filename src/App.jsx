import { useEffect, useState, useRef} from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import LoginPage from "./component/LoginPage";
import ProductList from "./component/ProductList";
import DelProduct from "./component/delProduct"
import EditProduct from "./component/EditProduct";

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

function App( ) {

  
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

  const checkAdmin = async () => {
    try {
      await axios.post(`${API_BASE}/api/user/check`);
      getData();
      setisAuth(true);
    } catch (err) {
      console.log(err.response.data.message);
    }
  };  

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
    modalRef.current.show();
  };

  

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
    
  const getData = async(page=1) =>{
    try{
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`)
      setProducts(response.data.products)
      setPageInfo(response.data.pagination)
      
    }catch(error){
      console.log(error)
    }
  }

  const [pageinFo , setPageInfo ] = useState({})

  
  
  
  return (
    <>
      {isAuth ? (
        <ProductList openModal={openModal} opendelModal={opendelModal} products={products} pageinFo={pageinFo} getData={getData} />
      ) : (
        <LoginPage getData={getData} setisAuth={setisAuth} />
      )}
      {/*刪除產品modal*/ }
      <DelProduct delProductModalRef={delProductModalRef} closedelModal={closedelModal} getData={getData} templateData={templateData}/>

      <EditProduct closeModal={closeModal} getData={getData} pageinFo={pageinFo}  setTemplateData={setTemplateData} templateData={templateData} productModalRef={productModalRef} modalType={modalType}/>

    </>
  );
}

export default App;