'use client'

import { useRouter } from 'next/navigation'

// Reusable header for onboarding pages with a back button
const Header = ({
  title,
  marginBottom = 's',
  backUrl
}: {
  title: string
  marginBottom?: 's' | 'm' | 'l'
  backUrl: string
}) => {
  const router = useRouter()

  return (
    <header className={`onboarding-header margin-bottom-${marginBottom}`}>
      {/* Back button */}
      <button onClick={() => router.push(backUrl)} className="back-button">
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      {/* Title */}
      <h1 className="title">{title}</h1>
    </header>
  )
}

export default Header
