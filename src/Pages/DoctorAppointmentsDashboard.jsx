import { useContext, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, CheckCircle2, Clock3, Mail, Phone, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import Swal from 'sweetalert2'
import Header from '../Components/Header.jsx'
import Footer from '../Components/Home/Footer.jsx'
import useAxiosSecure from '../Hooks/useAxiosSecure'
import { AuthContext } from '../Context/AuthContext.jsx'

const formatAppointmentDate = (dateValue) => {
	if (!dateValue) return ''
	const date = new Date(`${dateValue}T00:00:00`)
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	}).format(date)
}

const formatAppointmentDateTime = (dateValue, timeValue) => {
	if (!dateValue || !timeValue) return null
	const appointment = new Date(`${dateValue}T${timeValue}:00`)
	return Number.isNaN(appointment.getTime()) ? null : appointment
}

const statusBadgeClass = {
	pending: 'border-amber-200 bg-amber-50 text-amber-700',
	confirmed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
}

const DashboardCard = ({ title, value, icon: Icon, accentClass }) => (
	<div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
		<div className={`absolute inset-x-0 top-0 h-1.5 ${accentClass}`} />
		<div className="flex items-start justify-between gap-4">
			<div>
				<p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
				<p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
			</div>
			<div className="rounded-2xl bg-slate-50 p-3 text-slate-700 shadow-sm">
				<Icon className="h-6 w-6" />
			</div>
		</div>
	</div>
)

const AppointmentRow = ({ appointment, children }) => (
	<div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(15,23,42,0.09)]">
		<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
			<div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				<div className="rounded-2xl bg-slate-50 px-4 py-3">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Patient Name</p>
					<p className="mt-1 text-sm font-semibold text-slate-900">{appointment.patientName}</p>
				</div>
				<div className="rounded-2xl bg-slate-50 px-4 py-3">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Patient Email</p>
					<p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Mail className="h-4 w-4 text-pink-500" />
						<span className="break-all">{appointment.patientEmail}</span>
					</p>
				</div>
				<div className="rounded-2xl bg-slate-50 px-4 py-3">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Patient Phone</p>
					<p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Phone className="h-4 w-4 text-pink-500" />
						<span>{appointment.patientPhone}</span>
					</p>
				</div>
				<div className="rounded-2xl bg-slate-50 px-4 py-3">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Appointment Date</p>
					<p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
						<CalendarDays className="h-4 w-4 text-pink-500" />
						<span>{formatAppointmentDate(appointment.appointmentDate)}</span>
					</p>
				</div>
				<div className="rounded-2xl bg-slate-50 px-4 py-3">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Appointment Time</p>
					<p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
						<Clock3 className="h-4 w-4 text-pink-500" />
						<span>{appointment.appointmentTime}</span>
					</p>
				</div>
				<div className="rounded-2xl bg-slate-50 px-4 py-3">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Status</p>
					<div className="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold capitalize">
						{children}
					</div>
				</div>
			</div>
		</div>
	</div>
)

