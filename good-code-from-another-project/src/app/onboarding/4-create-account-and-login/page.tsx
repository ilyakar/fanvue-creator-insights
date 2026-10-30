'use client'

import { useState, useEffect } from 'react'
import { useAlert } from '@/app/AlertProvider'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import '@styles/create-account-and-login.scss'
import Header from '../_Header'
import MyFutureSelfCard from '../../Components/MyFutureSelfCard'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@redux/stores'
import { getArchetype } from '@data/archetypes'

// Final onboarding step: create account and log in
const SwearTheOathPage = () => {
  const router = useRouter()
  const showAlert = useAlert()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isValidUsername, setIsValidUsername] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [isValidPassword, setIsValidPassword] = useState(false)
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(false)
  const { archetypeName, values, rituals, gender, skinTone } = useSelector((state: RootState) => state.User)

  // Redirect logged-in users to the mirror page
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/the-mirror')
      }
    })
  }, [router])

  useEffect(() => {
    const usernameRegex = /^[a-zA-Z0-9_]{6,20}$/
    setIsValidUsername(usernameRegex.test(username))

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(emailRegex.test(email))

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
    setIsValidPassword(passwordRegex.test(password))

    setDoPasswordsMatch(password.length > 0 && password === confirmPassword)
  }, [username, email, password, confirmPassword])

  // Check if all previous data has been collected
  // If not, redirect back
  if (!(archetypeName && values.length > 0 && rituals.length > 0)) {
    router.replace('/onboarding/2-customize-your-code')
    return
  }
  // ----------

  const archetype = getArchetype(archetypeName)

  const isFormValid = isValidUsername && isValidEmail && isValidPassword && doPasswordsMatch

  // Creates the user account after validating fields
  const handleSubmit = () => {
    if (!isFormValid) return

    const lowerUsername = username.toLowerCase()
    const lowerEmail = email.toLowerCase()

    // Step 1: Check if username OR email is taken
    supabase
      .from('users')
      .select('username, email')
      .or(`username.ilike.${lowerUsername},email.ilike.${lowerEmail}`)
      .then(({ data, error }) => {
        if (error) {
          showAlert('Error checking username/email: ' + error.message, 'danger')
          return
        }

        const isUsernameTaken = data?.some(user => user.username.toLowerCase() === lowerUsername)
        const isEmailTaken = data?.some(user => user.email?.toLowerCase() === lowerEmail)

        if (isUsernameTaken) {
          showAlert('This username is already taken.', 'warning')
          return
        }

        if (isEmailTaken) {
          showAlert('This email is already registered.', 'warning')
          return
        }

        // Step 2: Sign up the user via Auth
        supabase.auth
          .signUp({ email: lowerEmail, password: password })
          .then(({ data, error }) => {
            if (error) {
              showAlert(error.message, 'danger')
              return
            }

            const user = data.user

            if (user) {
              // Step 3: Insert into public.users
              supabase
                .from('users')
                .insert({
                  id: user.id,
                  email: lowerEmail,
                  username: username,
                  archetype_name: archetypeName,
                  gender: gender,
                  skin_tone: skinTone,
                  values: values,
                  rituals: rituals
                })
                .then(({ error }) => {
                  if (error) {
                    showAlert('Error saving user profile: ' + error.message, 'danger')
                  } else {
                    router.push('/the-mirror')
                  }
                })
            }
          })
          .catch(err => {
            showAlert('Unexpected error during signup: ' + err.message, 'danger')
          })
      })
  }

  return (
    <div className="container">
      <Header title="Create Account" marginBottom="l" backUrl="/onboarding/3-swear-the-oath" />
      <section className="page-content">
        <MyFutureSelfCard archetypeName={archetype.name} values={values} rituals={rituals} />
        <section className="create-account-and-login-section">
          <div className="form">
            <div className="form-group">
              <label htmlFor="username">
                Username
                <small>6–20 characters, letters, numbers, or underscores</small>
              </label>

              <div className={`input-wrapper ${isValidUsername ? 'valid' : ''}`}>
                <input
                  id="username"
                  type="text"
                  placeholder="TranquilMonk"
                  value={username}
                  maxLength={20}
                  onChange={e => setUsername(e.target.value)}
                  onKeyDown={e => {
                    const allowed = /^[a-zA-Z0-9_]$/
                    if (e.key.length === 1 && !allowed.test(e.key)) {
                      e.preventDefault()
                    }
                  }}
                  onPaste={e => {
                    e.preventDefault()
                    const text = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9_]/g, '')
                    setUsername(prev => (prev + text).slice(0, 20))
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <div className={`input-wrapper ${isValidEmail ? 'valid' : ''}`}>
                <input
                  id="email"
                  type="email"
                  placeholder="jack@archetype.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
                <small>Minimum 8 characters, must include a letter and a number</small>
              </label>

              <div className={`input-wrapper ${isValidPassword ? 'valid' : ''}`}>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>

              <div className={`input-wrapper ${doPasswordsMatch ? 'valid' : ''}`}>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button className="button stroke pink size-xl" disabled={!isFormValid} onClick={handleSubmit}>
            <span className="button-content">
              Enter The Sanctum
              <i className="fa-solid fa-circle-chevron-right"></i>
            </span>
          </button>
        </section>
      </section>
    </div>
  )
}

export default SwearTheOathPage
