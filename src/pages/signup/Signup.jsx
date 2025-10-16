import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'

// styles
import './Signup.css'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailError, setThumbnailError] = useState(null)
  const { signup, isPending, error } = useSignup()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password, displayName, thumbnail)
  }

  const handleFileChange = (e) => {
    setThumbnail(null)
    let selected = e.target.files[0]
    console.log(selected)

    if (!selected) {
      setThumbnailError('請選擇一個檔案')
      return
    }
    if (!selected.type.includes('image')) {
      setThumbnailError('選擇的檔案必須是圖片')
      return
    }
    if (selected.size > 100000) {
      setThumbnailError('圖片檔案大小必須小於 100kb')
      return
    }
    
    setThumbnailError(null)
    setThumbnail(selected)
    console.log('頭像已更新')
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>sign up</h2>
      <label>
        <span>電子郵件:</span>
        <input
          required 
          type="email" 
          onChange={(e) => setEmail(e.target.value)} 
          value={email}
        />
      </label>
      <label>
        <span>密碼:</span>
        <input
          required
          type="password" 
          onChange={(e) => setPassword(e.target.value)} 
          value={password}
        />
      </label>
      <label>
        <span>顯示名稱:</span>
        <input
          required
          type="text" 
          onChange={(e) => setDisplayName(e.target.value)} 
          value={displayName}
        />
      </label>
      <label>
        <span>個人頭像:</span>
        <input 
          required
          type="file"
          onChange={handleFileChange}
        />
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      {!isPending && <button className="btn">註冊</button>}
      {isPending && <button className="btn" disabled>註冊中...</button>}
      {error && <div className="error">{error}</div>}
    </form>
  )
}
