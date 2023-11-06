import React, { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
//import { AiFillCaretRight } from "react-icons/ai";
import {BsFillArrowRightCircleFill} from 'react-icons/bs'

import CustomerButton from "./customerButton";
function CustomerHomePage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3009/api/v1/getOrders/${0}`
        ); // Replace with your API endpoint
        if (response.ok) {
          console.log(response);
          const data = await response.json();
          console.log(data.results);
          setProducts(data.results);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  console.log(products)
 
  const openDetailPage = (e) => {
    console.log("called")
    console.log(e);
    console.log(e.target.id);

    navigate(`/adminViewDetail/${e.target.id}`);
  };

  const refreshpage=()=>{
    window.location.reload()
  }

  return(
    <div className="admin-order-accepted-product-list">
      <h2 className="admin-order-accepted-order-list-heading">Order List</h2>
      <div className="admin-order-accepted-category-types">
        <p className="admin-order-accepted-order-id-category">Order Id</p>
        <p className="admin-order-accepted-name-category">Name</p>
        <p className="admin-order-accepted-service-category">Service</p>
        <p className="admin-order-accepted-quantity-category">Quantity</p>
        <p className="admin-order-accepted-order-tracking-category">Order Tracking Link</p>
        <p className="admin-order-accepted-decline-category">Decline</p>
        <p className="admin-order-accepted-accept-category">Accept</p>
        <p className="admin-order-accepted-fnsku-category">Amount</p>
        
        <p className="admin-order-accepted-view-in-detail-category">View In Detail</p>
      </div>
      {products.map(eachProduct=>{
        console.log("called")
        console.log(eachProduct.fnsku_status,eachProduct.label_status)
        return(
        <div className="admin-order-accepted-display-of-products-container">
          <p className="admin-order-accepted-order-id-sub-category">{eachProduct.id}</p>
          <p className="admin-order-accepted-name-sub-category">{eachProduct.name}</p>
          <p className="admin-order-accepted-service-sub-category">{eachProduct.service}</p>
          <p className="admin-order-accepted-quantity-sub-category">{eachProduct.unit}</p>
          <p className="admin-order-accepted-order-tracking-sub-category">{eachProduct.tacking_url}</p>
            <CustomerButton id={eachProduct.id} />
          {/* <button className="admin-order-accepted-received-button" onClick={refreshpage}>Received</button>
          <button className="admin-order-accepted-declined-button" onClick={refreshpage}>Decline</button> */}
          <p className="admin-order-accepted-fnsku-sub-category">
            5000
          </p>
          
          <BsFillArrowRightCircleFill id={eachProduct.id} value={eachProduct.id} onClick={openDetailPage} className="admin-order-accepted-view-in-detail-sub-category" />
        </div>
      )})}
    </div>
  )
}

export default CustomerHomePage;