import Swal from 'sweetalert2'

const showToast = (message, icon = 'success', options = {}) => {
  return Swal.fire({
    toast: true,
    position: 'top-end',
    icon,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    ...options,
  })
}

export default showToast
