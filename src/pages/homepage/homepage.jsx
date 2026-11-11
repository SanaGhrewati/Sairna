import Hero from "../../components/home/hero"
import SearchBox from "../../components/home/searchbox"
import HomeMetrics from "../../components/home/home-metrics"
import DestinationCards from "../../components/home/destination-cards"
import ProcessSteps from "../../components/home/process-steps"
import TrackingPreview from "../../components/home/tracking-preview"
import HomeCTA from "../../components/home/home-cta"

function HomePage() {
  return (
    <main dir="rtl" className="overflow-hidden bg-bg">
      <Hero />
      <SearchBox />
      <HomeMetrics />
      <DestinationCards />
      <ProcessSteps />
      <TrackingPreview />
      <HomeCTA />
    </main>
  )
}

export default HomePage