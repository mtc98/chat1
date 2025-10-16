import { useState, useEffect } from 'react'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useNavigate } from 'react-router'
import Select from 'react-select'

// styles
import './Create.css'

const categories = [
  { value: 'development', label: '開發' },
  { value: 'design', label: '設計' },
  { value: 'sales', label: '業務' },
  { value: 'marketing', label: '行銷' },
]

export default function Create() {
  const navigate = useNavigate()
  const { addDocument, response } = useFirestore('projects')
  const { user } = useAuthContext()
  const { documents } = useCollection('userdojo')
  const [users, setUsers] = useState([])

  // form field values
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [formError, setFormError] = useState(null)

  // create user values for react-select
  useEffect(() => {
    if(documents) {
      setUsers(documents.map(user => {
        return { value: {...user, id: user.id}, label: user.displayName }
      }))
    }
  }, [documents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!category) {
      setFormError('請選擇一個專案類別。')
      return
    }
    if (assignedUsers.length < 1) {
      setFormError('請至少指派一位使用者。')
      return
    }

    const assignedUsersList = assignedUsers.map(u => {
      return { 
        displayName: u.value.displayName, 
        photoURL: u.value.photoURL,
        id: u.value.id
      }
    })
    const createdBy = { 
      displayName: user.displayName, 
      photoURL: user.photoURL,
      id: user.uid
    }

    const project = {
      name,
      details,
      assignedUsersList, 
      createdBy,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: []
    }

    await addDocument(project)
    if (!response.error) {
      navigate('/')
    }
  }

  return (
    <div className="create-form">
      <h2 className="page-title">建立新專案</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>專案名稱：</span>
          <input
            required 
            type="text" 
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>專案詳情：</span>
          <textarea 
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details} 
          ></textarea>
        </label>
        <label>
          <span>設定截止日期：</span>
          <input
            required 
            type="date" 
            onChange={(e) => setDueDate(e.target.value)} 
            value={dueDate}
          />
        </label>
        <label>
          <span>專案類別：</span>
          <Select
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>
        <label>
          <span>指派給：</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti
          />
        </label>

        <button className="btn">新增專案</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}
