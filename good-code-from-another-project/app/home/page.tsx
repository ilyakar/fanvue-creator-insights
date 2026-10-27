import Image from 'next/image'
import Link from 'next/link'
import '@styles/homePage.scss'
import TestimonialCarousel from './TestimonialCarousel'

// Landing page introducing Archetype and its features
const HomePage = () => {
  return (
    <>
      <section className="hero-section">
        <Image className="logo" src="/logo.png" alt="Archetype Logo" width="178" height="24" />
        <div className="image-container">
          <Image src="/home-hero-characters.png" alt="Four Archetypes" width="500" height="500" />
        </div>
        <div className="content">
          <h1>
            Meet your version who
            <br />
            never breaks a promise
          </h1>
          <Link href="/onboarding/1-choose-archetype" className="button stroke green size-xl">
            <span className="button-content">
              Begin My Initiation
              <i className="fa-solid fa-circle-chevron-right"></i>
            </span>
          </Link>
        </div>
      </section>

      <div className="container">
        <div className="home-content">
          {/* Social Proof Section */}
          <section className="social-proof">
            <div className="heading text-gradient-pink">70,000+ Heroes</div>
            <div className="subheading">
              Have already begun their path.
              <br />
              Don't fall behind.
            </div>

            <TestimonialCarousel />
          </section>

          <div className="card-xl">
            <div className="image-container image-glow__background">
              <div className="image-glow__foreground">
                <Image src="/home-shadow-character.jpg" width="330" height="440" alt="Shadow Character" />
              </div>
            </div>
            <div className="content">
              <div className="mini-heading text-gradient-pink">BECOME THE PERSON YOU SWORE TO BE</div>
              <h2 className="heading" style={{ fontSize: '4.875rem' }}>
                ARCHETYPE
              </h2>
              <p className="description">
                An AI-powered system that holds you ruthlessly accountable to your future self and connects you with
                others on the same path
              </p>
              <Link href="/onboarding/1-choose-archetype" className="button stroke green size-xl">
                <span className="button-content">
                  Begin My Initiation
                  <i className="fa-solid fa-circle-chevron-right"></i>
                </span>
              </Link>
            </div>
          </div>

          <div className="six-mini-cards-container">
            <div className="card-xl">
              <div className="content">
                <div className="mini-heading text-gradient-pink">IDENTITY RITUAL</div>
                <h2 className="heading">Create your Archetype</h2>
                <p className="description">
                  Define your unique values, rituals, and rules. Select the template. Forge your ideal future self.
                </p>
              </div>
            </div>

            <div className="card-xl">
              <div className="content">
                <div className="mini-heading text-gradient-pink">DAILY TRUTH</div>
                <h2 className="heading">Track your Alignment</h2>
                <p className="description">
                  A number that rises with discipline and drops with deviation. No excuses. Just evidence.
                </p>
              </div>
            </div>

            <div className="card-xl">
              <div className="content">
                <div className="mini-heading text-gradient-pink">FUTURE SELF</div>
                <h2 className="heading">Talk to your future self</h2>
                <p className="description">
                  Your mirror that grows with you, holds you accountable, helps you choose, and predicts regret. It
                  answers, "What would the person I swore to become do?”
                </p>
              </div>
            </div>

            <div className="card-xl">
              <div className="content">
                <div className="mini-heading text-gradient-pink">ASCENSION</div>
                <h2 className="heading">Unlock deeper versions</h2>
                <p className="description">
                  If your Alignment Score consistently surpasses a discipline threshold, you unlock stricter rituals,
                  deeper rules, and Archetype transformation.
                </p>
              </div>
            </div>

            <div className="card-xl">
              <div className="content">
                <div className="mini-heading text-gradient-pink">PUBLIC PROOF</div>
                <h2 className="heading">Prove alignment</h2>
                <p className="description">
                  Share your Discipline Profile. No followers, no clout, no easy dopamine. Just your values: visible.
                </p>
              </div>
            </div>

            <div className="card-xl">
              <div className="content">
                <div className="mini-heading text-gradient-pink">SOCIAL LAYER</div>
                <h2 className="heading">Connect by value</h2>
                <p className="description">
                  Later, connect with others, not by who they know, but by the standards they live by.
                </p>
              </div>
            </div>
          </div>

          <div className="card-xl">
            <div className="image-container image-glow__background">
              <div className="image-glow__foreground">
                <Image src="/home-social-network.jpg" width="330" height="440" alt="Shadow Character" />
              </div>
            </div>
            <div className="content">
              <div className="mini-heading text-gradient-pink">IDENTITY RECODE</div>
              <h2 className="heading">A New Social Network</h2>
              <p className="description">
                Built on character. Not Clout.
                <br />
                <br />
                Soon, Archetype will become a global graph of discipline, alignment, and spiritual integrity.
                <br />
                No likes. No followers. No vanity metrics.
                <br />
                You won’t follow influencers.
                <br />
                You’ll meet Archetypes: real people, living by their values.
              </p>
              <Link href="/onboarding/1-choose-archetype" className="button stroke green size-xl">
                <span className="button-content">
                  Begin My Initiation
                  <i className="fa-solid fa-circle-chevron-right"></i>
                </span>
              </Link>
            </div>
          </div>

          <div className="card-xl">
            <div className="content">
              <div className="mini-heading text-gradient-pink">FATE</div>
              <h2 className="heading">Future Vision</h2>
              <p className="description">
                The first Archetypes are being forged now.
                <br />
                The first rituals. The first code enforcements.
                <br />
                Only those on this waitlist will enter before the gates close. You’ll be part of the founding class.
              </p>
            </div>
          </div>

          <div className="card-xl">
            <div className="content">
              <div className="mini-heading text-gradient-pink">INVEST</div>
              <h2 className="heading">Invest in yourself</h2>
              <p className="description">
                This isn't a product drop.
                <br />
                It's a promise to your future self.
              </p>
            </div>
          </div>

          <Link
            href="/onboarding/1-choose-archetype"
            className="button full green size-xl"
            style={{ alignSelf: 'center' }}>
            <span className="button-content">
              Begin My Initiation
              <i className="fa-solid fa-circle-chevron-right"></i>
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default HomePage
