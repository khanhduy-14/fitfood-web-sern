import { useEffect, useState } from 'react'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import manAvatar from '../../../../assets/images/man_avatar.png'
import womanAvatar from '../../../../assets/images/woman_avatar.png'
import { AcceptButton } from '../../../../components/Buttons/Buttons'
import DropdownBase from '../../../../components/DropdownBase/DropdownBase'
import Loading from '../../../../components/Loading/Loading'
import Pagination from '../../../../components/Pagination/Pagination'
import provinces from '../../../../constants/provinces'
import EmployeeInput from '../../../../features/employees/EmployeeInput'
import { useGetEmployeesQuery } from '../../../../features/employees/employeesApi'
import useDebounce from '../../../../hooks/useDebounce'
import { useModal } from '../../../../hooks/useModal'
import useQueryParams from '../../../../hooks/useQueryParams'
import ModalBase from '../../../../components/ModalBase'
import SearchObjectArray from '../../../../utils/SearchObjectArray'
import './EmployeeManagement.scss'
import Swal from 'sweetalert2'
import Form from '../../../../components/Form/Form'
import { SuccessNotify } from '../../../../components/Notify/Notify'
const initialQuery = {
  limit: 5,
  page: 1
}
const roles = ['Tất cả', 'Admin', 'Kế toán', 'Kinh doanh', 'Nhân viên kho']
export default function EmployeeManagement() {
  const location = useLocation()
  const navigate = useNavigate()
  let queryConfig = useQueryParams()
  if (Object.keys(queryConfig).length === 0) {
    queryConfig = { ...initialQuery }
  }
  const { data: employees, isFetching: isGetEmployeeFetching } = useGetEmployeesQuery(queryConfig)
  const {
    activeModalRef: activeTriggerDeleteModalRef,
    open: OpenTriggerDeleteModalRef,
    setOpen: setOpenTriggerDeleteModalRef
  } = useModal()
  const { activeModalRef, open, rect, setOpen } = useModal()
  const [editEmployee, setEditEmployee] = useState(null)
  const {
    activeModalRef: activeModalInputEmployeeRef,
    open: openInputEmployee,
    setOpen: setOpenInputEmployee
  } = useModal()
  //debounce search
  const [search, setSearch] = useState('')
  const debounceSearch = useDebounce(search, 500)
  useEffect(() => {
    navigate({
      pathname: location?.pathname,
      search: createSearchParams({ ...queryConfig, page: 1, search: debounceSearch }).toString()
    })
  }, [debounceSearch])

  // dropdown roles filter
  const handleClickDropdownRoles = (e) => {
    if (e.target.innerHTML === 'Tất cả') {
      navigate({
        pathname: location?.pathname,
        search: createSearchParams({ ...queryConfig, page: 1, role: '' }).toString()
      })
    } else {
      navigate({
        pathname: location?.pathname,
        search: createSearchParams({ ...queryConfig, page: 1, role: e.target.innerHTML.toString() }).toString()
      })
    }
    setOpen(false)
  }

  const handleEditEmployee = (employee) => {
    setEditEmployee(employee)
    setOpenInputEmployee(true)
  }
  const handleClickDeleteEmployee = () => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      text: 'Nhân viên này sẽ bị xóa khỏi cơ sở dữ liệu vĩnh viễn!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff2203',
      cancelButtonText: 'Trở về',
      confirmButtonText: 'Xóa'
    }).then((result) => {
      if (result.isConfirmed) {
      }
    })
  }
  // const handleClickDeleteEmployee = () => {
  //   Swal.fire({
  //     title: 'Bạn có chắc chắn muốn xóa nhân viên này?',
  //     text: "Nhân viên này sẽ bị xóa khỏi cơ sở dữ liệu vĩnh viễn!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#ff2203',
  //     cancelButtonText: "Trở về",
  //     confirmButtonText: 'Xóa'
  //   }).then((result) => {
  //     if (result.isConfirmed) {

  //     }
  //   })
  // }
  const handleClickTriggerDelete = () => {
    SuccessNotify(
      <span>
        Đã bàn giao cho nhân viên mã số 15 <br /> Bạn đã có thể xóa nhân viên này
      </span>,
      10000
    )
  }
  return (
    <>
      <div className='employees-management'>
        <h4 ref={activeTriggerDeleteModalRef}>Quản lý nhân viên</h4>

        <div className='employees-management__operation'>
          <div className='employees-management__operation--search'>
            <input
              type='text'
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              defaultValue={queryConfig?.config}
              placeholder='Tìm kiếm'
            />
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M11 0.25C5.61522 0.25 1.25 4.61522 1.25 10C1.25 15.3848 5.61522 19.75 11 19.75C16.3848 19.75 20.75 15.3848 20.75 10C20.75 4.61522 16.3848 0.25 11 0.25ZM2.75 10C2.75 5.44365 6.44365 1.75 11 1.75C15.5563 1.75 19.25 5.44365 19.25 10C19.25 14.5563 15.5563 18.25 11 18.25C6.44365 18.25 2.75 14.5563 2.75 10Z'
                fill='#000000'
              />
              <path
                d='M19.5304 17.4698C19.2375 17.1769 18.7626 17.1769 18.4697 17.4698C18.1768 17.7626 18.1768 18.2375 18.4697 18.5304L22.4696 22.5304C22.7625 22.8233 23.2374 22.8233 23.5303 22.5304C23.8232 22.2375 23.8232 21.7626 23.5303 21.4697L19.5304 17.4698Z'
                fill='#000000'
              />
            </svg>
          </div>
          <div className='employees-management__operation--role'>
            <label>Chọn chức vụ</label>
            <span ref={activeModalRef}>{queryConfig?.role ? queryConfig?.role : 'Tất cả'}</span>
            {open && (
              <DropdownBase
                rect={rect}
                setOpen={setOpen}
                styleContent={{ position: 'absolute', transform: `translate(${window.scrollX}px,${window.scrollY}px)` }}
              >
                <div className='employee-management__operation--role-dropdown'>
                  {roles.map((role) => {
                    if (role !== queryConfig?.role) {
                      return (
                        <span key={uuidv4()} onClick={handleClickDropdownRoles}>
                          {role}
                        </span>
                      )
                    }
                    return null
                  })}
                </div>
              </DropdownBase>
            )}
          </div>
          <AcceptButton
            width='200px'
            styleButton={{ height: '100%', borderRadius: '4px', marginLeft: 'auto' }}
            ref={activeModalInputEmployeeRef}
          >
            Thêm nhân viên
          </AcceptButton>
        </div>
        <div className='employees-management__table-wrapper'>
          <div className='employees-management__table'>
            {/* header */}
            <div className='employees-management__table--row'>
              <div className='table-data'>Mã</div>
              <div className='table-data'>Nhân viên</div>
              <div className='table-data'>Công việc</div>
              <div className='table-data'>Ngày sinh</div>
              <div className='table-data'>Số điện thoại</div>
              <div className='table-data'>Email</div>
              <div className='table-data'>Địa chỉ</div>
              <div className='table-data'></div>
            </div>

            {/* table data */}
            {employees?.data &&
              employees.data.map((employee) => {
                const avatar = employee?.Avatar ? employee?.Avatar : employee?.Gender === 0 ? manAvatar : womanAvatar
                const province = SearchObjectArray(employee.Province * 1, provinces, 'code').name
                return (
                  <div key={employee?.EmployeeID} className='employees-management__table--row'>
                    <div className='table-data' style={{ textAlign: 'center' }}>
                      {employee.EmployeeID}
                    </div>
                    <div className='table-data'>
                      <div className='table-data__image-name'>
                        <img src={avatar} alt={`Fitfood ${employee?.Name}`} />
                        <span>{employee.Name}</span>
                      </div>
                    </div>
                    <div className='table-data'>{employee.Role}</div>
                    <div className='table-data'>{employee.DayOfBirth}</div>
                    <div className='table-data'>{employee.PhoneNumber}</div>
                    <div className='table-data'>{employee.Username}</div>
                    <div className='table-data'>{province}</div>
                    <div className='table-data'>
                      <div className='table-data__operation'>
                        <div className='table-data__operation--icon' onClick={() => handleEditEmployee(employee)}>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 40 40'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M30.6001 9.37936C29.0332 7.9852 26.4928 7.9852 24.9259 9.37936L9.01937 23.5323C8.91036 23.6293 8.83165 23.7496 8.79056 23.8816L6.69879 30.6008C6.61277 30.8763 6.70019 31.1713 6.92727 31.3736C7.15469 31.5757 7.48625 31.6535 7.79587 31.5772L15.3476 29.7158C15.496 29.6792 15.6311 29.6092 15.7401 29.5122L31.6463 15.3589C33.2108 13.9638 33.2108 11.7053 31.6463 10.3103L30.6001 9.37936ZM10.9621 24.048L23.9804 12.4646L28.1789 16.2002L15.1602 27.7836L10.9621 24.048ZM10.1234 25.5453L13.4777 28.5301L8.83792 29.6739L10.1234 25.5453ZM30.3856 14.2371L29.44 15.0784L25.2411 11.3425L26.1871 10.5011C27.0574 9.72674 28.4686 9.72674 29.339 10.5011L30.3856 11.432C31.2545 12.2074 31.2545 13.4621 30.3856 14.2371Z'
                              fill='#1A48E9'
                              stroke='#1A48E9'
                              strokeWidth='0.333333'
                            />
                          </svg>
                        </div>
                        <div className='table-data__operation--icon' onClick={() => handleClickDeleteEmployee()}>
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 40 40'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M28.0387 29.4761C27.552 29.4761 27.0628 29.4761 26.5761 29.4761C25.4071 29.4761 24.2406 29.4761 23.0715 29.4761C21.6759 29.4761 20.2802 29.4761 18.882 29.4761C17.682 29.4761 16.4821 29.4761 15.2821 29.4761C14.7311 29.4761 14.1774 29.4784 13.6264 29.4761C13.5285 29.4761 13.4307 29.4691 13.3328 29.4598C13.423 29.4714 13.5157 29.483 13.6058 29.4923C13.423 29.4691 13.2453 29.4274 13.0728 29.3648C13.1552 29.3949 13.2376 29.4274 13.32 29.4575C13.1423 29.3903 12.9775 29.3045 12.8256 29.1979C12.8951 29.2465 12.9646 29.2952 13.0341 29.3439C12.8925 29.2442 12.7663 29.1306 12.6556 29.0031C12.7097 29.0657 12.7638 29.1283 12.8178 29.1909C12.702 29.0541 12.6041 28.9057 12.5294 28.7458C12.5629 28.82 12.599 28.8942 12.6324 28.9683C12.5629 28.813 12.5166 28.653 12.4908 28.4884C12.5037 28.5696 12.5166 28.653 12.5269 28.7342C12.4985 28.5278 12.5088 28.3169 12.5088 28.1105C12.5088 27.7396 12.5088 27.3687 12.5088 26.9977C12.5088 26.4344 12.5088 25.871 12.5088 25.3076C12.5088 24.6144 12.5088 23.9189 12.5088 23.2257C12.5088 22.4653 12.5088 21.7049 12.5088 20.9445C12.5088 20.1701 12.5088 19.3958 12.5088 18.6238C12.5088 17.9004 12.5088 17.1771 12.5088 16.4538C12.5088 15.844 12.5088 15.2343 12.5088 14.6269C12.5088 14.1864 12.5088 13.7436 12.5088 13.3031C12.5088 13.0945 12.5114 12.8858 12.5088 12.6771C12.5088 12.6679 12.5088 12.6586 12.5088 12.6493C12.1664 12.9577 11.8213 13.2683 11.4788 13.5767C11.6462 13.5767 11.8136 13.5767 11.9784 13.5767C12.4316 13.5767 12.8874 13.5767 13.3406 13.5767C14.0075 13.5767 14.677 13.5767 15.3439 13.5767C16.1628 13.5767 16.9816 13.5767 17.8005 13.5767C18.6966 13.5767 19.5953 13.5767 20.4914 13.5767C21.3978 13.5767 22.3016 13.5767 23.208 13.5767C24.0526 13.5767 24.8972 13.5767 25.7418 13.5767C26.4525 13.5767 27.1632 13.5767 27.8739 13.5767C28.3863 13.5767 28.9013 13.5767 29.4138 13.5767C29.6584 13.5767 29.9004 13.579 30.1451 13.5767C30.1554 13.5767 30.1657 13.5767 30.176 13.5767C29.8335 13.2683 29.4884 12.9577 29.146 12.6493C29.146 12.7931 29.146 12.9368 29.146 13.0805C29.146 13.4677 29.146 13.8572 29.146 14.2444C29.146 14.8193 29.146 15.3966 29.146 15.9716C29.146 16.674 29.146 17.3742 29.146 18.0766C29.146 18.8394 29.146 19.6021 29.146 20.3672C29.146 21.1392 29.146 21.9112 29.146 22.6832C29.146 23.3996 29.146 24.116 29.146 24.8324C29.146 25.4305 29.146 26.0286 29.146 26.6268C29.146 27.051 29.146 27.4776 29.146 27.9019C29.146 28.0897 29.146 28.2775 29.146 28.4653C29.146 28.5557 29.1408 28.6438 29.1279 28.7342C29.1408 28.653 29.1537 28.5696 29.164 28.4884C29.1382 28.653 29.0919 28.813 29.0224 28.9683C29.0558 28.8942 29.0919 28.82 29.1254 28.7458C29.0507 28.9057 28.9554 29.0541 28.837 29.1909C28.891 29.1283 28.9451 29.0657 28.9992 29.0031C28.8885 29.1306 28.7623 29.2442 28.6207 29.3439C28.6902 29.2952 28.7597 29.2465 28.8292 29.1979C28.6773 29.3022 28.5125 29.3903 28.3348 29.4575C28.4172 29.4274 28.4996 29.3949 28.582 29.3648C28.4095 29.4274 28.2318 29.4691 28.049 29.4923C28.1391 29.4807 28.2318 29.4691 28.322 29.4598C28.2293 29.4714 28.134 29.4761 28.0387 29.4761C27.7735 29.4784 27.498 29.5781 27.31 29.7473C27.1323 29.9073 26.9958 30.1716 27.0087 30.4034C27.0345 30.9019 27.4619 31.3354 28.0387 31.3308C28.8988 31.3238 29.7665 31.0062 30.3485 30.4289C30.8918 29.8911 31.2034 29.2048 31.2085 28.4745C31.2111 28.2867 31.2085 28.0966 31.2085 27.9088C31.2085 27.4382 31.2085 26.9676 31.2085 26.4993C31.2085 25.8223 31.2085 25.1453 31.2085 24.4684C31.2085 23.6685 31.2085 22.871 31.2085 22.0712C31.2085 21.225 31.2085 20.3788 31.2085 19.5349C31.2085 18.7165 31.2085 17.9004 31.2085 17.0821C31.2085 16.3796 31.2085 15.6748 31.2085 14.9723C31.2085 14.4553 31.2085 13.9383 31.2085 13.4213C31.2085 13.1756 31.2111 12.9275 31.2085 12.6818C31.2085 12.6702 31.2085 12.6609 31.2085 12.6493C31.2085 12.1486 30.7373 11.722 30.1785 11.722C30.0112 11.722 29.8438 11.722 29.679 11.722C29.2258 11.722 28.77 11.722 28.3168 11.722C27.6499 11.722 26.9804 11.722 26.3135 11.722C25.4946 11.722 24.6757 11.722 23.8569 11.722C22.9608 11.722 22.0621 11.722 21.166 11.722C20.2596 11.722 19.3558 11.722 18.4494 11.722C17.6048 11.722 16.7602 11.722 15.9156 11.722C15.2049 11.722 14.4942 11.722 13.7835 11.722C13.271 11.722 12.756 11.722 12.2436 11.722C11.999 11.722 11.7569 11.7197 11.5123 11.722C11.502 11.722 11.4917 11.722 11.4814 11.722C10.9252 11.722 10.4514 12.1462 10.4514 12.6493C10.4514 13.1408 10.4514 13.63 10.4514 14.1215C10.4514 15.3039 10.4514 16.4885 10.4514 17.6709C10.4514 19.1315 10.4514 20.5897 10.4514 22.0503C10.4514 23.3764 10.4514 24.7025 10.4514 26.0263C10.4514 26.7868 10.4514 27.5449 10.4514 28.3053C10.4514 28.8547 10.557 29.3856 10.8557 29.8725C11.4119 30.7836 12.514 31.3284 13.6573 31.3308C14.4427 31.3308 15.2281 31.3308 16.0134 31.3308C17.5275 31.3308 19.0442 31.3308 20.5583 31.3308C22.1085 31.3308 23.656 31.3308 25.2062 31.3308C26.1075 31.3308 27.0087 31.3308 27.9074 31.3308C27.9512 31.3308 27.9949 31.3308 28.0387 31.3308C28.5769 31.3308 29.0945 30.9042 29.0687 30.4034C29.043 29.9026 28.6155 29.4761 28.0387 29.4761Z'
                              fill='#E62614'
                            />
                            <path
                              d='M23.841 8.33231C23.3852 8.33231 22.9269 8.33231 22.4711 8.33231C21.5724 8.33231 20.6712 8.33231 19.7725 8.33231C19.1519 8.33231 18.5313 8.33231 17.9107 8.33231C17.388 8.33231 16.8498 8.43664 16.4147 8.70557C15.6705 9.15997 15.2147 9.88098 15.2096 10.6971C15.2044 11.3276 15.2096 11.9582 15.2096 12.5888C15.2096 12.6097 15.2096 12.6306 15.2096 12.6514C15.2096 13.1522 15.6808 13.5788 16.2396 13.5788C16.5434 13.5788 16.8473 13.5788 17.1511 13.5788C17.8824 13.5788 18.6111 13.5788 19.3424 13.5788C20.2308 13.5788 21.1192 13.5788 22.0076 13.5788C22.7724 13.5788 23.5346 13.5788 24.2993 13.5788C24.6701 13.5788 25.0435 13.5834 25.4143 13.5788C25.4195 13.5788 25.4246 13.5788 25.4298 13.5788C25.986 13.5788 26.4598 13.1545 26.4598 12.6514C26.4598 12.197 26.4598 11.7403 26.4598 11.2859C26.4598 11.0912 26.4598 10.8987 26.4598 10.704C26.4572 10.1175 26.2229 9.59814 25.816 9.14606C25.3396 8.62211 24.5774 8.33927 23.841 8.33231C23.3028 8.32768 22.7852 8.76353 22.811 9.25966C22.8367 9.76738 23.2642 10.1824 23.841 10.187C23.9131 10.187 23.9826 10.1916 24.0521 10.1986C23.962 10.187 23.8693 10.1754 23.7792 10.1661C23.9157 10.1847 24.047 10.2148 24.1757 10.2635C24.0933 10.2334 24.0109 10.2009 23.9285 10.1708C24.0521 10.2195 24.168 10.2797 24.2762 10.3516C24.2066 10.3029 24.1371 10.2542 24.0676 10.2056C24.1835 10.2867 24.2839 10.3771 24.374 10.4814C24.3199 10.4188 24.2659 10.3563 24.2118 10.2937C24.2916 10.391 24.3586 10.4954 24.4126 10.6066C24.3792 10.5324 24.3431 10.4583 24.3096 10.3841C24.3611 10.5 24.3972 10.6182 24.4178 10.7411C24.4049 10.66 24.392 10.5765 24.3817 10.4954C24.4152 10.7504 24.3946 11.017 24.3946 11.272C24.3946 11.6406 24.3946 12.0116 24.3946 12.3802C24.3946 12.4706 24.3946 12.5587 24.3946 12.6491C24.7371 12.3408 25.0821 12.0301 25.4246 11.7218C25.1208 11.7218 24.8169 11.7218 24.5131 11.7218C23.7818 11.7218 23.053 11.7218 22.3217 11.7218C21.4334 11.7218 20.545 11.7218 19.6566 11.7218C18.8918 11.7218 18.1296 11.7218 17.3648 11.7218C16.994 11.7218 16.6207 11.7148 16.2499 11.7218C16.2447 11.7218 16.2396 11.7218 16.2344 11.7218C16.5769 12.0301 16.9219 12.3408 17.2644 12.6491C17.2644 12.0533 17.2644 11.4598 17.2644 10.864C17.2644 10.7411 17.2618 10.6182 17.2773 10.4954C17.2644 10.5765 17.2515 10.66 17.2412 10.7411C17.2618 10.6182 17.2953 10.5 17.3494 10.3841C17.3159 10.4583 17.2799 10.5324 17.2464 10.6066C17.3005 10.4954 17.3674 10.391 17.4472 10.2937C17.3932 10.3563 17.3391 10.4188 17.285 10.4814C17.3751 10.3771 17.4756 10.2867 17.5914 10.2056C17.5219 10.2542 17.4524 10.3029 17.3829 10.3516C17.491 10.2797 17.6069 10.2195 17.7305 10.1708C17.6481 10.2009 17.5657 10.2334 17.4833 10.2635C17.612 10.2171 17.7434 10.1847 17.8798 10.1661C17.7897 10.1777 17.697 10.1893 17.6069 10.1986C17.8489 10.1708 18.1013 10.187 18.3459 10.187C18.8197 10.187 19.2935 10.187 19.7673 10.187C20.8669 10.187 21.9664 10.187 23.0685 10.187C23.3234 10.187 23.5809 10.187 23.8358 10.187C24.374 10.187 24.8916 9.76043 24.8658 9.25966C24.8452 8.75657 24.4178 8.33231 23.841 8.33231Z'
                              fill='#E62614'
                            />
                            <path
                              d='M32.3014 11.722C32.0979 11.722 31.8919 11.722 31.6885 11.722C31.1323 11.722 30.5761 11.722 30.0199 11.722C29.1985 11.722 28.3745 11.722 27.553 11.722C26.5488 11.722 25.5445 11.722 24.5429 11.722C23.4433 11.722 22.3438 11.722 21.2443 11.722C20.1344 11.722 19.0246 11.722 17.9148 11.722C16.8796 11.722 15.8445 11.722 14.8093 11.722C13.9338 11.722 13.0583 11.722 12.1854 11.722C11.5545 11.722 10.9237 11.722 10.2928 11.722C9.99665 11.722 9.70053 11.7197 9.40183 11.722C9.38895 11.722 9.37608 11.722 9.3632 11.722C8.82502 11.722 8.30745 12.1486 8.3332 12.6493C8.35895 13.1524 8.7864 13.5767 9.3632 13.5767C9.56663 13.5767 9.77263 13.5767 9.97605 13.5767C10.5323 13.5767 11.0885 13.5767 11.6447 13.5767C12.4661 13.5767 13.2901 13.5767 14.1115 13.5767C15.1158 13.5767 16.12 13.5767 17.1217 13.5767C18.2212 13.5767 19.3207 13.5767 20.4203 13.5767C21.5301 13.5767 22.6399 13.5767 23.7498 13.5767C24.7849 13.5767 25.8201 13.5767 26.8552 13.5767C27.7307 13.5767 28.6062 13.5767 29.4791 13.5767C30.11 13.5767 30.7409 13.5767 31.3718 13.5767C31.6679 13.5767 31.964 13.579 32.2627 13.5767C32.2756 13.5767 32.2885 13.5767 32.3014 13.5767C32.8395 13.5767 33.3571 13.1501 33.3314 12.6493C33.3056 12.1462 32.8782 11.722 32.3014 11.722Z'
                              fill='#E62614'
                            />
                            <path
                              d='M18.5728 26.2319C18.5728 25.9189 18.5728 25.6059 18.5728 25.2953C18.5728 24.5441 18.5728 23.7953 18.5728 23.0441C18.5728 22.14 18.5728 21.2381 18.5728 20.3339C18.5728 19.5503 18.5728 18.7644 18.5728 17.9808C18.5728 17.6006 18.5806 17.2204 18.5728 16.8402C18.5728 16.8355 18.5728 16.8286 18.5728 16.8239C18.5728 16.3394 18.0994 15.8734 17.5436 15.8966C16.9853 15.9198 16.5144 16.3046 16.5144 16.8239C16.5144 17.1369 16.5144 17.4499 16.5144 17.7606C16.5144 18.5117 16.5144 19.2605 16.5144 20.0117C16.5144 20.9159 16.5144 21.8177 16.5144 22.7219C16.5144 23.5055 16.5144 24.2914 16.5144 25.075C16.5144 25.4552 16.5067 25.8354 16.5144 26.2157C16.5144 26.2203 16.5144 26.2272 16.5144 26.2319C16.5144 26.7164 16.9879 27.1824 17.5436 27.1592C18.0994 27.1384 18.5728 26.7535 18.5728 26.2319Z'
                              fill='#E62614'
                            />
                            <path
                              d='M25.1451 26.2319C25.1451 25.9189 25.1451 25.6059 25.1451 25.2953C25.1451 24.5441 25.1451 23.7953 25.1451 23.0441C25.1451 22.14 25.1451 21.2381 25.1451 20.3339C25.1451 19.5503 25.1451 18.7644 25.1451 17.9808C25.1451 17.6006 25.1528 17.2204 25.1451 16.8402C25.1451 16.8355 25.1451 16.8286 25.1451 16.8239C25.1451 16.3394 24.6717 15.8734 24.1159 15.8966C23.5575 15.9198 23.0867 16.3046 23.0867 16.8239C23.0867 17.1369 23.0867 17.4499 23.0867 17.7606C23.0867 18.5117 23.0867 19.2605 23.0867 20.0117C23.0867 20.9159 23.0867 21.8177 23.0867 22.7219C23.0867 23.5055 23.0867 24.2914 23.0867 25.075C23.0867 25.4552 23.079 25.8354 23.0867 26.2157C23.0867 26.2203 23.0867 26.2272 23.0867 26.2319C23.0867 26.7164 23.5601 27.1824 24.1159 27.1592C24.6742 27.1384 25.1451 26.7535 25.1451 26.2319Z'
                              fill='#E62614'
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
        {/* Pagination */}
        {employees?.pageSize > 1 && (
          <Pagination
            queryConfig={queryConfig}
            pageSize={employees?.pageSize}
            pathname={location?.pathname}
            stylePagination={{ margin: '20px auto 0' }}
          />
        )}
        {/* Input Employee */}
        {openInputEmployee && (
          <ModalBase styleContent={{ width: '1100px', height: 'max-content' }} setOpen={setOpenInputEmployee}>
            <EmployeeInput
              editEmployee={editEmployee}
              setOpenInputEmployee={setOpenInputEmployee}
              setEditEmployee={setEditEmployee}
            />
          </ModalBase>
        )}
        {/* Trigger Delete Modal  */}
        {OpenTriggerDeleteModalRef && (
          <ModalBase styleContent={{ width: '600px', height: 'max-content' }} setOpen={setOpenTriggerDeleteModalRef}>
            <div className='employees-trigger-delete'>
              <h4>Vui lòng nhập mã nhân viên bàn giao công việc</h4>
              <div className='formInput'>
                <input type='text' className='formInput__input' placeholder=' ' />
                <span className='formInput__placeHolder'>Mã nhân viên</span>
              </div>
              <AcceptButton onClick={handleClickTriggerDelete}>Xác nhận bàn giao</AcceptButton>
            </div>
          </ModalBase>
        )}
        {/* Loading */}
        {isGetEmployeeFetching && <Loading size={3} full />}
      </div>
    </>
  )
}
