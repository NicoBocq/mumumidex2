'use client'

import { motion } from 'framer-motion'
import AddCityCard from '@/components/city/add-city-card'

export default function ForecastAddItem() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <AddCityCard />
    </motion.div>
  )
}
