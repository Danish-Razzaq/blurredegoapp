import Hero1Slider from '../slider/HeroSlider';
import Link from 'next/link';
import bannerImage from '../../../../public/assets/imgs/page/homepage1/hero.png';

export default function Hero() {
    return (
        <>
            <section className="section">
                <div className="banner-1" style={{ backgroundImage: `url(${bannerImage.src})` }}>
                    <div className="cnt-center container ">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <p className="font-md color-white mb-15 wow animate__animated animate__fadeIn" data-wow-delay=".0s">
                                    Your Gateway to Global Logistics Excellence
                                </p>
                                <h1 className="color-white mb-25 wow animate__animated animate__fadeInUp" data-wow-delay=".0s">
                                    Empowering the Future of <br className="d-none d-lg-block" />
                                    <span>Global Logistics & Networking</span>
                                </h1>

                                <div className="row">
                                    <div className="col-lg-6">
                                        <p className="font-md color-white wow animate__animated animate__fadeInUp mb-20" data-wow-delay=".0s">
                                            <p>
                                                Become part of a vibrant network focused on driving innovation and collaboration in logistics. Together, we unlock new possibilities in the
                                                <br className="d-none d-lg-block" />
                                                <span>global transportation and supply chain industry.</span>
                                            </p>
                                        </p>
                                    </div>
                                </div>
                                <div className="box-button mt-30 flex h-10 ">
                                    <Link className="btn btn-brand-1-big hover-up wow animate__animated animate__fadeInUp mr-40  " href="/pages/about">
                                        Explore
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
