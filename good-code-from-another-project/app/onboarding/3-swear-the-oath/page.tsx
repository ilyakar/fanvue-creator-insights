'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import '@styles/swearOathPage.scss'
import Header from '../_Header'
import MyFutureSelfCard from '../../Components/MyFutureSelfCard'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/stores'
import { getArchetype } from '@data/archetypes'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

// Step 3 of onboarding: user agrees to the 30-day oath
const SwearTheOathPage = () => {
  const [isChecked, setIsChecked] = useState(false)
  const router = useRouter()
  const { archetypeName, values, rituals } = useSelector((state: RootState) => state.User)

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
  if (!(archetypeName && values.length > 0 && rituals.length > 0)) {
    router.replace('/onboarding/2-customize-your-code')
    return
  }
  // ----------

  const archetype = getArchetype(archetypeName)

  // Moves user to account creation once oath is accepted
  const _handleNextPress = () => {
    if (!isChecked) {
      return
    }
    router.push('/onboarding/4-create-account-and-login')
  }

  return (
    <div className="container">
      <Header title="Swear The Oath" marginBottom="l" backUrl="/onboarding/2-customize-your-code" />
      <section className="page-content">
        <MyFutureSelfCard archetypeName={archetype.name} values={values} rituals={rituals} />
        <section className="swear-oath-section">
          <div className="oath-text">
            <p>YOUR ARCHETYPE HAS BEEN CHOSEN.</p>
            <p>YOUR CODE HAS BEEN FORGED.</p>
            <p>NOW SWEAR THE OATH - OR TURN BACK.</p>
            <p>FOR THE NEXT 30 DAYS, YOUR CODE IS SACRED.</p>
            <p>NO EDITS. NO RESETS. ONLY ALIGNMENT.</p>
          </div>

          <button
            type="button"
            className={`checkbox-section ${isChecked ? 'checked' : ''}`}
            onClick={() => setIsChecked(!isChecked)}>
            <div className="checkbox">
              <i className="fas fa-check" />
            </div>
            <div className="text">I swear to walk this path with integrity</div>
          </button>

          <button onClick={_handleNextPress} className={`button stroke pink size-xl`} disabled={!isChecked}>
            <span className="button-content">
              Meet My Future Self
              <i className="fa-solid fa-circle-chevron-right"></i>
            </span>
          </button>
        </section>
      </section>
    </div>
  )
}

export default SwearTheOathPage
