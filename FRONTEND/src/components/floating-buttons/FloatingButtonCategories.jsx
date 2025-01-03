import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import PropTypes from 'prop-types'

const FloatingButtonCategories = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
    onToggle(!isOpen)
  }

  return (
    <strong className="clase-contraria">
    <button
      onClick={handleClick}
      className="fixed bg-[#293e68] mt-2 top-2 right-16 text-white p-3 rounded-lg shadow-lg z-50"
      title="Categorías"
    >
      <FaSearch />
    </button>
    </strong>
  )
}

FloatingButtonCategories.propTypes = {
  onToggle: PropTypes.func.isRequired,
}

export default FloatingButtonCategories
