'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '@styles/customizeCodePage.scss'
import Header from '../_Header'
import MyFutureSelfCard from '../../Components/MyFutureSelfCard'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '@redux/stores'
import { updateUser } from '@redux/reducers/User'
import { getArchetype } from '@data/archetypes'
import { supabase } from '@/lib/supabaseClient'

// Step 2 of onboarding: select additional values and rituals
const CustomizeYourCodePage = () => {
  const router = useRouter()
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [selectedRituals, setSelectedRituals] = useState<string[]>([])
  const dispatch = useAppDispatch()
  const { archetypeName } = useSelector((state: RootState) => state.User)

  // Redirect logged-in users to the mirror page
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/the-mirror')
      }
    })
  }, [router])

  // Check if all previous data has been collected
  // If not, redirect back
  if (!archetypeName) {
    router.replace('/onboarding/1-choose-archetype')
    return
  }
  // ----------

  const archetype = getArchetype(archetypeName || 'Stoic')!

  // Handles selecting/deselecting value or ritual pills
  const _handlePillClick = (pill: string, group: 'values' | 'rituals') => {
    const selected = group === 'values' ? selectedValues : selectedRituals
    const setSelected = group === 'values' ? setSelectedValues : setSelectedRituals

    if (selected.includes(pill)) {
      setSelected(selected.filter(p => p !== pill))
    } else if (selected.length < 2) {
      setSelected([...selected, pill])
    }
  }

  // Finalize selections and move to the oath step
  const _handleLockInPress = () => {
    // We make sure that two values and rituals have been selected
    if (selectedValues.length < 2 || selectedRituals.length < 2) {
      return
    }

    dispatch(
      updateUser({
        values: [...selectedValues, ...archetype.coreValues],
        rituals: [...selectedRituals, ...archetype.coreRituals]
      })
    )

    router.push('/onboarding/3-swear-the-oath')
  }

  const selectableValues = ['Stress Relief', 'Self-Compassion', 'Letting Go', 'Nurturing Growth']
  const selectableRituals = ['Mindfulness', 'Gratitude Practice', 'Breathing Exercises', 'Daily Reflection']

  return (
    <div className="container">
      <Header title="Customize Your Code" marginBottom="l" backUrl="/onboarding/1-choose-archetype" />
      <section className="page-content">
        <MyFutureSelfCard archetypeName={archetype.name} />

        <section className="choose-values-rituals-section">
          <div className="inner-section">
            <section className="choose-values-section">
              <section className="selection-section">
                <h4 className="heading">
                  Choose two
                  <br />
                  <span className="large">Values</span>
                </h4>

                <div className="pills-container">
                  {selectableValues.map(value => (
                    <div
                      key={value}
                      className={`pill selectable size-m ${selectedValues.includes(value) ? 'selected' : ''}`}
                      onClick={() => _handlePillClick(value, 'values')}>
                      {value}
                    </div>
                  ))}
                </div>
              </section>

              <section className="core-section">
                <h5 className="heading">
                  <span className="large">Core Values</span>
                  <br />({archetype.name} Archetype defaults)
                </h5>
                <div className="pills-container">
                  {archetype.coreValues.map(value => (
                    <div key={value} className="pill size-m">
                      {value}
                    </div>
                  ))}
                </div>
              </section>
            </section>

            <div className="vertical-line" />

            <section className="choose-rituals-section">
              <section className="selection-section">
                <h4 className="heading">
                  Choose two
                  <br />
                  <span className="large">Rituals</span>
                </h4>

                <div className="pills-container">
                  {selectableRituals.map(ritual => (
                    <div
                      key={ritual}
                      className={`pill selectable size-m ${selectedRituals.includes(ritual) ? 'selected' : ''}`}
                      onClick={() => _handlePillClick(ritual, 'rituals')}>
                      {ritual}
                    </div>
                  ))}
                </div>
              </section>

              <section className="core-section">
                <h5 className="heading">
                  <span className="large">Core Rituals</span>
                  <br />({archetype.name} Archetype defaults)
                </h5>
                <div className="pills-container">
                  {archetype.coreRituals.map(ritual => (
                    <div key={ritual} className="pill size-m">
                      {ritual}
                    </div>
                  ))}
                </div>
              </section>
            </section>
          </div>

          <button
            className="button stroke pink size-xl"
            onClick={_handleLockInPress}
            disabled={selectedValues.length < 2 || selectedRituals.length < 2}>
            <span className="button-content">
              Lock In My Code
              <i className="fa-solid fa-circle-chevron-right"></i>
            </span>
          </button>
        </section>
      </section>
    </div>
  )
}

export default CustomizeYourCodePage
