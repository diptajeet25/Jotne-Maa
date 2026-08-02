import { useContext, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays, CheckCircle2, Clock3, Sparkles, UserRound, Video, XCircle } from 'lucide-react'
import Header from '../Components/Header.jsx'
import Footer from '../Components/Home/Footer.jsx'
import useAxiosSecure from '../Hooks/useAxiosSecure'
import { AuthContext } from '../Context/AuthContext.jsx'
import { Link } from 'react-router-dom'

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

const formatAppointmentTime = (timeValue) => {
	if (!timeValue) return ''
	const [hourStr, minuteStr = '00'] = String(timeValue).split(':')
	const hour = Number(hourStr)
	if (Number.isNaN(hour)) return String(timeValue)
	const suffix = hour >= 12 ? 'PM' : 'AM'
	const displayHour = hour % 12 || 12
	return `${displayHour}:${minuteStr} ${suffix}`
}

const statusStyles = {
	pending: 'border-amber-200 bg-amber-50 text-amber-700',
	confirmed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
	rejected: 'border-rose-200 bg-rose-50 text-rose-700',
}

const SummaryCard = ({ title, value, icon: Icon, accentClass }) => (
	<div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
		<div className={`absolute inset-x-0 top-0 h-1.5 ${accentClass}`} />
		<div className="flex items-start justify-between gap-4">
			<div>
				<p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
				<p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
			</div>
			<div className="rounded-2xl bg-slate-50 p-3 text-slate-700 shadow-sm">
				<Icon className="h-6 w-6" />
			</div>
		</div>
	</div>
)

const AppointmentCard = ({ appointment, children }) => (
	<div className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(15,23,42,0.09)]">
		<div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
			<div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				<div className="rounded-2xl bg-slate-50 px-4 py-3">
					<p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Doctor Name</p>
					<p className="mt-1 text-sm font-semibold text-slate-900">{appointment.doctorName}</p>
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
						<span>{formatAppointmentTime(appointment.appointmentTime)}</span>
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

const MyAppointments = () => {
	const axios = useAxiosSecure()
	const { user: loggedInUser } = useContext(AuthContext)

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['my-appointments', loggedInUser?.email],
		queryFn: async () => {
			if (!loggedInUser?.email) return []
			const response = await axios.get(`/myappointment?patientEmail=${loggedInUser.email}`)
			return Array.isArray(response.data) ? response.data : []
		},
		enabled: Boolean(loggedInUser?.email),
		staleTime: 1000 * 60 * 2,
	})

	const appointments = Array.isArray(data) ? data : []

	const pendingAppointments = useMemo(
		() => appointments.filter((appointment) => appointment.status === 'pending'),
		[appointments],
	)

	const confirmedAppointments = useMemo(
		() => appointments.filter((appointment) => appointment.status === 'confirmed'),
		[appointments],
	)

	const rejectedAppointments = useMemo(
		() => appointments.filter((appointment) => appointment.status === 'rejected'),
		[appointments],
	)

	const summaryCounts = useMemo(
		() => ({
			pending: pendingAppointments.length,
			confirmed: confirmedAppointments.length,
			rejected: rejectedAppointments.length,
			total: appointments.length,
		}),
		[pendingAppointments.length, confirmedAppointments.length, rejectedAppointments.length, appointments.length],
	)

	const renderAppointmentSection = (title, items, emptyMessage, badgeClass, badgeLabel, children) => (
		<section className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<h2 className="text-xl font-black text-slate-950 sm:text-2xl">{title}</h2>
				<p className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-100">
					{items.length} item{items.length === 1 ? '' : 's'}
				</p>
			</div>

			{items.length === 0 ? (
				<div className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-base font-medium text-slate-600 shadow-sm">
					{emptyMessage}
				</div>
			) : (
				<div className="grid gap-4">
					{items.map((appointment) => (
						<AppointmentCard key={appointment._id} appointment={appointment}>
							<span className={`inline-flex items-center rounded-full border px-3 py-1 ${badgeClass}`}>
								{badgeLabel}
							</span>
							{children?.(appointment)}
						</AppointmentCard>
					))}
				</div>
			)}
		</section>
	)

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
								My Appointments
							</div>
							<h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
								Track your care journey in one elegant view.
							</h1>
							<p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
								See every request, confirmed visit, and rejected appointment with clear meeting access and status updates.
							</p>
						</div>

						<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
							<SummaryCard
								title="Pending Count"
								value={summaryCounts.pending}
								icon={UserRound}
								accentClass="bg-gradient-to-r from-amber-400 to-orange-500"
							/>
							<SummaryCard
								title="Confirmed Count"
								value={summaryCounts.confirmed}
								icon={CheckCircle2}
								accentClass="bg-gradient-to-r from-emerald-400 to-emerald-600"
							/>
							<SummaryCard
								title="Rejected Count"
								value={summaryCounts.rejected}
								icon={XCircle}
								accentClass="bg-gradient-to-r from-rose-400 to-rose-600"
							/>
							<SummaryCard
								title="Total Appointments"
								value={summaryCounts.total}
								icon={Sparkles}
								accentClass="bg-gradient-to-r from-[#FF5FA2] to-[#9B5DE5]"
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
						{appointments.length === 0 ? (
							<div className="rounded-4xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
								<div className="mx-auto flex max-w-md flex-col items-center">
									<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-[#FF5FA2] to-[#9B5DE5] text-white shadow-[0_18px_40px_rgba(155,93,229,0.24)]">
										<CalendarDays className="h-8 w-8" />
									</div>
									<h2 className="mt-5 text-2xl font-black text-slate-950">No appointments found.</h2>
									<p className="mt-2 text-sm leading-7 text-slate-600">
										You have not booked any appointments yet. Start by booking a consultation with a trusted doctor.
									</p>
									<Link
										to="/booking-appointment"
										className="mt-6 inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(155,93,229,0.22)] transition hover:-translate-y-0.5"
									>
										Book Appointment
									</Link>
								</div>
							</div>
						) : (
							<>
								{renderAppointmentSection(
									'Pending Appointments',
									pendingAppointments,
									'No pending appointments found.',
									statusStyles.pending,
									'Pending',
									() => (
										<p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
											Your appointment request is waiting for doctor approval.
										</p>
									),
								)}

								{renderAppointmentSection(
									'Confirmed Appointments',
									confirmedAppointments,
									'No confirmed appointments found.',
									statusStyles.confirmed,
									'Confirmed',
									(appointment) => (
										<div className="mt-4 space-y-3 rounded-2xl bg-emerald-50 px-4 py-3">
											{appointment.meetingLink ? (
												<>
													<p className="text-sm font-medium text-emerald-700">Meeting link available</p>
													<button
														type="button"
														onClick={() => window.open(appointment.meetingLink, '_blank')}
														className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(16,185,129,0.22)] transition hover:-translate-y-0.5"
													>
														<Video className="h-4 w-4" />
														Join Meeting
													</button>
												</>
											) : (
												<p className="text-sm font-medium text-slate-600">Meeting link not available yet</p>
											)}
										</div>
									),
								)}

								{renderAppointmentSection(
									'Rejected Appointments',
									rejectedAppointments,
									'No rejected appointments found.',
									statusStyles.rejected,
									'Rejected',
									() => (
										<p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
											Unfortunately this appointment request was rejected.
										</p>
									),
								)}
							</>
						)}
					</div>
				) : null}
			</main>

			<Footer />
		</div>
	)
}

export default MyAppointments