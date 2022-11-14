import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from "../../../assets/images/logo.png";
import AccountDropdown from '../../../features/account/AccountDropdown';
import "./LayoutComponents.scss";
export default function LayoutComponents() {
    return null;
}


function Logo() {
    return (
        <Link to="/">
        <div className="layout__logo">
            <div className="layout__logo--image">
                <img src={logo} alt="Fitfood logo" />
                    <h1>Fitfood</h1>

            </div>
        </div>
        </Link>
    );
}

function Menu() {
    const [coords, setCoords] = useState();
    const location = useLocation();
    useEffect(() => {
        const activeItem = document.querySelector(".layout__menu--item.active");
        if (activeItem) {
            setCoords({
                left: activeItem.offsetLeft,
                width: activeItem.offsetWidth,
            });
        } else {
            setCoords({
                left: 0,
                width: 0,
            });
        }

    }, [location]);
    return (
        <ul className="layout__menu body4" >
            <NavLink to="/" className="layout__menu--item" end>Trang chủ</NavLink>
            <NavLink to="/tinh-calo" className="layout__menu--item">Tính calo</NavLink>
            <NavLink to="/thuc-don" className="layout__menu--item">Thực đơn</NavLink>
            <NavLink to="/faqs" className="layout__menu--item">FAQs</NavLink>
            <NavLink to="/ve-chung-toi" className="layout__menu--item">Về chúng tôi</NavLink>
            <div className="layout__menu--underBorder" style={{ left: `${coords?.left}px`, width: `${coords?.width}px` }}></div>
        </ul>
    );
}

function Function() {
    return (
        <div className="layout__function">
            <div className="layout__function--cart">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 6H7.00002M17 6H18.3087C20.3944 6 21.4373 6 22.0335 6.66616C22.6298 7.33231 22.5146 8.36879 22.2843 10.4417L21.9884 13.1043C21.5183 17.3356 21.2832 19.4513 19.8594 20.7256C18.4356 22 16.2904 22 12 22C7.70962 22 5.56443 22 4.14063 20.7256C2.71683 19.4513 2.48176 17.3356 2.01161 13.1043L1.71577 10.4417C1.48544 8.36879 1.37028 7.33231 1.96652 6.66616C2.56276 6 3.60561 6 5.6913 6H7.00002M17 6C17 3.23858 14.7614 1 12 1C9.30679 1 7.1109 3.12938 7.00409 5.79641C7.00139 5.86394 7.00002 5.93181 7.00002 6" stroke="#000000" stroke-width="1.5" />
                    <path d="M18 10C18 10.5523 17.5523 11 17 11C16.4477 11 16 10.5523 16 10C16 9.44772 16.4477 9 17 9C17.5523 9 18 9.44772 18 10Z" fill="#000000" />
                    <path d="M8 10C8 10.5523 7.55228 11 7 11C6.44772 11 6 10.5523 6 10C6 9.44772 6.44772 9 7 9C7.55228 9 8 9.44772 8 10Z" fill="#000000" />
                </svg>

            </div>
            <AccountDropdown/>
        </div>
    );
}

function Contact() {
    return (
        <div className="layout__contact">
            <span className='body3'>Contact:</span>
            <h4><a href='tel:0333521488'>0333521488</a></h4>
        </div>
    );
}
LayoutComponents.Logo = Logo;
LayoutComponents.Menu = Menu;
LayoutComponents.Function = Function;
LayoutComponents.Contact = Contact;