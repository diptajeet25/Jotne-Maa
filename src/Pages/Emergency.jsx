import { Search } from 'lucide-react'
import EmergencyBanner from '../Components/EmergencyBanner'
import EmergencyCard from '../Components/EmergencyCard'
import Header from '../Components/Header'
import { useState } from 'react'
import Footer from '../Components/Home/Footer'
import { motion } from 'framer-motion'

const sampleHospitals = [
  { name: 'Dhaka Central Hospital', category: 'Hospital', address: 'Green Road, Dhanmondi, Dhaka', phone: '01711000111' },
  { name: 'City Ambulance Service', category: 'Ambulance', address: 'Banani, Dhaka', phone: '01711000222' },
  { name: "Women's Care Clinic", category: 'Gynecology', address: 'Dhanmondi, Dhaka', phone: '01711000333' },
  { name: 'Northside Hospital', category: 'Hospital', address: 'Mohammadpur, Dhaka', phone: '01711000444' },
  { name: 'Rapid Ambulance', category: 'Ambulance', address: 'Gulshan, Dhaka', phone: '01711000555' },
  { name: 'City Pharmacy', category: 'Pharmacy', address: 'Mirpur, Dhaka', phone: '01711000666' },
  { name: 'Green Valley Hospital', category: 'Hospital', address: 'Uttara, Dhaka', phone: '01711000777' },
  { name: '24/7 Ambulance Service', category: 'Ambulance', address: 'Motijheel, Dhaka', phone: '01711000888' },
  { name: "Mother's Care Center", category: 'Gynecology', address: 'Banani, Dhaka', phone: '01711000999' },
]

const Emergency = () => {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [district, setDistrict] = useState('')
  const cardGridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.09,
        delayChildren: 0.08,
      },
    },
  }
  const districts = [
  "Bagerhat",
  "Bandarban",
  "Barguna",
  "Barishal",
  "Bhola",
  "Bogura",
  "Brahmanbaria",
  "Chandpur",
  "Chapainawabganj",
  "Chattogram",
  "Chuadanga",
  "Cox's Bazar",
  "Cumilla",
  "Dhaka",
  "Dinajpur",
  "Faridpur",
  "Feni",
  "Gaibandha",
  "Gazipur",
  "Gopalganj",
  "Habiganj",
  "Jamalpur",
  "Jashore",
  "Jhalokathi",
  "Jhenaidah",
  "Joypurhat",
  "Khagrachhari",
  "Khulna",
  "Kishoreganj",
  "Kurigram",
  "Kushtia",
  "Lakshmipur",
  "Lalmonirhat",
  "Madaripur",
  "Magura",
  "Manikganj",
  "Meherpur",
  "Moulvibazar",
  "Munshiganj",
  "Mymensingh",
  "Naogaon",
  "Narail",
  "Narayanganj",
  "Narsingdi",
  "Natore",
  "Netrokona",
  "Nilphamari",
  "Noakhali",
  "Pabna",
  "Panchagarh",
  "Patuakhali",
  "Pirojpur",
  "Rajbari",
  "Rajshahi",
  "Rangamati",
  "Rangpur",
  "Satkhira",
  "Shariatpur",
  "Sherpur",
  "Sirajganj",
  "Sunamganj",
  "Sylhet",
  "Tangail",
  "Thakurgaon"
]
  return (
    <div>
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmergencyBanner />

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search emergency services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg w-full bg-gray-100 border border-gray-300 pl-10 py-2.5"
              />
            </div>

            <div>
              <label className="sr-only">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg w-full bg-gray-100 border border-gray-300 pl-2 py-2.5">
                <option value="">All</option>
                <option value="Ambulance">Ambulance</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Hospital">Hospital</option>
                <option value="Pharmacy">Pharmacy</option>
              </select>
            </div>

            <div>
              <label className="sr-only">District</label>
              <select value={district} onChange={(e) => setDistrict(e.target.value)} className="rounded-lg w-full bg-gray-100 border border-gray-300 pl-2 py-2.5">
                <option value="">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d} className="text-black">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <motion.div
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={cardGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {sampleHospitals
            .filter((h) => {
              if (type && h.category.toLowerCase() !== type.toLowerCase()) return false
              if (district && !h.address.toLowerCase().includes(district.toLowerCase())) return false
              if (search) {
                const s = search.toLowerCase()
                return h.name.toLowerCase().includes(s) || h.address.toLowerCase().includes(s) || h.phone.includes(s)
              }
              return true
            })
            .map((h) => (
              <EmergencyCard
                key={h.name}
                name={h.name}
                category={h.category}
                address={h.address}
                phone={h.phone}
              />
            ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

export default Emergency