import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createHashRouter , RouterProvider } from 'react-router-dom';
import routes from './routes/index.jsx'

import App from './App.jsx'

const router = createHashRouter(routes)
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}>
    <App />
  </RouterProvider>,
)