const DoctorAppointmentsDashboard = () => {
	const axios = useAxiosSecure()
	const { user: loggedInDoctor } = useContext(AuthContext)
	const [selectedAppointment, setSelectedAppointment] = useState(null)
	const [meetingLink, setMeetingLink] = useState('')
	const [rejectingBookingId, setRejectingBookingId] = useState(null)

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ['doctor-my-bookings', loggedInDoctor?.email],
		queryFn: async () => {
			if (!loggedInDoctor?.email) return []
			const response = await axios.get(`/mybooking?doctorEmail=${loggedInDoctor.email}`)
			return Array.isArray(response.data) ? response.data : []
		},
		enabled: Boolean(loggedInDoctor?.email),
		staleTime: 1000 * 60 * 2,
	})

	const upcomingAppointments = useMemo(() => {
		const appointments = Array.isArray(data) ? data : []
		const now = new Date()

		return appointments.filter((appointment) => {
			const appointmentDateTime = formatAppointmentDateTime(
				appointment.appointmentDate,
				appointment.appointmentTime,
			)
			return appointmentDateTime ? appointmentDateTime >= now : false
		})
	}, [data])

	const pendingAppointments = useMemo(
		() => upcomingAppointments.filter((appointment) => appointment.status === 'pending'),
		[upcomingAppointments],
	)

	const confirmedAppointments = useMemo(
		() => upcomingAppointments.filter((appointment) => appointment.status === 'confirmed'),
		[upcomingAppointments],
	)

	const counts = useMemo(
		() => ({
			pending: pendingAppointments.length,
			confirmed: confirmedAppointments.length,
			total: upcomingAppointments.length,
		}),
		[pendingAppointments.length, confirmedAppointments.length, upcomingAppointments.length],
	)

	const closeApproveModal = () => {
		setSelectedAppointment(null)
		setMeetingLink('')
	}

	const handleOpenApproveModal = (appointment) => {
		setSelectedAppointment(appointment)
		setMeetingLink('')
	}

	const handleApproveAppointment = async () => {
		if (!meetingLink.trim()) {
			alert('Please enter a meeting link')
			return
		}

		if (!selectedAppointment) return

		const approvalData = {
			bookingId: selectedAppointment._id,
			patientName: selectedAppointment.patientName,
			patientEmail: selectedAppointment.patientEmail,
			doctorName: selectedAppointment.doctorName,
			doctorEmail: selectedAppointment.doctorEmail,
			appointmentDate: selectedAppointment.appointmentDate,
			appointmentTime: selectedAppointment.appointmentTime,
			status: 'confirmed',
			meetingLink,
		}

		console.log('APPROVED APPOINTMENT')

		console.log(approvalData)
        const res=await axios.patch(`/approve-booking/${selectedAppointment._id}`, approvalData)   
        if(res.status===200)
            {
                alert('Appointment Approved Successfully')
            } 



		closeApproveModal()
        await refetch()
        
	}

	const handleRejectAppointment = async (bookingId) => {
		console.log('[reject-booking] bookingId:', bookingId)

		if (!bookingId) {
			await Swal.fire({
				icon: 'error',
				title: 'Missing booking ID',
				text: 'Unable to reject this appointment because the booking ID is undefined.',
			})
			return
		}

		const requestUrl = `/reject-booking/${bookingId}`
		console.log('[reject-booking] requestUrl:', requestUrl)

		const result = await Swal.fire({
			title: 'Reject Appointment?',
			text: 'This appointment will be marked as rejected.',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Reject',
			cancelButtonText: 'Cancel',
			confirmButtonColor: '#ef4444',
			cancelButtonColor: '#64748b',
		})

		if (!result.isConfirmed) return

		setRejectingBookingId(bookingId)
		try {
			const response = await axios.patch(requestUrl, { status: 'rejected' })
			console.log('[reject-booking] response:', response?.data)
			await Swal.fire({
				icon: 'success',
				title: 'Rejected',
				text: response?.data?.message || 'Appointment rejected successfully',
			})
			closeApproveModal()
			await refetch()
		} catch (requestError) {
			await Swal.fire({
				icon: 'error',
				title: 'Error',
				text: requestError?.response?.data?.message || 'Failed to reject appointment',
			})
		} finally {
			setRejectingBookingId(null)
		}
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.42),transparent_26%),radial-gradient(circle_at_top_right,rgba(196,181,253,0.32),transparent_25%),linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)] text-slate-900">
			<Header />

			<main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
				<section className="relative overflow-hidden rounded-4xl border border-rose-100 bg-linear-to-r from-[#FFF1F7] via-white to-[#F7F0FF] px-6 py-7 shadow-[0_20px_60px_rgba(155,93,229,0.10)] sm:px-8 lg:px-10">
					<div className="pointer-events-none absolute inset-0">
						<div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-rose-200/30 blur-3xl" />
						<div className="absolute right-0 top-4 h-48 w-48 rounded-full bg-violet-200/35 blur-3xl" />
					</div>

					<div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-3xl space-y-4">
							<div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-pink-600 shadow-sm">
								<Sparkles className="h-4 w-4" />
								Doctor Appointments Dashboard
							</div>
							<h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
								Manage upcoming appointments with clarity and speed.
							</h1>
							<p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
								Review pending requests, confirm appointments, and keep future visits organized in one premium workspace.
							</p>
						</div>

						<div className="grid gap-2 sm:grid-cols-2 lg:w-xl">
							<DashboardCard
								title="Pending Appointments Count"
								value={counts.pending}
								icon={UserRound}
								accentClass="bg-gradient-to-r from-amber-400 to-orange-500"
							/>
							<DashboardCard
								title="Confirmed Appointments Count"
								value={counts.confirmed}
								icon={ShieldCheck}
								accentClass="bg-gradient-to-r from-emerald-400 to-emerald-600"
							/>
						
						</div>
					</div>
				</section>

				{isLoading ? (
					<div className="mt-8 rounded-[28px] border border-slate-200 bg-white px-6 py-8 text-sm font-medium text-slate-600 shadow-sm">
						Loading appointments...
					</div>
				) : null}

				{isError ? (
					<div className="mt-8 rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-4 text-sm font-medium text-rose-700 shadow-sm">
						{error?.message || 'Unable to load appointments right now.'}
					</div>
				) : null}

				{!isLoading && !isError ? (
					<div className="mt-8 grid gap-8">
						<section className="space-y-4">
							<div className="flex items-center justify-between gap-4">
								<h2 className="text-xl font-black text-slate-950 sm:text-2xl">Pending Appointments</h2>
								<p className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
									{pendingAppointments.length} item{pendingAppointments.length === 1 ? '' : 's'}
								</p>
							</div>

							{pendingAppointments.length === 0 ? (
								<div className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-base font-medium text-slate-600 shadow-sm">
									No pending appointments found.
								</div>
							) : (
								<div className="grid gap-4">
									{pendingAppointments.map((appointment) => (
										<AppointmentRow key={appointment._id} appointment={appointment}>
											<span className={`inline-flex items-center rounded-full border px-3 py-1 ${statusBadgeClass.pending}`}>
												Pending
											</span>
											<div className="flex flex-wrap gap-3">
												<button
													type="button"
													onClick={() => handleOpenApproveModal(appointment)}
													className="rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5"
												>
													Approve
												</button>
												<button
													type="button"
													onClick={() => handleRejectAppointment(appointment._id ?? appointment.id)}
													disabled={rejectingBookingId === (appointment._id ?? appointment.id)}
													className="rounded-2xl bg-linear-to-r from-rose-500 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(244,63,94,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
												>
													{rejectingBookingId === (appointment._id ?? appointment.id) ? 'Rejecting...' : 'Reject'}
												</button>
											</div>
										</AppointmentRow>
									))}
								</div>
							)}
						</section>

						<section className="space-y-4">
							<div className="flex items-center justify-between gap-4">
								<h2 className="text-xl font-black text-slate-950 sm:text-2xl">Confirmed Appointments</h2>
								<p className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
									{confirmedAppointments.length} item{confirmedAppointments.length === 1 ? '' : 's'}
								</p>
							</div>

							{confirmedAppointments.length === 0 ? (
								<div className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-base font-medium text-slate-600 shadow-sm">
									No confirmed appointments found.
								</div>
							) : (
								<div className="grid gap-4">
									{confirmedAppointments.map((appointment) => (
										<AppointmentRow key={appointment._id} appointment={appointment}>
											<span className={`inline-flex items-center rounded-full border px-3 py-1 ${statusBadgeClass.confirmed}`}>
												<CheckCircle2 className="mr-1.5 h-4 w-4" />
												Confirmed
											</span>
										</AppointmentRow>
									))}
								</div>
							)}
						</section>
					</div>
				) : null}

				{selectedAppointment ? (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
						<div className="w-full max-w-xl overflow-hidden rounded-4xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
							<div className="bg-linear-to-r from-[#7C3AED] via-[#A855F7] to-[#EC4899] px-6 py-5 text-white">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-xs font-bold uppercase tracking-[0.3em] text-white/75">Approve Appointment</p>
										<h3 className="mt-1 text-2xl font-black">Approve Appointment</h3>
										<p className="mt-1 text-sm text-white/85">Paste the meeting link for this appointment.</p>
									</div>
									<button
										type="button"
										onClick={closeApproveModal}
										className="rounded-full bg-white/15 px-3 py-2 text-sm font-semibold transition hover:bg-white/25"
									>
										Close
									</button>
								</div>
							</div>

							<div className="space-y-5 p-6">
								<div className="rounded-[28px] border border-slate-100 bg-slate-50/80 p-5">
									<label className="block text-sm font-semibold text-slate-700">Meeting Link</label>
									<input
										type="url"
										value={meetingLink}
										onChange={(event) => setMeetingLink(event.target.value)}
										placeholder="https://meet.google.com/abc-defg-hij"
										className="mt-2 block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-100"
									/>
								</div>

								<div className="flex justify-end gap-2">
									<button
										type="button"
										onClick={closeApproveModal}
										className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
									>
										Cancel
									</button>
									<button
										type="button"
										onClick={handleApproveAppointment}
										className="rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(155,93,229,0.22)]"
									>
										Approve Appointment
									</button>
								</div>
							</div>
						</div>
					</div>
				) : null}
			</main>

			<Footer />
		</div>
	)
}

export default DoctorAppointmentsDashboard