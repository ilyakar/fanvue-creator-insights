/* ------------------------------------------------------------
Introduces the product through a concise promise, a real interface preview and the core creator journey.
---------------------------------------------------------------*/

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faAsterisk,
  faStar,
  faCheck,
  faHeart,
  faLightbulb,
  faLink,
  faShieldHalved,
  faSliders,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons'

import { getPreviewAnalysis } from '@/lib/data/preview'

import Brand from './Components/Brand/Brand'
import ProductPreview from './Components/ProductPreview/ProductPreview'
import ThemeToggle from './Components/Theme/ThemeToggle'
import '@styles/homePage.scss'

export const dynamic = 'force-dynamic'

// Introduces the product through a concise promise, a real interface preview and the core creator journey.
const HomePage = async () => {
  const { audienceFeedback, savedAnalysis } = await getPreviewAnalysis()

  return (
    <div className="landing-page">
      <header className="landing-header">
        <Brand />

        <nav aria-label="Website navigation">
          <a href="#a-little-clarity">Why Insights</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <ThemeToggle />

        <a className="button primary" href="/api/auth/fanvue">
          Start free <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </header>

      <main id="main-content">
        <section className="landing-hero">
          <h1>
            Know what your
            <br />
            fans want <span>next.</span>
          </h1>

          <p>
            Find praise, requests and suggestions in Fanvue comments, with the original feedback behind every insight.
          </p>

          <a className="button primary hero-cta" href="/api/auth/fanvue">
            Start free <FontAwesomeIcon icon={faArrowRight} />
          </a>

          <span className="hero-reassurance">
            <FontAwesomeIcon icon={faCheck} />
            Connect with Fanvue. No extra account needed.
          </span>

          <div className="hero-product">
            <div className="product-glow" />
            <ProductPreview audienceFeedback={audienceFeedback} insights={savedAnalysis.insights} />

            <div className="floating-note">
              <span aria-hidden="true">
                <FontAwesomeIcon icon={faStar} />
              </span>

              <div>
                Turn fan requests into <strong>your next content idea.</strong>
              </div>
            </div>
          </div>

          <p className="preview-caption">Dashboard preview with sample data and illustrative insights.</p>
        </section>

        <section className="benefits-section" id="a-little-clarity">
          <div className="section-intro">
            <h2>Find out what fans love, want and would change</h2>
          </div>

          <div className="benefit-grid">
            {[
              {
                category: 'love',
                icon: faHeart,
                title: 'What fans love',
                description: 'Find the moments, themes and details fans praise most.'
              },
              {
                category: 'requests',
                icon: faLightbulb,
                title: 'What fans want next',
                description: 'See which content ideas and requests come up in comments.'
              },
              {
                category: 'improve',
                icon: faSliders,
                title: 'What could be better',
                description: 'Identify recurring frustrations and suggestions for improvement.'
              }
            ].map(benefit => (
              <article className={`benefit ${benefit.category}`} key={benefit.category}>
                <span className="benefit-icon">
                  <FontAwesomeIcon icon={benefit.icon} />
                </span>

                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-intro">
            <h2>How it works</h2>
            <p>Connect your account, understand the feedback and decide what to create next.</p>
          </div>

          <ol className="steps-grid">
            {[
              {
                number: '1',
                icon: faLink,
                title: 'Connect your account',
                description: 'Sign in securely with the account you already use. No forms, no new password.'
              },
              {
                number: '2',
                icon: faWandMagicSparkles,
                title: 'Understand your fans',
                description: 'AI groups sample comments into praise, requests and suggestions.'
              },
              {
                number: '3',
                icon: faLightbulb,
                title: 'Plan your next post',
                description: 'Explore the insights, read the original comments and decide what comes next.'
              }
            ].map(step => (
              <li key={step.number}>
                <div className="step-heading">
                  <span className="step-icon" aria-hidden="true">
                    <FontAwesomeIcon icon={step.icon} />
                  </span>

                  <span className="step-number">Step {step.number}</span>
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>

          <div className="sample-disclosure">
            <FontAwesomeIcon icon={faShieldHalved} />

            <p>
              <strong>A real Fanvue connection. Sample audience data.</strong> This prototype analyses fictional posts
              and comments with real AI. Your actual Fanvue content stays untouched.
            </p>
          </div>
        </section>

        <section className="final-cta">
          <span className="cta-star" aria-hidden="true">
            <FontAwesomeIcon icon={faAsterisk} />
          </span>

          <h2>Explore your audience insights</h2>

          <a className="button primary" href="/api/auth/fanvue">
            Start free <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </section>
      </main>

      <footer className="landing-footer">
        <Brand />
        <span>Made for creators. Built around connection.</span>

        <div>
          <Link href="/privacy">Privacy & data</Link>
          <Link href="/terms">About this prototype</Link>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
