import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, Clock3, MapPin, Phone, Sparkles, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import Header from '../Components/Header.jsx'
import Footer from '../Components/Home/Footer.jsx'
import useAxiosSecure from '../Hooks/useAxiosSecure'
import bookingBanner from '../assets/booking.jpg'
import { AuthContext } from '../Context/AuthContext.jsx'
import { useContext } from 'react'


const toDoctorArray = (payload) => {
	if (Array.isArray(payload)) return payload
	if (Array.isArray(payload?.data)) return payload.data
	if (Array.isArray(payload?.doctors)) return payload.doctors
	return []
}

const formatTime = (value) => {
	if (!value) return ''
	const [hourStr, minuteStr = '00'] = String(value).split(':')
	const hour = Number(hourStr)
	if (Number.isNaN(hour)) return String(value)
	const suffix = hour >= 12 ? 'PM' : 'AM'
	const normalizedHour = hour % 12 || 12
	return `${normalizedHour}:${minuteStr} ${suffix}`
}

const doctorCardTone = (index) => {
	const tones = [
		'from-[#FF5FA2] to-[#9B5DE5]',
		'from-[#8B5CF6] to-[#EC4899]',
		'from-[#F97316] to-[#FB7185]',
	]
	return tones[index % tones.length]
}

const generateSlots = (availableTimeSlots = []) => {
	const slots = []
	const seen = new Set()

	availableTimeSlots.forEach((timeRange) => {
		const startMinutes = Number.parseInt(String(timeRange?.startTime ?? '').slice(0, 2), 10) * 60 + Number.parseInt(String(timeRange?.startTime ?? '').slice(3, 5), 10)
		const endMinutes = Number.parseInt(String(timeRange?.endTime ?? '').slice(0, 2), 10) * 60 + Number.parseInt(String(timeRange?.endTime ?? '').slice(3, 5), 10)

		if (
			Number.isNaN(startMinutes) ||
			Number.isNaN(endMinutes) ||
			endMinutes <= startMinutes
		) {
			return
		}

		for (let currentMinutes = startMinutes; currentMinutes < endMinutes; currentMinutes += 30) {
			const hour = Math.floor(currentMinutes / 60)
			const minute = currentMinutes % 60
			const slot = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

			if (seen.has(slot)) continue
			seen.add(slot)
			slots.push(slot)
		}
	})

	return slots
}

