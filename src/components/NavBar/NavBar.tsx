import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ReactComponent as ProfileIcon } from '../../assets/icons/account.svg'
import { ReactComponent as CartIcon } from '../../assets/icons/cart.svg'
import { ReactComponent as MenuIcon } from '../../assets/icons/menu.svg'
import { ReactComponent as SearchIcon } from '../../assets/icons/search.svg'
import logo from '../../assets/images/logo.svg'
import { navigationItems } from '../../config/navigation'
import styles from './NavBar.module.css'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { setShowAuthModal } from '../../store/slices/dataSlice'
import AuthModal from '../AuthModal/AuthModal'

interface NavBarProps {
    dark?: boolean
}

const NavBar: React.FC<NavBarProps> = ({ dark = false }) => {
    const data = useAppSelector((state) => state.data)

    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const [menuVisible, setMenuVisible] = useState(false) // Управление видимостью меню
    const menuRef = useRef<HTMLDivElement>(null) // Добавлено: ссылка на боковое меню

    useEffect(() => {
        // Устанавливаем значения по умолчанию для CSS-переменных и фильтров
        document.documentElement.style.setProperty('--link-color', 'white')

        const handleScroll = () => {
            // Меняем цвет ссылок и иконок в зависимости от фона NavBar
            const bgOpacity = parseFloat(
                getComputedStyle(document.documentElement)
                    .getPropertyValue('--navbar-bg')
                    .split(',')[3] || '0'
            )

            if (bgOpacity >= 0.5) {
                document.documentElement.style.setProperty(
                    '--link-color',
                    'black'
                )
                document.documentElement.style.setProperty(
                    '--icon-filter',
                    'brightness(0) invert(0)'
                )
            } else {
                document.documentElement.style.setProperty(
                    '--link-color',
                    'white'
                )
                document.documentElement.style.setProperty(
                    '--icon-filter',
                    'brightness(0) invert(1)'
                )
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            // Закрываем меню, если клик вне его
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuVisible(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        if (menuVisible) {
            document.addEventListener('mousedown', handleClickOutside) // Добавляем слушатель для кликов вне меню
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            window.removeEventListener('scroll', handleScroll)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [menuVisible])

    return (
        <div className={styles.navbar}>
            <AuthModal show={data.showAuthModal} />
            {/* Левая часть: Логотип и вкладки */}
            <div className={styles.leftSection}>
                <img src={logo} alt='Logo' className={styles.logo} />
                {/* Вкладки навигации */}
                {navigationItems.map((page) => (
                    <NavLink
                        key={page.path}
                        to={page.path}
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.link} ${styles.activeLink} ${
                                      menuVisible ? 'show' : ''
                                  }`
                                : `${styles.link} ${menuVisible ? 'show' : ''}`
                        }
                        style={{
                            color: dark ? 'black' : undefined,
                        }}
                        onClick={() => setMenuVisible(false)} // Закрываем меню при переходе по ссылке
                    >
                        {page.name}
                    </NavLink>
                ))}
            </div>

            {/* Правая часть: Иконки и кнопка меню */}
            <div className={styles.rightSection}>
                <SearchIcon
                    className={styles.icon}
                    style={{
                        filter: dark
                            ? 'brightness(1) invert(1)'
                            : 'var(--icon-filter)',
                    }}
                />
                <ProfileIcon
                    onClick={() =>
                        data.authorized
                            ? navigate('/account')
                            : dispatch(setShowAuthModal(true))
                    }
                    className={styles.icon}
                    style={{
                        filter: dark
                            ? 'brightness(1) invert(1)'
                            : 'var(--icon-filter)',
                    }}
                />
                <CartIcon
                    className={styles.icon}
                    style={{
                        filter: dark
                            ? 'brightness(1) invert(1)'
                            : 'var(--icon-filter)',
                    }}
                />
                <MenuIcon
                    className={styles.icon}
                    style={{
                        filter: dark
                            ? 'brightness(1) invert(1)'
                            : 'var(--icon-filter)',
                    }}
                    onClick={() => setMenuVisible(!menuVisible)} // Переключение видимости меню
                />
            </div>

            {/* Боковое меню */}
            <div
                ref={menuRef} // Добавлено: ссылка на меню
                className={`${styles.sidebarMenu} ${
                    menuVisible ? styles.open : ''
                }`}
            >
                <div
                    className={styles.closeButton}
                    onClick={() => setMenuVisible(false)}
                >
                    <MenuIcon className={styles.closeIcon} />{' '}
                    {/* Или заменить на 'X' */}
                </div>
                {navigationItems.map((page) => (
                    <NavLink
                        key={page.path}
                        to={page.path}
                        className={styles.menuLink}
                        onClick={() => setMenuVisible(false)} // Закрываем меню при переходе по ссылке
                    >
                        {page.name}
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default NavBar
