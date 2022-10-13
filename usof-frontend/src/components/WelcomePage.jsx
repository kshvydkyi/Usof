const WelcomePage = () => {
    return (
        <>
        <h1>Вітаємо тебе на нашому сайті приколів, крінжі і русофобських мемів.</h1>
        <seaction className='nav-bar-auth'>
            <a className=''href="/registration">Реєстрація</a>
            <a href="/login">Вхід</a>
            <a href="/posts/?page=1">Подивитися пріколи</a>
        </seaction>
        </>
    )
}

export default WelcomePage;