import { NavLink } from "react-router-dom"
import { useAuthContext } from '../hooks/useAuthContext'

// components
import Avatar from "./Avatar"

// styles & images
import "./Sidebar.css"
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'

export default function Sidebar() {
  const { user } = useAuthContext()

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          <Avatar src={user.photoURL} />
          <p> 嗨 ! {user.displayName}</p>  
        </div>  
        <nav className="links">
          <ul>
            <li>
              <NavLink exact to="/">
                <img src={DashboardIcon} alt="儀表板圖示" />
                <span>佈告欄</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/create">
                <img src={AddIcon} alt="新增專案圖示" />
                <span>新增專案</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
