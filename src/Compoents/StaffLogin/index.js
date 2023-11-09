// import React, { useState } from "react";
// import "./index.css";

// const StaffSigninPage = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Define the URL of your server's login endpoint
//     const url = "http://localhost:3009/api/v1/stafflogin";

//     // Create a JSON object with the form data
//     const jsonData = {
//       email: formData.email,
//       password: formData.password,
//     };

//     // Make a POST request using the fetch API with JSON data
//     fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json", // Set the Content-Type to JSON
//       },
//       body: JSON.stringify(jsonData), // Convert JSON object to string
//     })
//       .then((response) => {
//         if (response.status === 200) {
//           // Login successful
//           response.json().then((data) => {
//             // Store the token in sessionStorage
//             console.log(data.token, data.role)
//             sessionStorage.setItem("token", data.token);
//             sessionStorage.setItem("role",data.role)
//             console.log("Login successful");
//           });
//         } else {
//           // Handle other status codes or error messages
//           console.error("Login failed");
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   };

//   return (
//     <div className="signin-div-container">
//     <div className="signin-form-main-container">
//       <center>
//         <h2 className="signin-form-heading-container">Sign In</h2>
//       </center>
//       <form onSubmit={handleSubmit} className="signin-form-container">
//         <div className="signin-form-group-container">
//           <label className="signin-form-label-container">Email:</label>
//           <input
//             type="email"
//             name="email"
//             className="signin-input-text"
//             value={formData.email}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <div className="signin-form-group-container">
//           <label className="signin-form-label-container">Password:</label>
//           <input
//             type="password"
//             name="password"
//             className="signin-input-text"
//             value={formData.password}
//             onChange={handleInputChange}
//             required
//           />
//         </div>
//         <center>
//           <button className="signin-form-button-container" type="submit">
//             Sign In
//           </button>
//         </center>
//       </form>
//     </div>
//     </div>
//   );
// };

// export default StaffSigninPage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import React Router
import "./index.css";
import Toast from "../utlis/toast";

const StaffSigninPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(""); // State variable for error message
  const navigate = useNavigate(); // Get access to the navigation history

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error messages

    // Define the URL of your server's login endpoint
    const url = "http://localhost:3009/api/v1/stafflogin";

    // Create a JSON object with the form data
    const jsonData = {
      email: formData.email,
      password: formData.password,
    };

    // Make a POST request using the fetch API with JSON data
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the Content-Type to JSON
      },
      body: JSON.stringify(jsonData), // Convert JSON object to string
    })
      .then((response) => {
        if (response.status === 200) {
          // Login successful
          response.json().then((data) => {
            Toast.fire({
              icon: "success",
              title: data.message,
            });

            sessionStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            sessionStorage.setItem("sname", data.name);
            console.log("Login successful");
            if (data.role === "Admin") {
              navigate("/navbar");
            } else if (data.role === "Label") {
              navigate("/labelOrders");
            } else if (data.role === "Dimension") {
              navigate("/dimensionorders");
            } else if (data.role === "Accountant") {
              navigate("/accountOrders");
            }
          });
        } else if (response.status === 400) {
          // Password required or incorrect
          response.json().then((data) => {
            Toast.fire({
              icon: "error",
              title: data.message,
            });
          });
        } else {
          // Handle other status codes or error messages
          setError("Login failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Error occurred during login");
      });
  };

  const onClickCustomer = () => {
    navigate("/CustomerLogin");
  };

  return (
    <div className="signin-div-container">
      <div className="signin-form-main-container">
        <div className="signin-staff-customer-button-container">
          <button className="signin-staff-button">Staff Signin</button>
          <button className="signin-customer-button" onClick={onClickCustomer}>
            Customer Signin
          </button>
        </div>
        
        <center>
          <h2 className="signin-form-heading-container">Staff Login</h2>
        </center>

        <form onSubmit={handleSubmit} className="signin-form-container">
          <div className="signin-form-group-container">
            <label className="signin-form-label-container">Email:</label>
            <input
              type="email"
              name="email"
              className="signin-input-text"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="signin-form-group-container">
            <label className="signin-form-label-container">Password:</label>
            <input
              type="password"
              name="password"
              className="signin-input-text"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <center>
            <button className="signin-form-button-container" type="submit">
              Sign In
            </button>
            {error && <p className="error-message">{error}</p>}{" "}
            {/* Display error message */}
          </center>
        </form>
      </div>
    </div>
  );
};

export default StaffSigninPage;
