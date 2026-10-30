'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '@styles/chooseArchetypePage.scss'
import Header from '../_Header'
import { archetypes } from '@data/archetypes'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@redux/stores'
import { updateUser } from '@redux/reducers/User'
import { supabase } from '@/lib/supabaseClient'

// Step 1 of onboarding: let the user choose an archetype
const ChooseArchetypePage = () => {
  const dispatch = useAppDispatch()
  const { gender, skinTone } = useSelector((state: RootState) => state.User)
  const router = useRouter()

  // Redirect logged-in users to the mirror page
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/the-mirror')
      }
    })
  }, [router])

  return (
    <div className="container">
      <Header title="Choose Your Archetype" backUrl="/" />

      {/* Filters */}
      <div className="filters">
        {/* Gender */}
        <div className="pill-toggle">
          <button
            className={`pill ${gender === 'male' ? 'selected' : ''}`}
            onClick={() => dispatch(updateUser({ gender: 'male' }))}>
            Male
          </button>
          <button
            className={`pill ${gender === 'female' ? 'selected' : ''}`}
            onClick={() => dispatch(updateUser({ gender: 'female' }))}>
            Female
          </button>
        </div>

        {/* Color */}
        <div className="pill-toggle">
          <button
            className={`pill swatch-pill ${skinTone === 'light' ? 'selected' : ''}`}
            onClick={() => dispatch(updateUser({ skinTone: 'light' }))}>
            <div className="swatch-color light" />
          </button>
          <button
            className={`pill swatch-pill ${skinTone === 'dark' ? 'selected' : ''}`}
            onClick={() => dispatch(updateUser({ skinTone: 'dark' }))}>
            <div className="swatch-color dark" />
          </button>
        </div>
      </div>

      {/* Archetype cards */}
      <div className="archetype-list">
        {archetypes.map(archetype => (
          <div key={archetype.name} className="archetype-card">
            <div className="image-container">
              <h3 className="name">{archetype.name}</h3>
              <Image src={archetype.image} alt={archetype.name} width={210} height={260} />
              {archetype.motto && <span className="motto">{archetype.motto}</span>}
            </div>

            <div className="details">
              <div className="core-group">
                <h4>Core Values</h4>
                <div className="pills">
                  {archetype.coreValues.map(value => (
                    <div key={value} className="pill size-s">
                      {value}
                    </div>
                  ))}
                </div>
              </div>

              <div className="core-group">
                <h4>Core Rituals</h4>
                <div className="pills">
                  {archetype.coreRituals.map(ritual => (
                    <div key={ritual} className="pill size-s">
                      {ritual}
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/onboarding/2-customize-your-code"
                className="button stroke pink size-s"
                onClick={() => dispatch(updateUser({ archetypeName: archetype.name }))}>
                <span className="button-content">
                  Select This Path
                  <i className="fa-solid fa-circle-chevron-right"></i>
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChooseArchetypePage
