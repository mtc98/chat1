import { useState } from 'react'

const filterList = [
  { key: 'all', label: '全部' },
  { key: 'mine', label: '我的專案' },
  { key: 'development', label: '開發' },
  { key: 'design', label: '設計' },
  { key: 'marketing', label: '行銷' },
  { key: 'sales', label: '業務' },
]

export default function ProjectFilter({ changeFilter }) {
  const [currentFilter, setCurrentFilter] = useState('all')

  const handleClick = (newFilter) => {
    setCurrentFilter(newFilter)
    changeFilter(newFilter)
  }

  return (
    <div className="project-filter">
      <nav>
        <p>篩選：</p>
        {filterList.map((f) => (
          <button key={f.key}
            onClick={() => handleClick(f.key)}
            className={currentFilter === f.key ? 'active' : ''}
          >{f.label}</button>
        ))}
      </nav>
    </div>
  )
}