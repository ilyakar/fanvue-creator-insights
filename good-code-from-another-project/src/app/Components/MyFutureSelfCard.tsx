import Image from 'next/image'
import '@styles/components/myFutureSelfCard.scss'
import { getArchetype } from '@data/archetypes'

// Card showing the user's chosen archetype and optional values/rituals
const MyFutureSelfCard = ({
  archetypeName,
  values = [],
  rituals = [],
  alignmentPercent
}: {
  archetypeName: 'Warrior' | 'Stoic' | 'Strategist' | 'Shadow'
  values?: string[]
  rituals?: string[]
  alignmentPercent?: number
}) => {
  const archetype = getArchetype(archetypeName)!

  return (
    <div className="my-future-self-card image-glow__background">
      <div className="content">
        <div className="top-content">
          <h3>My Future Self</h3>
          {!alignmentPercent && (
            <div className="description">
              <strong>{archetypeName}.</strong> {archetype.motto.split('\n')[0]}
              <br />
              {archetype.motto.split('\n')[1]}
            </div>
          )}
          {alignmentPercent && (
            <div className="alignment-progress">
              <div className="progress-text">
                Overall Alignment: <strong>65%</strong>
              </div>
              <div className="progress-bar" style={{ width: `${100 - 65}%` }} />
            </div>
          )}
        </div>
        <div className="bottom-content">
          {values.length > 0 && rituals.length > 0 && (
            <section className="values-rituals-section">
              <div className="values-container">
                <h4>
                  My Future
                  <br />
                  <span className="large">Values</span>
                </h4>

                {values.map(value => (
                  <div className="pill size-s" key={value}>
                    {value}
                  </div>
                ))}
              </div>
              <div className="rituals-container">
                <h4>
                  My Future
                  <br />
                  <span className="large">Rituals</span>
                </h4>

                {rituals.map(ritual => (
                  <div className="pill size-s" key={ritual}>
                    {ritual}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
      <Image src={archetype.image} alt="My Future Self Image" width="350" height="600" />
    </div>
  )
}

export default MyFutureSelfCard
