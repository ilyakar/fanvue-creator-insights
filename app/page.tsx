/* ------------------------------------------------------------
Introduces the product through a concise promise, a real interface preview and the core creator journey.
---------------------------------------------------------------*/

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faCheck,
  faHeart,
  faLightbulb,
  faLink,
  faShieldHalved,
  faSliders,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons'

import { getPreviewModel } from '@/lib/data/preview'

import Brand from './Components/Brand/Brand'
import ProductPreview from './Components/ProductPreview/ProductPreview'
import '@styles/homePage.scss'

export const dynamic = 'force-dynamic'

// Introduces the product through a concise promise, a real interface preview and the core creator journey.
const HomePage = async () => {
  const model = await getPreviewModel()

  return (
    <div className="landing-page">
      <header className="landing-header">
        <Brand />

        <nav aria-label="Website navigation">
          <a href="#a-little-clarity">Why Insights</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <a className="button primary" href="/api/auth/fanvue">
          Start free <FontAwesomeIcon icon={faArrowRight} />
        </a>
      </header>

      <main id="main-content">
        <section className="landing-hero">
          <div className="hero-kicker">
            <span>✳</span> LESS GUESSING. MORE CONNECTION.
          </div>

          <h1>
            Know what your
            <br />
            fans want <span>next.</span>
          </h1>

          <p>
            They’re already telling you. Turn your Fanvue comments into clear insights about what they love and what
            they’d love to see more of.
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
            <ProductPreview dataset={model.dataset} insights={model.result!.insights} />

            <div className="floating-note">
              <span>✦</span>

              <div>
                Less scrolling.<strong>More “oh, that’s a good idea.”</strong>
              </div>
            </div>
          </div>

          <p className="preview-caption">
            A peek at your new perspective. Dashboard shown with sample data and illustrative insights.
          </p>
        </section>

        <section className="benefits-section" id="a-little-clarity">
          <div className="section-intro">
            <span className="eyebrow">A LITTLE CLARITY GOES A LONG WAY</span>

            <h2>
              Behind every comment,
              <br />
              there’s a little direction.
            </h2>

            <p>Get past the noise and closer to what matters to your audience.</p>
          </div>

          <div className="benefit-grid">
            {[
              {
                category: 'love',
                icon: faHeart,
                title: 'More of what they love.',
                description: 'Find the moments, themes and little details that keep your fans coming back.',
                label: 'Discover what resonates'
              },
              {
                category: 'requests',
                icon: faLightbulb,
                title: 'Your next good idea.',
                description: 'Spot the requests and suggestions hiding in your comments. Your audience has plenty.',
                label: 'Know what to create next'
              },
              {
                category: 'improve',
                icon: faSliders,
                title: 'Room to get even better.',
                description: 'Understand recurring frustrations, with helpful context and a clear place to start.',
                label: 'Make small, meaningful changes'
              }
            ].map(benefit => (
              <article className={`benefit ${benefit.category}`} key={benefit.category}>
                <span className="benefit-icon">
                  <FontAwesomeIcon icon={benefit.icon} />
                </span>

                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
                <span className="benefit-label">{benefit.label}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="section-intro">
            <span className="eyebrow">FROM COMMENTS TO CLARITY</span>

            <h2>
              A fresh perspective.
              <br />
              Without the extra work.
            </h2>
          </div>

          <div className="steps-grid">
            {[
              {
                number: '01',
                icon: faLink,
                title: 'Connect your Fanvue.',
                description: 'Sign in securely with the account you already use. No forms, no new password.'
              },
              {
                number: '02',
                icon: faWandMagicSparkles,
                title: 'Let the themes come through.',
                description: 'AI looks for the ideas, praise and requests your audience keeps coming back to.'
              },
              {
                number: '03',
                icon: faLightbulb,
                title: 'Create with a little more clarity.',
                description: 'Explore the insights, read the original comments and decide what comes next.'
              }
            ].map(step => (
              <article key={step.number}>
                <span className="step-number">{step.number}</span>
                <FontAwesomeIcon icon={step.icon} />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>

          <div className="sample-disclosure">
            <FontAwesomeIcon icon={faShieldHalved} />

            <p>
              <strong>A real Fanvue connection. Sample audience data.</strong> This prototype analyses fictional posts
              and comments with real AI. Your actual Fanvue content stays untouched.
            </p>
          </div>
        </section>

        <section className="final-cta">
          <span className="cta-star">✳</span>
          <span className="eyebrow">YOUR AUDIENCE HAS SOMETHING TO SAY</span>

          <h2>
            Let’s turn a little listening
            <br />
            into your next <span>good thing.</span>
          </h2>

          <a className="button primary" href="/api/auth/fanvue">
            Start free <FontAwesomeIcon icon={faArrowRight} />
          </a>

          <span className="cta-note">Less guesswork looks good on you.</span>
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
