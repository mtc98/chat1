import { Link } from 'react-router-dom'
import Avatar from '../components/Avatar'

// styles
import './ProjectList.css'

export default function ProjectList({ projects }) {
  console.log(projects)

  return (
    <div className="project-list">
      {projects.length === 0 && <p>目前沒有任何專案。</p>}
      {projects.map(project => (
        <Link to={`/projects/${project.id}`} key={project.id}>
          <h4>{project.name}</h4>
          <p>由 {project.createdBy.displayName} 建立</p>
          <p>截止日期：{project.dueDate.toDate().toDateString()}</p>
          <div className="assigned-to">
            <p><strong>指派給：</strong></p>
            <ul>
              {project.assignedUsersList.map(user => (
                <li key={user.photoURL}>
                  <Avatar src={user.photoURL} />
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  )
}
