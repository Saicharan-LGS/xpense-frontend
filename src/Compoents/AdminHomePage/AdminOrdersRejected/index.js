import React, { useEffect, useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
//import { AiFillCaretRight } from "react-icons/ai";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Spinner from "../../Spinner";

import EmptyOrder from "../../EmptyOrder";

function AdminOrdersRejected() {
  const [products, setProducts] = useState([]);
  const [loading,setLoading] = useState(true)
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Number of products to display per page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    console.log("reject called");
    const fetchProducts = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3009/api/v1/getOrders/${1}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Replace with your API endpoint
        if (response.ok) {
          console.log(response);
          const data = await response.json();
          console.log(data.results);
          setProducts(data.results);
          setLoading(false)
        } else {
          console.error("Failed to fetch products");
          setTimeout(()=>{
            setLoading(false)
           },3000)
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setTimeout(()=>{
          setLoading(false)
         },3000)
      }
    };
    fetchProducts();
  }, []);
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Month is zero-based, so add 1
  const day = date.getDate();
  console.log(products);
  const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}`;
  console.log(formattedDate);
  const openDetailPage = (e, productId) => {
    console.log(productId);
    navigate(`/adminViewDetail/${productId}`);
  };

  const NextButton = indexOfLastProduct >= products.length? `pagination-arrow-container disable-previous-next-button`:`pagination-arrow-container`
  const previousButton = currentPage===1? `pagination-arrow-container disable-previous-next-button`:`pagination-arrow-container`

  return (
    <>
    {
      loading ? <Spinner/> : (
    
    <div className="admin-order-accepted-product-list">
      <h2 className="admin-order-accepted-order-list-heading">Rejected List</h2>
      <div className="admin-order-accepted-category-types">
        <p className="admin-order-accepted-order-id-category">Order Id</p>
        <p className="admin-order-accepted-name-category">Name</p>
        <p className="admin-order-accepted-service-category">Product</p>
        <p className="admin-order-accepted-quantity-category">Quantity</p>
        <p className="admin-order-accepted-order-tracking-category">
          Order Tracking Link
        </p>
        {/* <p className="admin-order-accepted-decline-category">Decline</p>
          <p className="admin-order-accepted-accept-category">Accept</p> */}
        <p className="admin-order-accepted-fnsku-category">FNSKU Status</p>
        <p className="admin-order-accepted-box-label-category">
          Box Label Status
        </p>
        <p className="admin-order-accepted-view-in-detail-category">
          View In Detail
        </p>
      </div>
      {products.length > 0 ? (
        <>
          {currentProducts.map((eachProduct) => {
            console.log(eachProduct.fnsku_status, eachProduct.label_status);
            return (
              <div className="admin-order-accepted-display-of-products-container">
                <p className="admin-order-accepted-order-id-sub-category">
                  {eachProduct.id}
                </p>
                <p className="admin-order-accepted-name-sub-category">
                  {eachProduct.name}
                </p>
                <p className="admin-order-accepted-service-sub-category">
                  {eachProduct.product}
                </p>
                <p className="admin-order-accepted-quantity-sub-category">
                  {eachProduct.unit}
                </p>
                <p className="admin-order-accepted-order-tracking-sub-category"><a href={eachProduct.tracking_url} rel="noreferrer" target="_blank" className="tracking-url" >
                  Order Link
                </a>
                </p>
                {/* <button className="admin-order-accepted-received-button">Received</button>
            <button className="admin-order-accepted-declined-button">Decline</button> */}
                <div className="admin-order-accepted-fnsku-sub-category">
                  <input
                    type="checkbox"
                    checked={eachProduct.fnsku_status === "1" ? true : false}
                    className="admin-order-accepted-checkbox"
                  />
                </div>
                <div className="admin-order-accepted-box-label-sub-category">
                  <input
                    type="checkbox"
                    checked={eachProduct.label_status === "1" ? true : false}
                    className="admin-order-accepted-checkbox"
                  />
                </div>
                <BsFillArrowRightCircleFill
                  id={eachProduct.id}
                  value={eachProduct.id}
                  onClick={(e) => openDetailPage(e, eachProduct.id)}
                  className="admin-order-accepted-view-in-detail-sub-category"
                />
              </div>
            );
          })}
          <div className="pagination-button-container">
            <BsFillArrowLeftCircleFill
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={previousButton}
            />

            <span>Page {currentPage}</span>

            <BsFillArrowRightCircleFill
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastProduct >= products.length}
              className={NextButton}
            />
          </div>
        </>
      ) : (
        <EmptyOrder />
      )}
    </div>
      )
    }
</>
  )
}

export default AdminOrdersRejected;
