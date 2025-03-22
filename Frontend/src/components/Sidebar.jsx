
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Home, Settings, User, Package, QrCode, Wrench, BarChart2, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Access the logout function from AuthContext
  const role = location.pathname.split("/")[1];

  const toggleSubMenu = (label) => {
    setIsOpen(true);
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  const handleSidebarToggle = () => {
    setIsOpen((prev) => {
      if (prev) setOpenMenu(null);
      return !prev;
    });
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
      setOpenMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/"); // Navigate to the home page
  };

  const menuItems = {
    admin: [
      { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
      {
        icon: Package, label: "Assets Management",
        subItems: [
          { name: "All Assets", path: "/admin/all-assets" },
          { name: "Add New Asset", path: "/admin/add-asset" },
          { name: "Asset History", path: "/admin/history" }
        ]
      },
      {
        icon: User, label: "Asset Allocation",
        subItems: [
          { name: "Assign Asset", path: "/admin/assign-asset" },
          { name: "Return Asset", path: "/admin/return-asset" },
          { name: "Asset Requests", path: "/admin/asset-requests" }
        ]
      },
      {
        icon: QrCode, label: "QR Code Management",
        subItems: [
          { name: "Generate QR Code", path: "/admin/generate-qr" },
          { name: "Scan QR Code", path: "/admin/scan-qr" },
          { name: "QR Code Logs", path: "/admin/admin-qr-logs" }
        ]
      },
      {
        icon: Wrench, label: "Maintenance & Repairs",
        subItems: [
          { name: "Scheduled Maintenance", path: "/admin/scheduled-maintenance" },
          { name: "Request Repair", path: "/admin/request-repair" },
          { name: "Repair Status", path: "/admin/repair-status" }
        ]
      },
      {
        icon: BarChart2, label: "Reports & Analytics", path: "/admin/asset-reports"
      },
      {
        icon: User, label: "Users & Roles",
        subItems: [
          { name: "All Users", path: "/admin/all-users" },
          { name: "Add User", path: "/admin/add-user" }
        ]
      }
    ],
    
    employee: [
      { icon: Home, label: "Dashboard", path: "/employee/dashboard" },
      {
        icon: Package, label: "My Asset",
        subItems: [
          { name: "View My Assets", path: "/employee/view-my-assets" },
          { name: "Return Request", path: "/employee/return-request" },
          { name: "Report an Issue", path: "/employee/report-issue" }
        ]
      },
      {
        icon: QrCode, label: "QR Code Scanner",
        subItems: [{ name: "Scan QR Code", path: "/employee/scan-qr" }]
      },
      {
        icon: Package, label: "Request Asset",
        subItems: [
          { name: "Request New Asset", path: "/employee/request-asset" },
          { name: "View Request Status", path: "/employee/request-status" }
        ]
      },
      {
        icon: Settings, label: "Help & Support",
        subItems: [
          { name: "Guidelines", path: "/employee/guidelines" },
          { name: "Contact IT/Admin", path: "/employee/contact-support" }
        ]
      }
    ]
  };

  return (
    <div className="flex h-screen relative">
      <div ref={sidebarRef} className={`h-screen bg-[var(--primary-dark)] text-[var(--white)] flex flex-col transition-all duration-500 fixed top-0 left-0 ${isOpen ? "w-64" : "w-16"}`}>
        <button className="mt-20 ml-2 p-2 text-[var(--white)]" onClick={handleSidebarToggle}>
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
        <nav className="flex-1 pt-4 pb-2">
          <ul className="p-0 m-0 list-none">
            {menuItems[role]?.map((item, index) => (
              <li key={index} className="p-3 rounded-md hover:bg-[var(--primary-medium)] cursor-pointer ml-1 mb-2">
                <div className="flex justify-between items-center" onClick={() => toggleSubMenu(item.label)}>
                  <Link to={item.path || "#"} className="flex gap-3">
                    {item.icon && <item.icon size={24} />} {isOpen && item.label}
                  </Link>
                  {item.subItems && isOpen && <ChevronDown size={18} className={`${openMenu === item.label ? "rotate-180" : ""}`} />}
                </div>
                {item.subItems && openMenu === item.label && isOpen && (
                  <ul className="ml-6 mt-2 list-none">
                    {item.subItems.map((subItem, subIndex) => (
                      <li key={subIndex} className="text-[var(--background-light)] p-2 cursor-pointer hover:text-[var(--accent)]">
                        <Link to={subItem.path}>{subItem.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-auto pb-4">
          <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-[var(--primary-medium)]">
            <LogOut size={24} /> {isOpen && "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;