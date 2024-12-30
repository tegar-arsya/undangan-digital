import Swal from 'sweetalert2';

export const showConfirmation = async ({
  title,
  text,
  confirmButtonText
}: {
  title: string;
  text: string;
  confirmButtonText: string;
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
  });

  return result.isConfirmed;
};

export const showSuccess = (message: string) => {
  Swal.fire({
    icon: 'success',
    title: 'Success!',
    text: message,
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
};

export const showError = (message: string) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
  });
};