import { useState } from "react";
import axios from "axios";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "react-test"; 
 
function LoginPage ( {getData , setisAuth} ) {
    const [formData, setFormData] = useState({
        username: "g199703075@gmail.com",
        password: "tp654jobbcox",
      });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post(`${API_BASE}/admin/signin`, formData);
          const { token, expired } = response.data;
          document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
          axios.defaults.headers.common.Authorization = token;
          setisAuth(true);
          getData()
        } catch (error) {
            console.log(error);
            
          alert("登入失敗: " + error.response.data.message);
        }
      };

      const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      };      

    return(<div className="container login">
            <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
                <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                    />
                    <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                    <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    />
                    <label htmlFor="password">Password</label>
                </div>
                <button
                    className="btn btn-lg btn-primary w-100 mt-3"
                    type="submit"
                    >
                    登入
                </button>
                </form>
            </div>
            </div>
            <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>)
}

export default LoginPage