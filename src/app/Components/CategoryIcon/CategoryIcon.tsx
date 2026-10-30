/* ------------------------------------------------------------
Adds a consistent visual cue without relying on colour alone to label a category.
---------------------------------------------------------------*/

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faLightbulb, faSliders } from '@fortawesome/free-solid-svg-icons'

import type { Category } from '@/lib/types'

export const categoryIcons = { love: faHeart, requests: faLightbulb, improve: faSliders }

// Adds a consistent visual cue without relying on colour alone to label a category.
const CategoryIcon = ({ category }: { category: Category }) => (
  <span className={`category-icon ${category}`}>
    <FontAwesomeIcon icon={categoryIcons[category]} />
  </span>
)

export default CategoryIcon
