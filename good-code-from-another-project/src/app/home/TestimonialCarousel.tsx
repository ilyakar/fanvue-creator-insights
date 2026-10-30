'use client'

import Image from 'next/image'

import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

const testimonials = [
  {
    image: '/testimonial-images/1.jpg',
    name: 'Walter Bruen',
    text: `This is a life-changing app.
I have become a whole
other person after 2 weeks.`
  },
  {
    image: '/testimonial-images/2.jpg',
    name: 'Suzen Tapping',
    text: `This is motivation at a whole
new level. It’s my go-to
that pushes me daily.`
  },
  {
    image: '/testimonial-images/3.jpg',
    name: 'Darrel Mosciski',
    text: `Such gamification for a
life coach! It’s. Just. So.
Powerful. Wow.`
  },
  {
    image: '/testimonial-images/4.jpg',
    name: 'Saul White',
    text: `I needed this many years ago.
But I am very glad that I found
it last month. Yes.`
  },
  {
    image: '/testimonial-images/5.jpg',
    name: 'Dallas Koss',
    text: `I've never felt more in control.
Every day feels purposeful now.`
  },
  {
    image: '/testimonial-images/6.jpg',
    name: 'Julio Kertzmann',
    text: `This awakened something deep in me.
I'm finally living with intention.`
  }
]

// Rotating carousel showcasing user testimonials
const TestimonialCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'center', loop: true }, [Autoplay()])

  return (
    <div className="testimonial-carousel" ref={emblaRef}>
      <div className="content">
        {testimonials.map(testimonial => (
          <div className="slide" key={testimonial.name}>
            <div className="slide-content">
              <Image
                src={testimonial.image}
                className="user-image"
                alt={`Testimonial from ${testimonial.name}`}
                width="80"
                height="80"
              />
              <div className="name">{testimonial.name}</div>
              <Image src="/testimonial-images/stars.png" className="stars" alt="5 stars" width="117" height="20" />
              <div className="text">{testimonial.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TestimonialCarousel
