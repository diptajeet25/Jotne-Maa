import { Search } from 'lucide-react'
import EmergencyBanner from '../Components/EmergencyBanner'
import EmergencyCard from '../Components/EmergencyCard'
import Header from '../Components/Header'
import { useState } from 'react'
import Footer from '../Components/Home/Footer'
import { motion } from 'framer-motion'

const sampleHospitals = [
  { name: 'Dhaka Central Hospital', category: 'Hospital', address: 'Green Road, Dhanmondi, Dhaka', district: 'Dhaka', phone: '01711000111' },
  { name: 'City Ambulance Service', category: 'Ambulance', address: 'Banani, Dhaka', district: 'Dhaka', phone: '01711000222' },
  { name: "Women's Care Clinic", category: 'Gynecology', address: 'Dhanmondi, Dhaka', district: 'Dhaka', phone: '01711000333' },
  { name: 'Northside Hospital', category: 'Hospital', address: 'Mohammadpur, Dhaka', district: 'Dhaka', phone: '01711000444' },
  { name: 'Rapid Ambulance', category: 'Ambulance', address: 'Gulshan, Dhaka', district: 'Dhaka', phone: '01711000555' },
  { name: 'City Pharmacy', category: 'Pharmacy', address: 'Mirpur, Dhaka', district: 'Dhaka', phone: '01711000666' },
  { name: 'Green Valley Hospital', category: 'Hospital', address: 'Uttara, Dhaka', district: 'Dhaka', phone: '01711000777' },
  { name: '24/7 Ambulance Service', category: 'Ambulance', address: 'Motijheel, Dhaka', district: 'Dhaka', phone: '01711000888' },
  { name: "Mother's Care Center", category: 'Gynecology', address: 'Banani, Dhaka', district: 'Dhaka', phone: '01711000999' },
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

        <FilteredCards
          data={sampleHospitals}
          type={type}
          district={district}
          search={search}
          variants={cardGridVariants}
        />
      </div>
      <Footer />
    </div>
  )
}

export default Emergency

// Reusable filtered cards component
function FilteredCards({ data = [], type = '', district = '', search = '', variants = {} }) {
  // Simplified, stable filtering logic (no useMemo) to avoid render conflicts
  const normalized = (s = '') => String(s || '').toLowerCase().trim()

  const filtered = data.filter((item) => {
    const matchesType = !type || normalized(item.category) === normalized(type)
    const matchesDistrict = !district || normalized(item.district) === normalized(district)
    const matchesSearch =
      !search ||
      normalized(item.name).includes(normalized(search)) ||
      normalized(item.address).includes(normalized(search)) ||
      normalized(item.category).includes(normalized(search)) ||
      String(item.phone).includes(search)

    return matchesType && matchesDistrict && matchesSearch
  })

  if (!filtered || filtered.length === 0) {
    return (
      <div className="mt-6 rounded-lg border border-dashed border-gray-200 bg-white/60 p-8 text-center">
        <div className="mx-auto max-w-xl">
          <div className="mb-4 text-2xl font-semibold text-slate-800">No results found</div>
          <p className="text-sm text-slate-600">We couldn't find any services that match your filters. Try clearing search or selecting "All".</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      {filtered.map((h) => (
        <EmergencyCard key={`${h.name}-${h.phone}`} name={h.name} category={h.category} address={h.address} phone={h.phone} />
      ))}
    </motion.div>
  )
}