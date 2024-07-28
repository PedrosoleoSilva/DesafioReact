import './Rodape.css';

const Rodape = () => {
    return (
        <footer className="footer">
            <section>
                <ul>
                    <li>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/fb.png" alt="Facebook" />
                        </a>
                    </li>
                    <li>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/tw.png" alt="Twitter" />
                        </a>
                    </li>
                    <li>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <img src="/assets/ig.png" alt="Instagram" />
                        </a>
                    </li>
                </ul>
            </section>
            <section>
                <img src="/assets/expoarte.png" alt="Logo" className="footer-logo" />
            </section>
            <section>
                <p>
                    Desenvolvido por Leonardo
                </p>
            </section>
        </footer>
    );
}

export default Rodape;