const getAvailableAppointmentDates = (availableDays = []) => {
	const normalizedAvailableDays = new Set(
		availableDays.map((day) => String(day).trim().slice(0, 3).toLowerCase()),
	)
	const dateOptions = []
	const today = new Date()
	const maxSearchDays = 365

	for (let offset = 0; offset < maxSearchDays && dateOptions.length < 3; offset += 1) {
		const date = new Date(today)
		date.setDate(today.getDate() + offset)

		const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' })
			.format(date)
			.toLowerCase()

		if (!normalizedAvailableDays.has(weekday)) continue

		const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
			date.getDate(),
		).padStart(2, '0')}`
		const label = new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		}).format(date)

		dateOptions.push({ value, label })
	}

	return dateOptions
}

const Booking = () => {
	const axios = useAxiosSecure()

	const { data, isPending, isError, error } = useQuery({
		queryKey: ['booking-doctors'],
		queryFn: async () => {
			try {
				const res = await axios.get('/doctors')
				return toDoctorArray(res.data)
			} catch {
				return []
			}
		},
		retry: 1,
		staleTime: 1000 * 60 * 5,
	})

	const doctors = Array.isArray(data) ? data : []
    const {user}=useContext(AuthContext)
	const [selectedDoctor, setSelectedDoctor] = useState(null)
	const [selectedDate, setSelectedDate] = useState('')
	const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
    const [bookingLoading,setBookingLoading] = useState(false)

	const { data: bookedSlotsData = [] } = useQuery({
		queryKey: ['booked-time-slots', selectedDoctor?.email],
		queryFn: async () => {
			if (!selectedDoctor?.email) return []

			const response = await axios.get(`/timeSlots?doctorEmail=${selectedDoctor.email}`)
			return response.data?.timeSlots ?? response.data ?? []
		},
		enabled: Boolean(selectedDoctor?.email),
		staleTime: 1000 * 60 * 2,
	})

	const bookedSlots = Array.isArray(bookedSlotsData) ? bookedSlotsData : []
	const generatedSlots = generateSlots(selectedDoctor?.availableTimeSlots ?? [])
	const availableTimeSlots = selectedDate
		? generatedSlots.filter(
				(slot) => !bookedSlots.some((bookedSlot) => bookedSlot?.date === selectedDate && bookedSlot?.slot === slot),
		  )
		: []

	const handleBooking = (doctor) => {

		setSelectedDoctor(doctor)
		setSelectedDate('')
		setSelectedTimeSlot('')
      
        
     
    }

	const handleModalBookAppointment =async () => {
  setBookingLoading(true)
		const form = document.getElementById('booking-modal-form')
		const formInputs = form ? form.querySelectorAll('input') : []
		const patientName = formInputs[0]?.value ?? ''
		const patientEmail = formInputs[1]?.value ?? ''
		const patientPhone = formInputs[2]?.value ?? ''

		const bookingData = {
			doctorName: selectedDoctor.name,
			doctorEmail: selectedDoctor.email,
			patientName: patientName,
			patientEmail: patientEmail,
			patientPhone: patientPhone,
            status:'pending',
			appointmentDate: selectedDate,
			appointmentTime: selectedTimeSlot,
			
			
		}
    await axios.post('/booking', bookingData)
    alert('Request Sent Successfully!Wait For confirmation')


		console.log(bookingData)
        setBookingLoading(false)
        setSelectedDate('')
		setSelectedTimeSlot('')
		setSelectedDoctor(null)

	}

	const closeBookingModal = () => {
		setSelectedDoctor(null)
		setSelectedDate('')
		setSelectedTimeSlot('')
        setBookingLoading(false)
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.45),transparent_28%),radial-gradient(circle_at_top_right,rgba(196,181,253,0.3),transparent_24%),linear-gradient(180deg,#fff8fb_0%,#ffffff_100%)] text-slate-900">
			<Header />

			<main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
				<section className="relative overflow-hidden rounded-3xl border border-rose-100 bg-linear-to-r from-rose-50 via-white to-sky-50 px-6 py-6 shadow-[0_18px_50px_rgba(244,63,94,0.10)] sm:px-8 lg:px-10">
					<div className="pointer-events-none absolute inset-0">
						<div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-rose-200/30 blur-3xl" />
						<div className="absolute right-0 top-6 h-44 w-44 rounded-full bg-sky-200/35 blur-3xl" />
					</div>

					<div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
						<div className="space-y-5 text-center lg:text-left">
							<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
								<div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-100 bg-white text-rose-500 shadow-lg shadow-rose-100/80">
									<Stethoscope className="h-8 w-8" />
								</div>

								<div>
									<p className="text-3xl font-extrabold tracking-tight text-rose-600 sm:text-4xl">
										Doctor Booking
									</p>
									<p className="mt-1 text-sm font-medium text-slate-600 sm:text-base">
										Trusted maternal care, matched to your schedule.
									</p>
								</div>
							</div>

							<p className="mx-auto max-w-2xl text-sm leading-7 text-slate-700 sm:text-base lg:mx-0">
								Browse verified doctors, compare qualifications, and request appointments in minutes.
							</p>

							<div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
								<Link
									to="/my-appointments"
									className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(155,93,229,0.22)] transition hover:-translate-y-0.5"
								>
									My Booking
								</Link>
								<Link
									to="/chatbot"
									className="inline-flex items-center justify-center rounded-full border border-rose-100 bg-white px-6 py-3 text-sm font-semibold text-rose-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-rose-50"
								>
									Talk to Care AI
								</Link>
							</div>

						
						</div>

						<div className="relative flex justify-center lg:justify-end">
							<div className="absolute inset-x-8 bottom-2 h-20 rounded-full bg-rose-200/35 blur-2xl" />
							<img
								src={bookingBanner}
								alt="Doctor booking banner"
								className="relative z-10 w-full max-w-[640px] rounded-2xl border border-white/60 object-cover drop-shadow-[0_18px_30px_rgba(15,23,42,0.12)]"
							/>
						</div>
					</div>

					<div className="mt-4 grid gap-3 sm:grid-cols-3">
						<div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm">
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Doctors</p>
							<p className="mt-1.5 text-xl font-black text-slate-900">{doctors.length}</p>
						</div>
						<div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm">
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Availability</p>
							<p className="mt-1.5 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
								<Sparkles className="h-4 w-4 text-pink-500" />
								Flexible slots
							</p>
						</div>
						<div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm">
							<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Booking Type</p>
							<p className="mt-1.5 text-sm font-semibold text-slate-800">Instant request</p>
						</div>
					</div>
				</section>

				{isError ? (
					<div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 shadow-sm">
						{error?.message || 'Unable to load doctors right now.'}
					</div>
				) : null}

				<section className="mt-10">
					<div className="mb-4">
						<h2 className="text-xl font-black text-slate-950 sm:text-2xl">Doctor List</h2>
					</div>

					{isPending ? (
						<div className="rounded-3xl border border-slate-200 bg-white/90 px-5 py-6 text-sm text-slate-600 shadow-sm">
							Loading doctors...
						</div>
					) : null}

					{!isPending && doctors.length === 0 ? (
						<div className="rounded-3xl border border-slate-200 bg-white/90 px-5 py-10 text-center text-base font-medium text-slate-600 shadow-sm">
							No doctor found
						</div>
					) : null}

					{!isPending && doctors.length > 0 ? (
						<div className="grid grid-cols-1 gap-6">
							{doctors.map((doctor, index) => (
								<article
									key={doctor.id ?? doctor._id ?? doctor.email ?? doctor.name}
									className="group overflow-hidden rounded-[30px] border border-white/80 bg-white/90 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)]"
								>
									<div className={`rounded-[26px] bg-linear-to-r ${doctorCardTone(index)} p-px`}>
										<div className="rounded-[25px] bg-white p-4">
											<div className="flex items-start gap-4">
												<div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br ${doctorCardTone(index)} text-white shadow-lg`}>
													<span className="text-sm font-black">
														{(doctor.name ?? 'D')
															.split(' ')
															.slice(0, 2)
															.map((word) => word[0])
															.join('')}
													</span>
												</div>

												<div className="min-w-0 flex-1">
													<h3 className="text-base font-black text-slate-950">{doctor.name ?? 'Doctor Name'}</h3>
													<p className="mt-1 text-sm font-medium text-pink-600">{doctor.specialization ?? 'Specialist'}</p>
													<p className="mt-2 text-sm leading-6 text-slate-600">
														{doctor.qualification ?? 'Qualification not provided'}
													</p>
												</div>
											</div>

											<div className="mt-4 rounded-3xl border border-slate-100 bg-slate-50/80 p-3">
												<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-slate-700">
													<div className="flex min-w-0 items-start gap-2 rounded-2xl bg-white/80 px-3 py-2">
														<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
														<span
															className="min-w-0 truncate leading-5"
															title={`${doctor.hospital ?? 'Hospital not provided'}, ${doctor.chamberAddress ?? 'Address not provided'}`}
														>
															{(doctor.hospital ?? 'Hospital not provided') + ', ' + (doctor.chamberAddress ?? 'Address not provided')}
														</span>
													</div>

													<div className="flex min-w-0 items-start gap-2 rounded-2xl bg-white/80 px-3 py-2">
														<Phone className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
														<span className="min-w-0 wrap-break-word leading-5">{doctor.phone ?? 'Contact not provided'}</span>
													</div>

													<div className="flex min-w-0 items-start gap-2 rounded-2xl bg-white/80 px-3 py-2">
														<CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
														<span className="min-w-0 wrap-break-word leading-5">
															{doctor.availableDays?.length ? doctor.availableDays.join(', ') : 'Available days not provided'}
														</span>
													</div>

													<div className="flex min-w-0 items-start gap-2 rounded-2xl bg-white/80 px-3 py-2">
														<Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" />
														<span className="min-w-0 wrap-break-word leading-5">
															{doctor.availableTimeSlots?.length
																? doctor.availableTimeSlots
																		.map((slot) => `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`)
																		.join(', ')
																: 'Time slots not provided'}
														</span>
													</div>
												</div>
											</div>

											<div className="mt-4 grid gap-3 sm:grid-cols-2">
												<div className="rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm">
													<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Experience</p>
													<p className="mt-1 text-sm font-semibold text-slate-900">{doctor.experience ?? '0'} years</p>
												</div>
												<div className="rounded-2xl border border-slate-100 bg-white px-4 py-2.5 shadow-sm">
													<p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Consultation Fee</p>
													<p className="mt-1 text-sm font-semibold text-slate-900">BDT {doctor.consultationFee ?? '---'}</p>
												</div>
											</div>

											<button
												type="button"
												onClick={() => handleBooking(doctor)}
												className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(155,93,229,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(155,93,229,0.28)]"
											>
												Book Appointment
											</button>
										</div>
									</div>
								</article>
							))}
						</div>
					) : null}
				</section>
			</main>

			{selectedDoctor ? (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
					<div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
						<div className="bg-linear-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-6 py-5 text-white">
							<div className="flex items-start justify-between gap-4">
								<div>
									<p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">Doctor Booking</p>
									<h3 className="mt-1 text-2xl font-black">Book Appointment</h3>
								</div>
								<button
									type="button"
									onClick={closeBookingModal}
									className="rounded-full bg-white/15 px-3 py-2 text-sm font-semibold transition hover:bg-white/25"
								>
									Close
								</button>
							</div>
						</div>

						<div className="space-y-5 p-6">
							<form id="booking-modal-form" className="rounded-[28px] border border-slate-100 bg-slate-50/80 p-5">
                            <div>
                                <label>Patient Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    defaultValue={user?.displayName || ''}
                                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label>Patient Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    defaultValue={user?.email || ''}
                                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label>Patient Phone</label>
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                </div>
                                <div>
		<label className="mb-1 block font-medium">
			Appointment Date
		</label>

		<select
			value={selectedDate}
			onChange={(event) => {
				setSelectedDate(event.target.value)
				setSelectedTimeSlot('')
			}}
			className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			<option value="">Select Date</option>

			{getAvailableAppointmentDates(selectedDoctor?.availableDays).map((item) => (
				<option
					key={item.value}
					value={item.value}
				>
					{item.label}
				</option>
			))}
		</select>
	</div>

		<div>
			<label className="mb-1 block font-medium">
				Time Slot
			</label>

			<select
				value={selectedTimeSlot}
				onChange={(event) => setSelectedTimeSlot(event.target.value)}
				disabled={!selectedDate}
				required
				className="mt-1 block w-full rounded-md border border-slate-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100"
			>
				<option value="">Select Time Slot</option>
				{availableTimeSlots.map((slot) => (
					<option key={slot} value={slot}>
						{formatTime(slot)}
					</option>
				))}
			</select>
		</div>

							</form>

							<div className="flex justify-end gap-2">
								<button
									type="button"
									onClick={closeBookingModal}
									className="rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 py-3 text-sm  cursor-pointer font-semibold text-white shadow-[0_16px_40px_rgba(155,93,229,0.22)]"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleModalBookAppointment}
									className='rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 py-3 text-sm cursor-pointer  font-semibold text-white shadow-[0_16px_40px_rgba(155,93,229,0.22)]'
								>
									{bookingLoading ? 'Booking...' : 'Book Appointment'}
								</button>
							</div>
						</div>
					</div>
				</div>
			) : null}

			<Footer />
		</div>
	)
}

export default Booking
