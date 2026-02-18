import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
const AdminLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="container admin">
      <div className="naslovna"></div>
      <div className="row">
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-3 position-relative">
              <div className="profile_pic">
                <img
                src="https://i.pravatar.cc/300"
                alt=""
                className=""
              />
              </div>
            </div>
            <div className="col-md-9 px-3 py-3">
              <h1>Settings</h1>
            </div>
          </div>
        </div>
        <div className="col-md-6 px-3 py-3 ms-auto">
            <button className="btn btn-info">Cancle</button>
            <button className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
};
export default AdminLayout;
