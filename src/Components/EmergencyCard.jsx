import { Building2, Clock3, MapPin, Phone } from 'lucide-react'
import { motion } from 'framer-motion'

const EmergencyCard = ({
  name = 'Dhaka Central Hospital',
  category = 'Hospital',
  address = 'Green Road, Dhanmondi, Dhaka',
  phone = '01711000111',
  available = 'Available 24/7',
}) => {
  return (
    <motion.div
      className="rounded-3xl border border-gray-100 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-2xl"
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      whileHover={{ y: -6 }}
    >

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {name}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {category}
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
          <Building2 size={24} />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-gray-500" />
          <p className="text-sm text-gray-600">{address}</p>
        </div>

        <div className="flex items-center gap-3">
          <Phone size={16} className="text-gray-500" />
          <p className="text-sm text-gray-600">{phone}</p>
        </div>

        <div className="flex items-center gap-3">
          <Clock3 size={16} className="text-gray-500" />
          <p className="text-sm text-gray-600">{available}</p>
        </div>
      </div>

      <button className="w-full mt-5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-medium transition-all duration-300">
        Contact Now
      </button>
    </motion.div>
  )
}

export default EmergencyCard