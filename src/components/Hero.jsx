import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { useAdmin } from '../context/AdminContext';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import '../styles/Hero.css';

export default function Hero() {
  const { siteData } = useAdmin();
  const slides = (siteData.heroSlides || []).slice(0, 3);

  if (slides.length === 0) return null;

  return (
    <section className="hero">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="hero-swiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="hero-bg"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="hero-overlay" />
            <div className="container hero-content">
              <h1 dangerouslySetInnerHTML={{ __html: slide.title }} />
              <p>{slide.subtitle}</p>
              <Link to={slide.link} className="btn btn-primary btn-large">
                {slide.cta}
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
