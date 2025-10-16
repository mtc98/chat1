import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

// styles & images
import './Navbar.css'
import Temple from '../assets/temple.svg'

export default function Navbar() {
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext()

  return (
    <nav className="navbar">
      <ul>
        <li className="logo">
          <img src={Temple} alt="dojo logo" />
          <span>The Dojo</span>
        </li>

        {!user && (
          <>
            <li><Link to="/login">登入</Link></li>
            <li><Link to="/signup">註冊</Link></li>
          </>
        )}

        {user && (
          <li>
            {!isPending && <button className="btn" onClick={logout}>登出</button>}
            {isPending && <button className="btn" disabled>登出中...</button>}
          </li>
        )}
      </ul>
    </nav>
  )
}
