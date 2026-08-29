import { HomeHeader } from '../components/home/HomeHeader'
import { TodaySection } from '../components/home/TodaySection'
import { NeedsCandiceSection } from '../components/home/NeedsCandiceSection'
import { ThisWeekSection } from '../components/home/ThisWeekSection'
import { ComingAtMeSection } from '../components/home/ComingAtMeSection'
import { WaitingOnSection } from '../components/home/WaitingOnSection'
import { SafelyParkedSection } from '../components/home/SafelyParkedSection'
import { PortfolioPulse } from '../components/home/PortfolioPulse'

export function Home() {
  return (
    <div>
      <HomeHeader />
      <TodaySection />
      <NeedsCandiceSection />
      <ThisWeekSection />
      <ComingAtMeSection />
      <WaitingOnSection />
      <PortfolioPulse />
      <SafelyParkedSection />
    </div>
  )
}
