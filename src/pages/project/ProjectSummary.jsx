import Avatar from "../../components/Avatar"
import { useFirestore } from "../../hooks/useFirestore"
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from "../../hooks/useAuthContext"

export default function ProjectSummary({ project }) {
  const { deleteDocument } = useFirestore('projects')
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const handleClick = () => {
    deleteDocument(project.id)
    navigate('/')
  }

  return (
    <div>
      <div className="project-summary">
        <h2 className="page-title">{project.name}</h2>
        <p>由 {project.createdBy.displayName} 建立</p>
        {/* console.log(project) */}
        <p className="due-date">
          專案截止日期：{project.dueDate.toDate().toDateString()}
        </p>
        <p className="details">
          {project.details}
        </p>
        <h4>專案指派給：</h4>
        <div className="assigned-users">
          {project.assignedUsersList.map(user => (
            <div key={user.id}>
              <Avatar src={user.photoURL} />
            </div>
          ))}
        </div>
      </div>
      {user.uid === project.createdBy.id && (
        <button className="btn" onClick={handleClick}>標示為已完成</button>
      )}
    </div>
  )
}