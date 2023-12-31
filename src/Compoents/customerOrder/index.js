import React, { useState, useEffect } from "react";
import "./index.css";
import Toast from "../utlis/toast";

const CustomerOrder = ({ history }) => {
  const [date, setDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [servicesReq, setServicesReq] = useState("Prep Service");
  const [productName, setProductName] = useState("");
  const [units, setUnits] = useState("");
  const [trackingURL, setTrackingURL] = useState("");
  const [fnskuSendFiles, setFnskuSendFiles] = useState([]);
  const [labelSendFiles, setLabelSendFiles] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [instructions, setInstructions] = useState("");
  

  const FETCH_URL = process.env.REACT_APP_FETCH_URL;

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    fetch(`${FETCH_URL}customerdata`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // You should include your authorization token here
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Assuming the response is in JSON format
        } else {
          throw new Error("Failed to fetch customer data");
        }
      })
      .then((data) => {
        // Set the customerName in the state based on the response data
        setCustomerName(data.name);
        setCustomerId(data.id);
      })
      .catch(() => {});
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    setDate(formattedDate);
  }, [FETCH_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "date":
        setDate(value);
        break;
      case "customerName":
        setCustomerName(value);
        break;
      case "servicesReq":
        setServicesReq(value);
        break;
      case "productName":
        setProductName(value);
        break;
      case "units":
        setUnits(value);
        break;
      case "trackingURL":
        setTrackingURL(value);
        break;
      case "instructions":
        setInstructions(value);
        break;
      default:
        break;
    }
  };

  const handleFnskuSendChange = (e) => {
    const files = e.target.files;
    setFnskuSendFiles([...fnskuSendFiles, ...files]);
  };

  const handleLabelSendChange = (e) => {
    const files = e.target.files;
    setLabelSendFiles([...labelSendFiles, ...files]);
  };

  const handleSubmit = async (e) => {
    console.log("submit called");
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("date", date);
      formData.append("customerName", customerName);
      formData.append("service", servicesReq);
      formData.append("product", productName);
      formData.append("units", units);
      formData.append("tracking_url", trackingURL);

      // Append multiple files for fnskuSend
      fnskuSendFiles.forEach((file, index) => {
        formData.append(`fnskuSendFiles`, file);
      });

      labelSendFiles.forEach((file, index) => {
        formData.append(`labelSendFiles`, file);
      });

      formData.append("customer_id", customerId);
      formData.append("instructions", instructions);

      const response = await fetch(`${FETCH_URL}customerorder`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log(response);

      if (response.ok) {
        response.json().then((data) => {
          Toast.fire({
            icon: "success",
            title: data.message,
          });
        });
        setProductName("");
        setUnits("");
        setTrackingURL("");
        setFnskuSendFiles([]);
        setLabelSendFiles([]);
        setInstructions("");
      } else {
        response.json().then((data) => {
          Toast.fire({
            icon: "error",
            title: data.message,
          });
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="order-customer-container">
        <center>
          <h1 className="order-customer-main-heading">Post Order</h1>
        </center>
        <form onSubmit={handleSubmit}>
          <div className="order-customer-from-container">
            <div className="order-customer-field1-container">
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">Date:</label>
                <input
                  className="order-customer-lable-container"
                  type="date"
                  name="date"
                  value={date}
                  onChange={handleChange}
                  required
                  readOnly
                />
              </div>
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Customer Name:
                </label>
                <input
                  className="order-customer-lable-container"
                  type="text"
                  name="customerName"
                  value={customerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  FNSKU ({fnskuSendFiles.length} files selected):
                </label>
                <input
                  className="order-customer-lable-container order-customer-label-file"
                  type="file"
                  name="fnskuSend"
                  onChange={handleFnskuSendChange}
                  multiple
                />
              </div>
            </div>
            <div className="order-customer-field2-container">
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Service Required:
                </label>
                <select
                  className="order-customer-lable-container"
                  name="servicesReq"
                  value={servicesReq}
                  onChange={handleChange}
                  required
                >
                  <option value="Prep Service">Prep Service</option>
                </select>
              </div>
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Product Name:
                </label>
                <input
                  className="order-customer-lable-container"
                  type="text"
                  name="productName"
                  value={productName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Label ({labelSendFiles.length} files selected):
                </label>
                <input
                  className="order-customer-lable-container order-customer-label-file"
                  type="file"
                  name="labelSend"
                  onChange={handleLabelSendChange}
                  multiple
                />
              </div>
            </div>
            <div className="order-customer-field3-container">
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">Units:</label>
                <input
                  className="order-customer-lable-container"
                  type="number"
                  name="units"
                  value={units}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Tracking URL:
                </label>
                <input
                  className="order-customer-lable-container"
                  type="text"
                  name="trackingURL"
                  value={trackingURL}
                  onChange={handleChange}
                />
              </div>
              <div className="order-customer-input-feild">
                <label className="order-customer-label-name">
                  Instructions:
                </label>
                <input
                  className="order-customer-lable-container"
                  type="text"
                  name="instructions"
                  value={instructions}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="order-customer-submit-button-container">
            <button className="order-customer-button-container" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomerOrder;
