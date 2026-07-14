import Hero from '../components/Hero';
import Welcome from '../components/Welcome';
import Statistics from '../components/Statistics';
import Testimonials from '../components/Testimonials';
import PresidentMessage from '../components/PresidentMessage';
import WhyJoinUs from '../components/WhyJoinUs';
import ReadyToJoin from '../components/ReadyToJoin';
import Headquarters from '../components/Headquarters';

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <Statistics />
      <Testimonials />
      <PresidentMessage />
      <WhyJoinUs />
      <ReadyToJoin />
      <Headquarters />
    </>
  );
}
